import { Pool } from "pg"


const db = new Pool({
    user: "postgres",
    host: "localhost",
    database: "gestion_depense",
    password: "henintsoa",
    port: 5432,
});

export default db;