import {
    createEspecie,
    getEspecies,
    getEspecieById,
    updateEspecie,
    deleteEspecie,
} from "../repositories/especies.repo.js";

export async function createEspecieController(req, res) {
    const { nome } = req.body;
    try {
        
        if (!nome) {
            return res.status(400).json({ error: "O campo 'nome' é obrigatório." });
        }
        

        const id = await createEspecie(nome);
        res.status(201).json({ id }); // 201 Created é perfeito
    } catch (error) {
        
        console.error("Erro em createEspecieController:", error);
        res.status(500).json({ error: "Erro ao criar espécie" });
    }
}

export async function getEspeciesController(req, res) {
    try {
        const especies = await getEspecies();
        res.status(200).json(especies);
    } catch (error) {
        console.error("Erro em getEspeciesController:", error);
        res.status(500).json({ error: "Erro ao buscar espécies" });
    }
}

export async function getEspecieByIdController(req, res) {
    const { id } = req.params;
    try {
        const especie = await getEspecieById(id);

       
        if (!especie) {
            return res.status(404).json({ error: "Espécie não encontrada." });
        }
        

        res.status(200).json(especie);
    } catch (error) {
        console.error("Erro em getEspecieByIdController:", error);
        res.status(500).json({ error: "Erro ao buscar espécie" });
    }
}

export async function updateEspecieController(req, res) {
    const { id } = req.params;
    const { nome } = req.body;
    try {
      
        if (!nome) {
            return res.status(400).json({ error: "O campo 'nome' é obrigatório." });
        }
        

        const affectedRows = await updateEspecie(id, nome);

       
        if (affectedRows === 0) {
            return res.status(404).json({ error: "Espécie não encontrada para atualizar." });
        }
        

        res.status(200).json({ message: "Espécie atualizada com sucesso" });
    } catch (error) {
        console.error("Erro em updateEspecieController:", error);
        res.status(500).json({ error: "Erro ao atualizar espécie" });
    }
}

export async function deleteEspecieController(req, res) {
    const { id } = req.params;
    try {
        const affectedRows = await deleteEspecie(id);

        
        if (affectedRows === 0) {
            return res.status(404).json({ error: "Espécie não encontrada para deletar." });
        }
      
        res.status(204).send();
    } catch (error) {
        console.error("Erro em deleteEspecieController:", error);
        res.status(500).json({ error: "Erro ao deletar espécie" });
    }
}