import { Router } from "express";
import { 
    getHistoricoExclusoesController,
    getHistoricoExclusaoByTipoController,
    restaurarExclusaoController,
    verificarSeFoiRestauradoController
} from "../controllers/historico_exclusoes.controller.js";
import { verifyToken } from "../controllers/auth.controller.js";

const router = Router();

// Todas as rotas requerem autenticação
router.use(verifyToken);

router.get("/", getHistoricoExclusoesController);
router.get("/verificar/:tipoEntidade/:entidadeId", verificarSeFoiRestauradoController);
router.post("/:id/restaurar", restaurarExclusaoController);
router.get("/:tipo", getHistoricoExclusaoByTipoController);

export default router;

