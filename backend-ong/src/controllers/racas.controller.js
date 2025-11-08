import {
    createRaca,
    getRacas,
    getRacaById,
    getRacasByEspecie,
    updateRaca,
    deleteRaca,
} from "../repositories/racas.repo.js";

export async function createRacaController(req, res) {
    try {
        const { nome, especiesId } = req.body;

        // --- VALIDAÇÃO DE ENTRADA (ERRO 400) ---
        // Valida os campos obrigatórios
        if (!nome || !especiesId) {
            return res.status(400).json({
                error: "Dados incompletos. 'nome' e 'especiesId' são obrigatórios.",
            });
        }
        // --- FIM VALIDAÇÃO ---

        // O 'req.body' inteiro é passado para a função do repo
        const novoId = await createRaca(req.body);

        res.status(201).json({ id: novoId });
    } catch (error) {
        console.error("Erro em createRacaController:", error);
        // Verifica erro de chave estrangeira (ex: especiesId não existe)
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res
                .status(404)
                .json({ error: "A 'especiesId' fornecida não existe." });
        }
        res.status(500).json({ error: "Erro ao criar raça." });
    }
}

export async function getRacasController(req, res) {
    try {
        const racas = await getRacas();
        res.status(200).json(racas);
    } catch (error) {
        console.error("Erro em getRacasController:", error);
        res.status(500).json({ error: "Erro ao buscar raças." });
    }
}

export async function getRacaByIdController(req, res) {
    try {
        const { id } = req.params;
        const raca = await getRacaById(id);

        // --- VALIDAÇÃO DE RESULTADO (ERRO 404) ---
        if (!raca) {
            return res.status(404).json({ error: "Raça não encontrada." });
        }
        // --- FIM VALIDAÇÃO ---

        res.status(200).json(raca);
    } catch (error) {
        console.error("Erro em getRacaByIdController:", error);
        res.status(500).json({ error: "Erro ao buscar raça." });
    }
}

export async function updateRacaController(req, res) {
    try {
        const { id } = req.params;
        const { nome, especiesId } = req.body;

        // --- VALIDAÇÃO DE ENTRADA (ERRO 400) ---
        if (!nome || !especiesId) {
            return res.status(400).json({
                error: "Dados incompletos. 'nome' e 'especiesId' são obrigatórios.",
            });
        }
        // --- FIM VALIDAÇÃO ---

        const affectedRows = await updateRaca(id, req.body);

        // --- VALIDAÇÃO DE RESULTADO (ERRO 404) ---
        if (affectedRows === 0) {
            return res
                .status(404)
                .json({ error: "Raça não encontrada para atualizar." });
        }
        // --- FIM VALIDAÇÃO ---

        res.status(200).json({ message: "Raça atualizada com sucesso." });
    } catch (error) {
        console.error("Erro em updateRacaController:", error);
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res
                .status(404)
                .json({ error: "A 'especiesId' fornecida não existe." });
        }
        res.status(500).json({ error: "Erro ao atualizar raça." });
    }
}

export async function deleteRacaController(req, res) {
    try {
        const { id } = req.params;
        const affectedRows = await deleteRaca(id);

        // --- VALIDAÇÃO DE RESULTADO (ERRO 404) ---
        if (affectedRows === 0) {
            return res
                .status(404)
                .json({ error: "Raça não encontrada para deletar." });
        }
        // --- FIM VALIDAÇÃO ---

        res.status(204).send();
    } catch (error) {
        console.error("Erro em deleteRacaController:", error);
        res.status(500).json({ error: "Erro ao deletar raça." });
    }
}

// --- Controller especial para o Frontend ---

export async function getRacasByEspecieController(req, res) {
    try {
        const { especieId } = req.params;
        const racas = await getRacasByEspecie(especieId);
        
        // Não precisa de 404 aqui, um array vazio [] é uma resposta válida.
        res.status(200).json(racas);

    } catch (error) {
        console.error("Erro em getRacasByEspecieController:", error);
        res.status(500).json({ error: "Erro ao buscar raças por espécie." });
    }
}