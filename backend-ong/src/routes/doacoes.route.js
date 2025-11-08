import { Router } from "express";
import { 
    createDoacaoController, 
    getDoacoesController, 
    getDoacaoByIdController, 
    deleteDoacaoController, 
    getDoacoesByPessoaController, 
    getDoacoesByRecursoController 
} from "../controllers/doacoes.controller.js";

const router = Router();

router.post("/", createDoacaoController);
router.get("/", getDoacoesController);
router.get("/:id", getDoacaoByIdController);
router.delete("/:id", deleteDoacaoController);


router.get("/pessoa/:pessoaId", getDoacoesByPessoaController);
router.get("/recurso/:recursoId", getDoacoesByRecursoController);

export default router;