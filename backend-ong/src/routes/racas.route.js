import { Router } from "express";
import {
    createRacaController,
    getRacasController,
    getRacaByIdController,
    getRacasByEspecieController, // <-- Importante
    updateRacaController,
    deleteRacaController,
} from "../controllers/racas.controller.js";
import { verifyToken } from "../controllers/auth.controller.js";

const router = Router();

// Rota para CRIAR uma nova raça
router.post("/", createRacaController);

// Rota para LISTAR TODAS as raças
router.get("/", getRacasController);

// Rota ESPECIAL para listar raças DE UMA ESPÉCIE
// (Ex: GET /racas/especie/1 -> Traz todas as raças de 'Cachorro')
router.get("/especie/:especieId", getRacasByEspecieController);

// Rota para BUSCAR UMA raça pelo ID
router.get("/:id", getRacaByIdController);

// Rota para ATUALIZAR uma raça pelo ID
router.put("/:id", updateRacaController);

// Rota para DELETAR (Soft Delete) uma raça pelo ID
router.delete("/:id", verifyToken, deleteRacaController);

export default router;