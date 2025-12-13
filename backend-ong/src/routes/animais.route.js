import { Router } from "express";
import {
    createAnimalController,
    getAnimaisController,
    getAnimalByIdController,
    updateAnimalController,
    deleteAnimalController,
} from "../controllers/animais.controller.js";
import { verifyToken } from "../controllers/auth.controller.js";


const router = Router();
router.post("/", createAnimalController);
router.get("/", getAnimaisController);
router.get("/:id", getAnimalByIdController);
router.put("/:id", updateAnimalController);
router.delete("/:id", verifyToken, deleteAnimalController);


export default router;