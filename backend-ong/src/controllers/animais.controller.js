import {
    createAnimal,
    getAnimais,
    getAnimalById,
    updateAnimal,
    deleteAnimal,
} from "../repositories/animais.repo.js";

export async function createAnimalController(req, res) {
    try {
        const { nome, racasId } = req.body;

        
        if (!nome || !racasId) {
            return res.status(400).json({
                error: "Dados incompletos. 'nome' e 'racasId' são obrigatórios.",
            });
        }
       
        const novoId = await createAnimal(req.body);
        res.status(201).json({ id: novoId });

    } catch (error) {
        console.error("Erro em createAnimalController:", error);
        
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res
                .status(404)
                .json({ error: "A 'racasId' (raça) fornecida não existe." });
        }
        res.status(500).json({ error: "Erro ao criar animal." });
    }
}

export async function getAnimaisController(req, res) {
    try {
        const animais = await getAnimais();
        res.status(200).json(animais);
    } catch (error) {
        console.error("Erro em getAnimaisController:", error);
        res.status(500).json({ error: "Erro ao buscar animais." });
    }
}

export async function getAnimalByIdController(req, res) {
    try {
        const { id } = req.params;
        const animal = await getAnimalById(id);

        if (!animal) {
            return res.status(404).json({ error: "Animal não encontrado." });
        }
        res.status(200).json(animal);

    } catch (error) {
        console.error("Erro em getAnimalByIdController:", error);
        res.status(500).json({ error: "Erro ao buscar animal." });
    }
}

export async function updateAnimalController(req, res) {
    try {
        const { id } = req.params;
        const { nome, racasId } = req.body;

        
        if (!nome || !racasId) {
            return res.status(400).json({
                error: "Dados incompletos. 'nome' e 'racasId' são obrigatórios.",
            });
        }
       

        const affectedRows = await updateAnimal(id, req.body);

        if (affectedRows === 0) {
            return res
                .status(404)
                .json({ error: "Animal não encontrado para atualizar." });
        }
        res.status(200).json({ message: "Animal atualizado com sucesso." });

    } catch (error) {
        console.error("Erro em updateAnimalController:", error);
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res
                .status(404)
                .json({ error: "A 'racasId' (raça) fornecida não existe." });
        }
        res.status(500).json({ error: "Erro ao atualizar animal." });
    }
}

export async function deleteAnimalController(req, res) {
    try {
        const { id } = req.params;
        const affectedRows = await deleteAnimal(id);

        if (affectedRows === 0) {
            return res
                .status(404)
                .json({ error: "Animal não encontrado para deletar." });
        }
        res.status(204).send();

    } catch (error) {
        console.error("Erro em deleteAnimalController:", error);
        res.status(500).json({ error: "Erro ao deletar animal." });
    }
}