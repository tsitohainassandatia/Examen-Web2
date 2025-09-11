import { Link, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import api from "../../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", {
        email,
        mot_de_passe: password, // 👈 doit matcher ton backend
      });

      alert("Connexion réussie ✅");

      // Stocker le token JWT pour les prochaines requêtes
      localStorage.setItem("token", res.data.token);

      // Redirection uniquement après un login réussi
      navigate("/home");

    } catch (error) {
      console.error(error);
      alert("Email ou mot de passe incorrect ❌");
    }
  };

  return (
    <div className="bg-gray-800 flex justify-center items-center h-screen">
      <div className="flex-row space-y-5 place-items-center bg-black text-center shadow-[0_0_10px] shadow-black rounded-4xl py-5 px-3.5 w-min">
        <h1 className="font-bold text-green-600 text-2xl">Expense tracker</h1>
        <hr className="w-48 border-b-2 border-gray-400"/>
        <br />
        <div className="w-min rounded-lg border-2 border-gray-400">
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="enter your email"
            className="py-1 px-1.5 rounded-lg w-68 focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-300 bg-black text-green-500"
          />
        </div>
        <br />
        <div className="text-left">
          <div className="w-min rounded-lg border-2 border-gray-400">
            <input 
              type="password"
              placeholder="enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="py-1 px-1.5 rounded-lg w-68 focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-300 bg-black text-green-500"
            />
          </div>
          <Link to='/forgotpassword' className="text-green-500 underline">forgot password?</Link>
        </div>
        <button 
          type="submit"
          onClick={handleSubmit}
          className="bg-green-800 font-bold text-white text-center py-1 px-2.5 rounded-lg hover:scale-110 duration-200"
        >
          Log in
        </button>
        <p className="text-white">Log in or <Link to='/signup' className="text-green-500 underline">Sign up</Link></p>
      </div>
    </div>
  );
}
