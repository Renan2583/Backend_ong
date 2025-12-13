import {
    createAdocao,
    getAdocoes,
    getAdocaoById,
    getAdocaoByAnimalId,
    getAdocoesByPessoaId,
    updateAdocao,
    deleteAdocao,
    getRelatorioAdocoes,
} from "../repositories/adocoes.repo.js";

export async function createAdocaoController(req, res) {
    try {
        const { animalId, pessoaId, dataAdocao } = req.body;

        // --- VALIDAÇÃO DE ENTRADA (ERRO 400) ---
        if (!animalId || !pessoaId || !dataAdocao) {
            return res.status(400).json({
                error: "Dados incompletos. 'animalId', 'pessoaId' e 'dataAdocao' são obrigatórios.",
            });
        }
        // --- FIM VALIDAÇÃO 400 ---

        // Chama a transação no repositório
        const novoId = await createAdocao(req.body);
        res.status(201).json({ id: novoId });

    } catch (error) {
        console.error("Erro em createAdocaoController:", error);

        // --- VALIDAÇÃO DE CONFLITO (ERRO 409) ---
        // 'ER_DUP_ENTRY' acontece por causa da sua regra UNIQUE no 'animalId'
        if (error.code === "ER_DUP_ENTRY") {
            return res
                .status(409) // 409 Conflict
                .json({ error: "Este animal já foi adotado." });
        }
        
        // Erro se o 'animalId' ou 'pessoaId' não existir
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(404).json({
                error: "O 'animalId' ou 'pessoaId' fornecido não existe.",
            });
        }

        res.status(500).json({ error: "Erro ao registrar adoção." });
    }
}

export async function getAdocoesController(req, res) {
    try {
        const adocoes = await getAdocoes();
        res.status(200).json(adocoes);
    } catch (error) {
        console.error("Erro em getAdocoesController:", error);
        res.status(500).json({ error: "Erro ao buscar adoções." });
    }
}

export async function getAdocaoByIdController(req, res) {
    try {
        const { id } = req.params;
        const adocao = await getAdocaoById(id);

        if (!adocao) {
            return res.status(404).json({ error: "Registro de adoção não encontrado." });
        }
        res.status(200).json(adocao);

    } catch (error) {
        console.error("Erro em getAdocaoByIdController:", error);
        res.status(500).json({ error: "Erro ao buscar adoção." });
    }
}

export async function updateAdocaoController(req, res) {
    try {
        const { id } = req.params;
        
        // Apenas 'termoAssinado' e 'observacoes' podem ser atualizados
        const affectedRows = await updateAdocao(id, req.body);

        if (affectedRows === 0) {
            return res
                .status(404)
                .json({ error: "Registro de adoção não encontrado para atualizar." });
        }
        res.status(200).json({ message: "Registro de adoção atualizado." });

    } catch (error) {
        console.error("Erro em updateAdocaoController:", error);
        res.status(500).json({ error: "Erro ao atualizar adoção." });
    }
}

export async function deleteAdocaoController(req, res) {
    try {
        const { id } = req.params;
        const { motivo } = req.body;
        const userId = req.userId; // Do middleware verifyToken

        // Validar motivo obrigatório
        if (!motivo || motivo.trim() === '') {
            return res.status(400).json({ 
                error: "Motivo da exclusão é obrigatório." 
            });
        }

        const resultado = await deleteAdocao(id);

        if (resultado.affectedRows === 0) {
            return res
                .status(404)
                .json({ error: "Registro de adoção não encontrado para deletar." });
        }

        // Registrar no histórico de exclusões
        try {
            const { registrarExclusao } = await import("../repositories/historico_exclusoes.repo.js");
            await registrarExclusao({
                tipoEntidade: 'Adocao',
                entidadeId: parseInt(id),
                motivo: motivo.trim(),
                excluidoPor: userId,
                dadosAntigos: resultado.dadosAntigos
            });
        } catch (histError) {
            console.error("Erro ao registrar exclusão no histórico:", histError);
            // Não falhar a exclusão se o histórico falhar, apenas logar o erro
        }

        res.status(204).send();

    } catch (error) {
        console.error("Erro em deleteAdocaoController:", error);
        // Erro se o ON DELETE RESTRICT bloquear a exclusão
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
             return res.status(409).json({ error: "Não é possível deletar este registro, pois ele está referenciado por outras tabelas." });
        }
        res.status(500).json({ error: "Erro ao deletar adoção." });
    }
}

// --- Controladores Bônus ---

export async function getAdocaoByAnimalIdController(req, res) {
    try {
        const { animalId } = req.params;
        const adocao = await getAdocaoByAnimalId(animalId);
        
        if (!adocao) {
            return res.status(404).json({ error: "Nenhum registro de adoção encontrado para este animal." });
        }
        res.status(200).json(adocao);

    } catch (error) {
        console.error("Erro em getAdocaoByAnimalIdController:", error);
        res.status(500).json({ error: "Erro ao buscar adoção." });
    }
}

export async function getAdocoesByPessoaIdController(req, res) {
    try {
        const { pessoaId } = req.params;
        const adocoes = await getAdocoesByPessoaId(pessoaId);
        
        // Array vazio é uma resposta válida (pessoa não adotou ninguém)
        res.status(200).json(adocoes);

    } catch (error) {
        console.error("Erro em getAdocoesByPessoaIdController:", error);
        res.status(500).json({ error: "Erro ao buscar adoções da pessoa." });
    }
}

export async function getRelatorioAdocoesController(req, res) {
    try {
        const relatorio = await getRelatorioAdocoes();
        res.status(200).json(relatorio);
    } catch (error) {
        console.error("Erro em getRelatorioAdocoesController:", error);
        res.status(500).json({ error: "Erro ao gerar relatório de adoções." });
    }
}