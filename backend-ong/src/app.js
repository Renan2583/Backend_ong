import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import especiesRoutes from "./routes/especies.route.js";
import pessoasRoutes from "./routes/pessoas.route.js";
import recursosRoutes from "./routes/recursos.route.js";
import doacoesRoutes from "./routes/doacoes.route.js";
import racasRoutes from "./routes/racas.route.js";
import veterinariosRoutes from "./routes/veterinarios.route.js";
import animaisRoutes from "./routes/animais.route.js";
import atendimentosRoutes from "./routes/atendimentos.route.js";
import adocoesRoutes from "./routes/adocoes.route.js";
import authRoutes from "./routes/auth.route.js";






const app = express();
app.use(cors());
app.use(express.json());




app.use("/especies", especiesRoutes);
app.use("/pessoas", pessoasRoutes);
app.use("/recursos", recursosRoutes);
app.use("/doacoes", doacoesRoutes);
app.use("/racas", racasRoutes);
app.use("/veterinarios", veterinariosRoutes);
app.use("/animais", animaisRoutes);
app.use("/atendimentos", atendimentosRoutes);
app.use("/adocoes", adocoesRoutes);
app.use("/auth", authRoutes);







export default app;