import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000", // l'URL de ton backend
});

export default api;
