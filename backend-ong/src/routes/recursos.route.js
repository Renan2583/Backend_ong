import { Router } from "express";
import {
    createRecursoController,
    getRecursosController,
    getRecursoByIdController,
    updateRecursoController,
    deleteRecursoController,
    getRelatorioRecursosController,
} from "../controllers/recursos.controller.js";
import { verifyToken } from "../controllers/auth.controller.js";

const router = Router();

router.post("/", createRecursoController);
router.get("/", getRecursosController);
router.get("/relatorio", getRelatorioRecursosController);
router.get("/:id", getRecursoByIdController);
router.put("/:id", updateRecursoController);
router.delete("/:id", verifyToken, deleteRecursoController);

export default router;