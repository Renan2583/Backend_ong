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
import historicoExclusoesRoutes from "./routes/historico_exclusoes.route.js";






const app = express();
app.use(cors({
  origin: "http://localhost:5173", // domínio do frontend
  credentials: true // permite envio de cookies / auth headers
}));
app.use(express.json({ limit: '10mb' })); // Aumentar limite para 10MB para suportar imagens em base64
app.use(express.urlencoded({ extended: true, limit: '10mb' }));




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
app.use("/historico-exclusoes", historicoExclusoesRoutes);







export default app;