import { Router } from "express";
import {
    createVeterinarioController,
    getVeterinariosController,
    getVeterinarioByIdController,
    updateVeterinarioController,
    deleteVeterinarioController,
} from "../controllers/veterinarios.controller.js";

const router = Router();
router.post("/", createVeterinarioController);
router.get("/", getVeterinariosController);
router.get("/:id", getVeterinarioByIdController);
router.put("/:id", updateVeterinarioController);
router.delete("/:id", deleteVeterinarioController);

export default router;