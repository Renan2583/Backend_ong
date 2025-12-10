import {
    createAtendimento,
    getAtendimentosByAnimalId,
    getAtendimentoById,
    updateAtendimento,
    deleteAtendimento,
    getRelatorioAtendimentos,
} from "../repositories/atendimentos.repo.js";

export async function createAtendimentoController(req, res) {
    try {
        const { animalId, dataAtendimento, tipo, descricao } = req.body;

        // --- VALIDAÇÃO DE ENTRADA (ERRO 400) ---
        if (!animalId || !dataAtendimento || !tipo || !descricao) {
            return res.status(400).json({
                error: "Dados incompletos. 'animalId', 'dataAtendimento', 'tipo' e 'descricao' são obrigatórios.",
            });
        }
        // --- FIM VALIDAÇÃO ---

        const novoId = await createAtendimento(req.body);
        res.status(201).json({ id: novoId });

    } catch (error) {
        console.error("Erro em createAtendimentoController:", error);
        
        // Erro se o 'animalId' ou 'veterinarioId' não existir
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(404).json({
                error: "O 'animalId' ou 'veterinarioId' fornecido não existe.",
            });
        }
        
        res.status(500).json({ error: "Erro ao criar atendimento." });
    }
}

export async function getAtendimentosByAnimalIdController(req, res) {
    try {
        const { animalId } = req.params;
        const atendimentos = await getAtendimentosByAnimalId(animalId);
        
        // Não precisa de 404, um array vazio [] é uma resposta válida.
        res.status(200).json(atendimentos);

    } catch (error) {
        console.error("Erro em getAtendimentosByAnimalIdController:", error);
        res.status(500).json({ error: "Erro ao buscar atendimentos do animal." });
    }
}

export async function getAtendimentoByIdController(req, res) {
    try {
        const { id } = req.params;
        const atendimento = await getAtendimentoById(id);

        // --- VALIDAÇÃO 404 ---
        if (!atendimento) {
            return res
                .status(404)
                .json({ error: "Atendimento não encontrado." });
        }
        // --- FIM VALIDAÇÃO 404 ---

        res.status(200).json(atendimento);
    } catch (error) {
        console.error("Erro em getAtendimentoByIdController:", error);
        res.status(500).json({ error: "Erro ao buscar atendimento." });
    }
}

export async function updateAtendimentoController(req, res) {
    try {
        const { id } = req.params;
        const { dataAtendimento, tipo, descricao } = req.body;

        // --- VALIDAÇÃO DE ENTRADA (ERRO 400) ---
        if (!dataAtendimento || !tipo || !descricao) {
            return res.status(400).json({
                error: "Dados incompletos. 'dataAtendimento', 'tipo' e 'descricao' são obrigatórios.",
            });
        }
        // --- FIM VALIDAÇÃO 400 ---

        const affectedRows = await updateAtendimento(id, req.body);

        // --- VALIDAÇÃO 404 ---
        if (affectedRows === 0) {
            return res
                .status(404)
                .json({ error: "Atendimento não encontrado para atualizar." });
        }
        // --- FIM VALIDAÇÃO 404 ---

        res.status(200).json({ message: "Atendimento atualizado com sucesso." });
    } catch (error) {
        console.error("Erro em updateAtendimentoController:", error);
        
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(404).json({
                error: "O 'veterinarioId' fornecido não existe.",
            });
        }
        
        res.status(500).json({ error: "Erro ao atualizar atendimento." });
    }
}

export async function deleteAtendimentoController(req, res) {
    try {
        const { id } = req.params;
        const affectedRows = await deleteAtendimento(id);

        // --- VALIDAÇÃO 404 ---
        if (affectedRows === 0) {
            return res
                .status(404)
                .json({ error: "Atendimento não encontrado para deletar." });
        }
        // --- FIM VALIDAÇÃO 404 ---

        res.status(204).send();
    } catch (error) {
        console.error("Erro em deleteAtendimentoController:", error);
        res.status(500).json({ error: "Erro ao deletar atendimento." });
    }
}

export async function getRelatorioAtendimentosController(req, res) {
    try {
        const relatorio = await getRelatorioAtendimentos();
        res.status(200).json(relatorio);
    } catch (error) {
        console.error("Erro em getRelatorioAtendimentosController:", error);
        res.status(500).json({ error: "Erro ao gerar relatório de atendimentos." });
    }
}