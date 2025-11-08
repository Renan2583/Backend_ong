import { Router } from "express";
import {
    createPessoaController,
    getPessoasController,
    getPessoaByIdController, 
    updatePessoaController, 
    deletePessoaController }
from "../controllers/pessoas.controller.js";


const router = Router();
router.post("/", createPessoaController);
router.get("/", getPessoasController);
router.get("/:id", getPessoaByIdController);
router.put("/:id", updatePessoaController);
router.delete("/:id", deletePessoaController);

export default router;