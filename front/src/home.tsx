import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Categories from "./pages/Categories";

export default function Home() {
  const [page, setPage] = useState<"dashboard" | "expenses" | "categories">("dashboard");
  const navigate = useNavigate();

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token"); // supprime le token
    navigate("/login"); // redirige vers login
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-neutral-900 text-emerald-900 dark:text-emerald-200">
      
      {/* Navbar verticale */}
      <nav className="w-48  bg-emerald-100 dark:bg-neutral-800 p-6 flex flex-col justify-center space-y-4">
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

        <button
          onClick={handleLogout}
          className="mt-4 bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700 transition"
        >
          Déconnexion
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
