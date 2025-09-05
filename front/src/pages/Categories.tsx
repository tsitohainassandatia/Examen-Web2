import React, { useEffect, useState } from "react";
import axios from "axios";


const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

type Category = {
  id: number;
  name: string;
  is_default: number;
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/api/categories`);
      setCategories(res.data);
      setLoading(false);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async () => {
    if (!newName) return;
    try {
      const res = await axios.post(`${API}/api/categories`, { name: newName });
      setCategories([...categories, res.data]);
      setNewName("");
    } catch (e: any) {
      alert("Erreur: " + e.response?.data?.error || e.message);
    }
  };

  const renameCategory = async (id: number) => {
    const name = prompt("Nouveau nom ?");
    if (!name) return;
    try {
      const res = await axios.put(`${API}/api/categories/${id}`, { name });
      setCategories(categories.map(c => (c.id === id ? res.data : c)));
    } catch (e: any) {
      alert("Erreur: " + e.response?.data?.error || e.message);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!window.confirm("Supprimer cette catégorie ?")) return;
    try {
      await axios.delete(`${API}/api/categories/${id}`);
      setCategories(categories.filter(c => c.id !== id));
    } catch (e: any) {
      alert("Erreur: " + e.response?.data?.error || e.message);
    }
  };

  if (loading) return <div className="p-6">Chargement…</div>;
  if (error) return <div className="p-6 text-red-500">Erreur: {error}</div>;

  return (
    <div className="min-h-screen p-6 bg-white text-emerald-900 dark:bg-neutral-900 dark:text-emerald-200">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Catégories</h1>
          
        </header>

        <div className="flex gap-2">
          <input
            className="flex-1 p-2 rounded border border-gray-300 dark:border-neutral-700"
            placeholder="Nouvelle catégorie"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            onClick={addCategory}
          >
            Ajouter
          </button>
        </div>

        <ul className="space-y-2">
          {categories.map(cat => (
            <li
              key={cat.id}
              className="flex justify-between p-2 rounded border border-gray-200 dark:border-neutral-700 items-center"
            >
              <span>{cat.name} {cat.is_default ? "(par défaut)" : ""}</span>
              {!cat.is_default && (
                <div className="flex gap-2">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={() => renameCategory(cat.id)}
                  >
                    Renommer
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => deleteCategory(cat.id)}
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
