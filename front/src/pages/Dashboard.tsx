import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { eventBus } from "../utils/eventBus"; // ajuste le chemin si besoin

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

type MonthlySummary = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

type CategoryExpense = {
  category: string;
  total: number;
};

export default function Dashboard() {
  const [data, setData] = useState<MonthlySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [initialSetup, setInitialSetup] = useState(true);
  const [userIncome, setUserIncome] = useState<number>(0);
  const [userBudget, setUserBudget] = useState<number>(0);

  const [showChart, setShowChart] = useState(false);
  const [categoryData, setCategoryData] = useState<CategoryExpense[]>([]);

  // Charger les valeurs depuis localStorage
  useEffect(() => {
    const storedIncome = localStorage.getItem("userIncome");
    const storedBudget = localStorage.getItem("userBudget");

    if (storedIncome && storedBudget) {
      setUserIncome(parseFloat(storedIncome));
      setUserBudget(parseFloat(storedBudget));
      setInitialSetup(false);
    }
  }, []);

  // Charger les données et diagramme
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/summary/monthly`);
      setData(res.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
      setLoading(false);
    }
  };

  const fetchCategoryExpenses = async () => {
    try {
      const res = await axios.get(`${API}/api/expenses`);
      const expenses = res.data as { amount: number; category: string }[];

      const totals: Record<string, number> = {};
      expenses.forEach(e => {
        totals[e.category] = (totals[e.category] || 0) + e.amount;
      });

      const chartData: CategoryExpense[] = Object.entries(totals).map(([category, total]) => ({ category, total }));
      setCategoryData(chartData);
      setShowChart(true);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la récupération des données du diagramme.");
    }
  };

  // Effet principal
  useEffect(() => {
    if (!initialSetup) {
      fetchData();
      fetchCategoryExpenses();
    }

    // S'abonner aux mises à jour des dépenses via eventBus
    const unsubscribe = eventBus.subscribe(() => {
      fetchData();
      fetchCategoryExpenses();
    });

    return () => unsubscribe();
  }, [initialSetup]);

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userIncome <= 0 || userBudget <= 0) {
      alert("Veuillez entrer des valeurs valides pour le revenu et le budget.");
      return;
    }
    localStorage.setItem("userIncome", userIncome.toString());
    localStorage.setItem("userBudget", userBudget.toString());
    setInitialSetup(false);
  };

  const handleNew = () => {
    localStorage.removeItem("userIncome");
    localStorage.removeItem("userBudget");
    setUserIncome(0);
    setUserBudget(0);
    setData(null);
    setShowChart(false);
    setCategoryData([]);
    setInitialSetup(true);
  };

  return (
    <div className="min-h-screen p-6 bg-white text-emerald-900 dark:bg-neutral-900 dark:text-emerald-200">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          {!initialSetup && (
            <button
              onClick={handleNew}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Nouveau
            </button>
          )}
        </header>

        {initialSetup ? (
          <form onSubmit={handleInitialSubmit} className="space-y-4 bg-emerald-50 dark:bg-neutral-800 p-6 rounded-xl shadow max-w-md mx-auto">
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Revenu mensuel (Ar)</label>
              <input
                type="number"
                value={userIncome}
                onChange={e => setUserIncome(parseFloat(e.target.value))}
                className="p-2 border rounded w-full"
                min={0}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Budget mensuel (Ar)</label>
              <input
                type="number"
                value={userBudget}
                onChange={e => setUserBudget(parseFloat(e.target.value))}
                className="p-2 border rounded w-full"
                min={0}
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 w-full"
            >
              Commencer
            </button>
          </form>
        ) : (
          <>
            {loading && <div className="animate-pulse">Chargement…</div>}
            {error && <div className="text-red-500">Erreur: {error}</div>}

            {data && (
              <div className="space-y-4">
                {data.totalExpense > userBudget && (
                  <div className="bg-red-500 text-white p-4 rounded">
                    ⚠️ Vous avez dépassé votre budget ce mois-ci de {(data.totalExpense - userBudget).toFixed(2)} Ar
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="rounded-2xl p-4 bg-emerald-50 dark:bg-neutral-800 shadow">
                    <div className="text-sm opacity-80">Revenus</div>
                    <div className="text-3xl font-semibold">{userIncome.toFixed(2)} Ar</div>
                  </div>

                  <div className="rounded-2xl p-4 bg-emerald-50 dark:bg-neutral-800 shadow">
                    <div className="text-sm opacity-80">Budget</div>
                    <div className="text-3xl font-semibold">{userBudget.toFixed(2)} Ar</div>
                  </div>

                  <div className="rounded-2xl p-4 bg-emerald-50 dark:bg-neutral-800 shadow">
                    <div className="text-sm opacity-80">Dépenses</div>
                    <div className="text-3xl font-semibold">{data.totalExpense.toFixed(2)} Ar</div>
                  </div>

                  <div className="rounded-2xl p-4 bg-emerald-50 dark:bg-neutral-800 shadow">
                    <div className="text-sm opacity-80">Solde</div>
                    <div className={`text-3xl font-semibold ${userIncome - data.totalExpense >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {Math.max(userIncome - data.totalExpense, 0).toFixed(2)} Ar
                    </div>
                  </div>
                </div>

                <button
                  onClick={fetchCategoryExpenses}
                  className="mt-6 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                >
                  Voir diagramme des dépenses par catégorie
                </button>

                {showChart && (
                  <div className="mt-6 w-full h-64 bg-emerald-50 dark:bg-neutral-800 p-4 rounded shadow">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="total" fill="#16a34a" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
