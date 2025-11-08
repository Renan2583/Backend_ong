import { Router } from "express";
import {
    createAtendimentoController,
    getAtendimentosByAnimalIdController, 
    getAtendimentoByIdController, 
    updateAtendimentoController, 
    deleteAtendimentoController,
} from "../controllers/atendimentos.controller.js";

const router = Router();

router.post("/", createAtendimentoController);
router.get("/animal/:animalId", getAtendimentosByAnimalIdController);
router.get("/:id", getAtendimentoByIdController);
router.put("/:id", updateAtendimentoController);
router.delete("/:id", deleteAtendimentoController);

export default router;