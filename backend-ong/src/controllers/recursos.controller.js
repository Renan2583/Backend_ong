import {
    createRecurso,
    getRecursos,
    getRecursoById,
    updateRecurso,
    deleteRecurso,
    getRelatorioRecursos,
} from "../repositories/recursos.repo.js";

export async function createRecursoController(req, res) {
    try {
        const { tipo, nome, quantidade, valor, descricao } = req.body;

       
        if (!tipo || !nome) {
            return res.status(400).json({
                error: "Dados incompletos. 'tipo' e 'nome' são obrigatórios.",
            });
        }
       
        if (quantidade === undefined || quantidade === null) {
            return res.status(400).json({
                error: "Dados incompletos. 'quantidade' é obrigatória.",
            });
        }
        

        const novoId = await createRecurso({
            tipo,
            nome,
            quantidade,
            valor: valor || 0,
            descricao,
        });

        res.status(201).json({ id: novoId });
    } catch (error) {
        console.error("Erro em createRecursoController:", error);
        res.status(500).json({ error: "Erro ao criar recurso." });
    }
}

export async function getRecursosController(req, res) {
    try {
        const recursos = await getRecursos();
        res.status(200).json(recursos); 
    } catch (error) {
        console.error("Erro em getRecursosController:", error);
        res.status(500).json({ error: "Erro ao buscar recursos." });
    }
}

export async function getRecursoByIdController(req, res) {
    try {
        const { id } = req.params;
        const recurso = await getRecursoById(id);

        
        if (!recurso) {
            return res.status(404).json({ error: "Recurso não encontrado." });
        }
        

        res.status(200).json(recurso); 
    } catch (error) {
        console.error("Erro em getRecursoByIdController:", error);
        res.status(500).json({ error: "Erro ao buscar recurso." });
    }
}

export async function updateRecursoController(req, res) {
    try {
        const { id } = req.params;
        const { tipo, nome, quantidade, valor, descricao } = req.body; // 

       
        if (!tipo || !nome || (quantidade === undefined || quantidade === null)) {
            return res.status(400).json({
                error: "Dados incompletos. 'tipo', 'nome' e 'quantidade' são obrigatórios.",
            });
        }
       

        const affectedRows = await updateRecurso(id, {
            tipo,
            nome,
            quantidade,
            valor: valor || 0,
            descricao,
        });

        
        if (affectedRows === 0) {
            return res
                .status(404)
                .json({ error: "Recurso não encontrado para atualizar." });
        }
        

        res.status(200).json({ message: "Recurso atualizado com sucesso." });
    } catch (error) {
        console.error("Erro em updateRecursoController:", error);
        res.status(500).json({ error: "Erro ao atualizar recurso." });
    }
}

export async function deleteRecursoController(req, res) {
    try {
        const { id } = req.params;

        
        const affectedRows = await deleteRecurso(id);
      
    if (affectedRows === 0) {
            return res
                .status(404)
                .json({ error: "Recurso não encontrado para deletar." });
        }
      

        res.status(204).send(); 
    } catch (error) {
        console.error("Erro em deleteRecursoController:", error);
        res.status(500).json({ error: "Erro ao deletar recurso." });
    }
}

export async function getRelatorioRecursosController(req, res) {
    try {
        const relatorio = await getRelatorioRecursos();
        res.status(200).json(relatorio);
    } catch (error) {
        console.error("Erro em getRelatorioRecursosController:", error);
        res.status(500).json({ error: "Erro ao gerar relatório de recursos." });
    }
}