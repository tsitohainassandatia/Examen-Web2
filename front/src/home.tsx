import React, { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Categories from "./pages/Categories";

export default function Home() {
  const [page, setPage] = useState<"dashboard" | "expenses" | "categories">("dashboard");

  // 🔹 Vérifie si l’utilisateur est connecté
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login"; // pas de token → redirige vers login
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-white dark:bg-neutral-900 text-emerald-900 dark:text-emerald-200">
      {/* Navbar verticale */}
      <nav className="w-48 bg-emerald-100 dark:bg-neutral-800 p-6 flex flex-col space-y-4">
        <h2 className="text-xl font-bold mb-4">Expense Tracker</h2>
        <button
          className={`text-left p-2 rounded hover:bg-emerald-200 dark:hover:bg-neutral-700 ${
            page === "dashboard" ? "bg-emerald-200 dark:bg-neutral-700" : ""
          }`}
          onClick={() => setPage("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`text-left p-2 rounded hover:bg-emerald-200 dark:hover:bg-neutral-700 ${
            page === "expenses" ? "bg-emerald-200 dark:bg-neutral-700" : ""
          }`}
          onClick={() => setPage("expenses")}
        >
          Dépenses
        </button>
        <button
          className={`text-left p-2 rounded hover:bg-emerald-200 dark:hover:bg-neutral-700 ${
            page === "categories" ? "bg-emerald-200 dark:bg-neutral-700" : ""
          }`}
          onClick={() => setPage("categories")}
        >
          Catégories
        </button>
      </nav>

      {/* Contenu principal */}
      <main className="flex-1 p-6 overflow-auto">
        {page === "dashboard" && <Dashboard />}
        {page === "expenses" && <Expenses />}
        {page === "categories" && <Categories />}
      </main>
    </div>
  );
}
