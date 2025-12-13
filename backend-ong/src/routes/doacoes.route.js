import { Router } from "express";
import { 
    createDoacaoController, 
    getDoacoesController, 
    getDoacaoByIdController,
    updateDoacaoController,
    deleteDoacaoController, 
    getDoacoesByPessoaController, 
    getDoacoesByRecursoController,
    getRelatorioDoacoesController
} from "../controllers/doacoes.controller.js";
import { verifyToken } from "../controllers/auth.controller.js";

const router = Router();

router.post("/", createDoacaoController);
router.get("/", getDoacoesController);
router.get("/relatorio", getRelatorioDoacoesController);
router.get("/:id", getDoacaoByIdController);
router.put("/:id", updateDoacaoController);
router.delete("/:id", verifyToken, deleteDoacaoController);


router.get("/pessoa/:pessoaId", getDoacoesByPessoaController);
router.get("/recurso/:recursoId", getDoacoesByRecursoController);

export default router;