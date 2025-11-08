import { Router } from "express";
import {
    createEspecieController,
    getEspeciesController,
    getEspecieByIdController, 
    updateEspecieController,
    deleteEspecieController,
} from "../controllers/especies.controller.js";


const router = Router();
router.post("/", createEspecieController);
router.get("/", getEspeciesController);
router.get("/:id", getEspecieByIdController);

export default router;