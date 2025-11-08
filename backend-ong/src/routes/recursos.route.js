import { Router } from "express";
import {
    createRecursoController,
    getRecursosController,
    getRecursoByIdController,
    updateRecursoController,
    deleteRecursoController,
} from "../controllers/recursos.controller.js";

const router = Router();

router.post("/", createRecursoController);
router.get("/", getRecursosController);
router.get("/:id", getRecursoByIdController);
router.put("/:id", updateRecursoController);
router.delete("/:id", deleteRecursoController);

export default router;