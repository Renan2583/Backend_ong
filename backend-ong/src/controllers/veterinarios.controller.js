import {
    createVeterinario,
    getVeterinarios,
    getVeterinarioById,
    getVeterinarioByPessoaId, 
    updateVeterinario,
    deleteVeterinario,
} from "../repositories/veterinarios.repo.js";

export async function createVeterinarioController(req, res) {
    try {
        const { pessoaId, CRMV } = req.body;

       
        if (!pessoaId || !CRMV) {
            return res.status(400).json({
                error: "Dados incompletos. 'pessoaId' e 'CRMV' são obrigatórios.",
            });
        }
  
        const jaExiste = await getVeterinarioByPessoaId(pessoaId);
        if (jaExiste) {
            return res.status(409).json({
                error: "Esta pessoa já está cadastrada como veterinário.",
            });
        }
      

        const novoId = await createVeterinario({ pessoaId, CRMV });
        res.status(201).json({ id: novoId });

    } catch (error) {
        console.error("Erro em createVeterinarioController:", error);
        
        
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res
                .status(404)
                .json({ error: "A 'pessoaId' fornecida não existe." });
        }
        if (error.code === "ER_DUP_ENTRY") {
            return res
                .status(409)
                .json({ error: "Este CRMV já está cadastrado." });
        }
        
        res.status(500).json({ error: "Erro ao criar veterinário." });
    }
}

export async function getVeterinariosController(req, res) {
    try {
        const veterinarios = await getVeterinarios();
        res.status(200).json(veterinarios);
    } catch (error) {
        console.error("Erro em getVeterinariosController:", error);
        res.status(500).json({ error: "Erro ao buscar veterinários." });
    }
}

export async function getVeterinarioByIdController(req, res) {
    try {
        const { id } = req.params;
        const veterinario = await getVeterinarioById(id);

        
        if (!veterinario) {
            return res
                .status(404)
                .json({ error: "Veterinário não encontrado." });
        }
       

        res.status(200).json(veterinario);
    } catch (error) {
        console.error("Erro em getVeterinarioByIdController:", error);
        res.status(500).json({ error: "Erro ao buscar veterinário." });
    }
}

export async function updateVeterinarioController(req, res) {
    try {
        const { id } = req.params;
        const { CRMV } = req.body; 

      
        if (!CRMV) {
            return res
                .status(400)
                .json({ error: "O campo 'CRMV' é obrigatório." });
        }

        const affectedRows = await updateVeterinario(id, CRMV);

        
        if (affectedRows === 0) {
            return res
                .status(404)
                .json({ error: "Veterinário não encontrado para atualizar." });
        }
        

        res.status(200).json({ message: "Veterinário atualizado com sucesso." });
    } catch (error)
    {
        console.error("Erro em updateVeterinarioController:", error);
        
         if (error.code === "ER_DUP_ENTRY") {
            return res
                .status(409)
                .json({ error: "Este CRMV já está cadastrado." });
        }
        res.status(500).json({ error: "Erro ao atualizar veterinário." });
    }
}

export async function deleteVeterinarioController(req, res) {
    try {
        const { id } = req.params;
        const affectedRows = await deleteVeterinario(id);

        
        if (affectedRows === 0) {
            return res
                .status(404)
                .json({ error: "Veterinário não encontrado para deletar." });
        }
        

        res.status(204).send();
    } catch (error) {
        console.error("Erro em deleteVeterinarioController:", error);
        res.status(500).json({ error: "Erro ao deletar veterinário." });
    }
}