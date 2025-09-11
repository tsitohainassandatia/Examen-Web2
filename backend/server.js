import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import dayjs from "dayjs";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Backend Expense Tracker is running!");
});

const db = new Database("./data.sqlite");
db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  is_default INTEGER NOT NULL DEFAULT 0,
  user_id INTEGER NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount REAL NOT NULL,
  date TEXT NOT NULL,
  category_id INTEGER NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'one_time',
  start_date TEXT,
  end_date TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  user_id INTEGER NOT NULL,
  FOREIGN KEY(category_id) REFERENCES categories(id),
  FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS incomes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount REAL NOT NULL,
  date TEXT NOT NULL,
  source TEXT,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  user_id INTEGER NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
`);

// -------------------------
// Seed minimal
// -------------------------
const ensureSeed = () => {
  const user = db.prepare("SELECT * FROM users LIMIT 1").get();
  let userId = user?.id;

  if (!userId) {
    const info = db.prepare("INSERT INTO users (username) VALUES (?)").run("demo");
    userId = info.lastInsertRowid;
  }

  const catCount = db.prepare("SELECT COUNT(*) as c FROM categories WHERE user_id=?").get(userId).c;
  if (catCount === 0) {
    const defaults = ["Alimentation", "Transport", "Logement", "Loisirs"];
    const stmt = db.prepare("INSERT INTO categories (name, is_default, user_id) VALUES (?, 1, ?)");
    defaults.forEach((n) => stmt.run(n, userId));
  }

  const expCount = db.prepare("SELECT COUNT(*) as c FROM expenses WHERE user_id=?").get(userId).c;
  const incCount = db.prepare("SELECT COUNT(*) as c FROM incomes WHERE user_id=?").get(userId).c;
  const today = dayjs().format("YYYY-MM-DD");

  if (incCount === 0) {
    db.prepare(
      "INSERT INTO incomes (amount, date, source, description, user_id) VALUES (?, ?, ?, ?, ?)"
    ).run(1200, today, "Salaire", "Seed income", userId);
  }

  if (expCount === 0) {
    db.prepare(
      "INSERT INTO expenses (amount, date, category_id, description, user_id) VALUES (?, ?, ?, ?, ?)"
    ).run(50, today, 1, "Courses", userId);
  }
};

ensureSeed();

// -------------------------
// ROUTE RÉSUMÉ MENSUEL
// -------------------------
app.get("/api/summary/monthly", (req, res) => {
  const userId = 1;
  const currentMonth = dayjs().format("YYYY-MM");

  const totalIncome = db
    .prepare("SELECT COALESCE(SUM(amount),0) as total FROM incomes WHERE user_id=? AND substr(date,1,7)=?")
    .get(userId, currentMonth).total;

  const totalExpense = db
    .prepare("SELECT COALESCE(SUM(amount),0) as total FROM expenses WHERE user_id=? AND substr(date,1,7)=?")
    .get(userId, currentMonth).total;

  res.json({
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense
  });
});

// -------------------------
// ROUTES DÉPENSES
// -------------------------
app.get("/api/expenses", (req, res) => {
  const userId = 1;
  const expenses = db
    .prepare(`
      SELECT e.id, e.amount, e.date, e.description, c.name as category
      FROM expenses e
      JOIN categories c ON e.category_id = c.id
      WHERE e.user_id = ?
      ORDER BY e.date DESC
    `)
    .all(userId);
  res.json(expenses);
});

app.post("/api/expenses", (req, res) => {
  const { amount, date, category_id, description } = req.body;
  if (!amount || !date || !category_id) {
    return res.status(400).json({ error: "amount, date et category_id requis" });
  }
  const userId = 1;
  const info = db
    .prepare(
      "INSERT INTO expenses (amount, date, category_id, description, user_id) VALUES (?, ?, ?, ?, ?)"
    )
    .run(amount, date, category_id, description || "", userId);

  const expense = db.prepare("SELECT * FROM expenses WHERE id=?").get(info.lastInsertRowid);
  res.json(expense);
});

// -------------------------
// Supprimer une dépense
// -------------------------
app.delete("/api/expenses/:id", (req, res) => {
  const { id } = req.params;
  try {
    const info = db.prepare("DELETE FROM expenses WHERE id=?").run(id);
    if (info.changes === 0) {
      return res.status(404).json({ error: "Dépense non trouvée" });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la suppression de la dépense" });
  }
});

// -------------------------
// ROUTES CATÉGORIES
// -------------------------
app.get("/api/categories", (req, res) => {
  const userId = 1;
  const categories = db
    .prepare("SELECT id, name, is_default FROM categories WHERE user_id=? ORDER BY id")
    .all(userId);
  res.json(categories);
});

app.post("/api/categories", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "name requis" });

  const userId = 1;
  const info = db
    .prepare("INSERT INTO categories (name, is_default, user_id) VALUES (?, 0, ?)")
    .run(name, userId);

  const category = db.prepare("SELECT * FROM categories WHERE id=?").get(info.lastInsertRowid);
  res.json(category);
});

app.put("/api/categories/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "name requis" });

  db.prepare("UPDATE categories SET name=? WHERE id=?").run(name, id);
  const category = db.prepare("SELECT * FROM categories WHERE id=?").get(id);
  res.json(category);
});

app.delete("/api/categories/:id", (req, res) => {
  const { id } = req.params;
  const count = db.prepare("SELECT COUNT(*) as c FROM expenses WHERE category_id=?").get(id).c;
  if (count > 0) return res.status(400).json({ error: "Impossible de supprimer une catégorie utilisée" });

  db.prepare("DELETE FROM categories WHERE id=?").run(id);
  res.json({ success: true });
});

// -------------------------
// ROUTES REVENUS
// -------------------------
app.get("/api/incomes", (req, res) => {
  const userId = 1;
  try {
    const incomes = db
      .prepare(`
        SELECT id, amount, date, source, description
        FROM incomes
        WHERE user_id=?
        ORDER BY date DESC
      `)
      .all(userId);
    res.json(incomes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération des revenus" });
  }
});

app.post("/api/incomes", (req, res) => {
  const { amount, date, source, description } = req.body;

  if (!amount || !date) {
    return res.status(400).json({ error: "amount et date requis" });
  }

  const userId = 1;
  try {
    const info = db
      .prepare(`
        INSERT INTO incomes (amount, date, source, description, user_id)
        VALUES (?, ?, ?, ?, ?)
      `)
      .run(amount, date, source || "", description || "", userId);

    const income = db.prepare("SELECT * FROM incomes WHERE id=?").get(info.lastInsertRowid);
    res.json(income);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'ajout du revenu" });
  }
});

// -------------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
