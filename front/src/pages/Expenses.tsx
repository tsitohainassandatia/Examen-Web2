import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

type Category = { id: number; name: string };
type Expense = {
  id: number;
  amount: number;
  date: string;
  description: string;
  category: string;
};

export default function Expenses() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const fetchCategories = async () => {
    const res = await axios.get(`${API}/api/categories`);
    setCategories(res.data);
    if (res.data.length > 0) setCategoryId(res.data[0].id);
  };

  const fetchExpenses = async () => {
    const res = await axios.get(`${API}/api/expenses`);
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchCategories();
    fetchExpenses();
  }, []);

  const submit = async () => {
    if (!amount || !date || !categoryId) return alert("Remplir tous les champs");

    await axios.post(`${API}/api/expenses`, {
      amount: parseFloat(amount),
      date,
      category_id: categoryId,
      description,
    });

    setAmount("");
    setDate("");
    setDescription("");
    fetchExpenses();
  };

  // Fonction pour supprimer une dépense
  const deleteExpense = async (id: number) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette dépense ?")) return;

    try {
      await axios.delete(`${API}/api/expenses/${id}`);
      fetchExpenses();
      if (selectedExpense?.id === id) setSelectedExpense(null);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white text-emerald-900 dark:bg-neutral-900 dark:text-emerald-200 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dépenses</h1>

      <div className="flex gap-6">
        {/* Formulaire à gauche */}
        <div className="w-1/3 space-y-4">
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Montant</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Catégorie</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className={`px-3 py-1 rounded border ${
                    categoryId === cat.id
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "border-gray-300 dark:border-neutral-700"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Description</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>

          <button
            onClick={submit}
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 w-full mt-2"
          >
            Ajouter la dépense
          </button>
        </div>

        {/* Liste des dépenses à droite */}
        <div className="w-2/3 space-y-2 relative">
          {expenses.map(exp => (
            <div
              key={exp.id}
              className="flex justify-between items-center p-2 rounded border border-gray-200 dark:border-neutral-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800"
            >
              <div className="flex flex-col" onClick={() => setSelectedExpense(exp)}>
                <div className="font-semibold">{exp.amount.toFixed(2)} Ar</div>
                <div className="text-sm opacity-80">{exp.date} - {exp.category}</div>
                {exp.description && <div className="text-sm">{exp.description}</div>}
              </div>
              <button
                onClick={() => deleteExpense(exp.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 ml-4"
              >
                Supprimer
              </button>
            </div>
          ))}

          {/* Reçu centré et beaucoup plus bas */}
          {selectedExpense && (
            <div className="mt-24 flex justify-center">
              <div className="bg-white text-black p-4 rounded shadow-md w-2/3">
                <h2 className="font-bold text-lg mb-2">Reçu</h2>
                <div>Montant : {selectedExpense.amount.toFixed(2)} Ar</div>
                <div>Date : {selectedExpense.date}</div>
                <div>Catégorie : {selectedExpense.category}</div>
                {selectedExpense.description && <div>Description : {selectedExpense.description}</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
