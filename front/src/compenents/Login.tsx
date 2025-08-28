import { Link } from "react-router-dom";
import api from "../services/api";
import { useState, type FormEvent } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", {
        email,
        mot_de_pass: password, // 👈 doit matcher le backend
      });
      alert("Connexion réussie ✅");
      console.log(res.data);

      // Stocker le token JWT pour les prochaines requêtes
      localStorage.setItem("token", res.data.token);

    } catch (error) {
      console.error(error);
      alert("Erreur lors de la connexion ❌");
    }
  };

  return (
    <div className="bg-green-50 flex justify-center items-center h-screen">
      <div className="flex-row space-y-5 place-items-center bg-white text-center shadow-[0_0_10px] shadow-gray-400 rounded-4xl py-5 px-3.5 w-min">
        <h1 className="font-bold text-2xl">Expense tracker</h1>
        <hr className="w-48 border-b-2 border-gray-400" />
        <br />
        <div className="w-min rounded-lg border-2 border-gray-400">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="enter your email"
            className="py-1 px-1.5 rounded-lg w-68 focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-300 bg-green-50"
          />
        </div>

        <br />
        <div className="w-min rounded-lg border-2 border-gray-400">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="enter your password"
            className="py-1 px-1.5 rounded-lg w-68 focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-300 bg-green-50"
          />
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-emerald-700 font-bold text-white py-1 px-2.5 rounded-lg hover:scale-110 duration-200"
        >
          Log in
        </button>
        <p>
          Don't have an account?{" "}
          <Link to="/signup" className="text-emerald-700 underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
