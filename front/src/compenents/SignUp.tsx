import { Link } from "react-router-dom";
import api from "../services/api";
import type { FormEvent } from "react";
import { useState } from "react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", {
        email,
        mot_de_pass: password,
      });

      alert(res.data.message); // ✅ Compte créé avec succès
      console.log(res.data);
      setEmail("");
      setPassword("");
    } catch (error: any) {
      console.error(error.response?.data || error);
      alert(error.response?.data?.error || "Erreur lors de l'inscription");
    }
  };

  return (
    <div className="bg-green-50 flex justify-center items-center h-screen">
      <div className="flex-col space-y-5 place-items-center bg-white text-center shadow-[0_0_10px] shadow-gray-400 rounded-4xl py-5 px-3.5 w-min">
        <h1 className="font-bold text-2xl">Expense tracker</h1>
        <hr className="w-48 border-b-2 border-gray-400" />
        <div className="w-min rounded-lg border-2 border-gray-400">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="py-1 px-1.5 rounded-lg w-68 focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-300 bg-green-50"
          />
        </div>
        <div className="w-min rounded-lg border-2 border-gray-400">
          <input
            type="password"
            placeholder="Create your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="py-1 px-1.5 rounded-lg w-68 focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-300 bg-green-50"
          />
        </div>
        <button
          type="submit"
          className="bg-emerald-700 font-bold text-white text-center py-1 px-2.5 rounded-lg hover:scale-110 duration-200"
          onClick={handleSubmit}
        >
          Sign up
        </button>
        <p>
          Do you already have an account?{" "}
          <Link to="/login" className="text-emerald-700 underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
