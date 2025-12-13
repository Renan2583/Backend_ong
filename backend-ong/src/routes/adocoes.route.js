import { Router } from "express";
import {
    createAdocaoController,
    getAdocoesController,
    getAdocaoByIdController,
    getAdocaoByAnimalIdController,
    getAdocoesByPessoaIdController,
    updateAdocaoController,
    deleteAdocaoController,
    getRelatorioAdocoesController,
} from "../controllers/adocoes.controller.js";
import { verifyToken } from "../controllers/auth.controller.js";

const router = Router();

// Rota para CRIAR (registrar) uma nova adoção
router.post("/", createAdocaoController);

// Rota para LISTAR TODAS as adoções
router.get("/", getAdocoesController);

// Rota para relatório de adoções
router.get("/relatorio", getRelatorioAdocoesController);

// Rota Bônus: Buscar adoção POR ANIMAL
router.get("/animal/:animalId", getAdocaoByAnimalIdController);

// Rota Bônus: Buscar adoções POR PESSOA
router.get("/pessoa/:pessoaId", getAdocoesByPessoaIdController);

// Rota para BUSCAR UMA adoção pelo ID
router.get("/:id", getAdocaoByIdController);

// Rota para ATUALIZAR uma adoção (ex: assinar o termo)
router.put("/:id", updateAdocaoController);

// Rota para DELETAR um registro de adoção
router.delete("/:id", verifyToken, deleteAdocaoController);

export default router;