import {
    createDoacao,
    getDoacoes,
    getDoacaoById,
    updateDoacao,
    deleteDoacao,
    getDoacoesByPessoa,
    getDoacoesByRecurso,
    getRelatorioDoacoes,
} from "../repositories/doacoes.repo.js";

export async function createDoacaoController(req, res) {
    try {
        const doacaoData = req.body;
        const { pessoaId, dataDoacao, tipo, valor, itens } = doacaoData;

       
        if (!pessoaId || !dataDoacao || !tipo) {
            return res.status(400).json({
                error: "Dados incompletos. 'pessoaId', 'dataDoacao' e 'tipo' são obrigatórios.",
            });
        }

       
        if (tipo === "Monetária" || tipo === "Monetaria") {
            if (!valor || valor <= 0) {
                return res.status(400).json({
                    error: "Para doação 'Monetária', o 'valor' é obrigatório e deve ser maior que zero.",
                });
            }
        } else if (tipo === "Itens") {
            if (!itens || !Array.isArray(itens) || itens.length === 0) {
                return res.status(400).json({
                    error: "Para doação 'Itens', o array 'itens' é obrigatório e não pode estar vazio.",
                });
            }
            
            for (const item of itens) {
                if (!item.nome || !item.valor || item.valor <= 0 || !item.quantidade || item.quantidade <= 0) {
                    return res.status(400).json({
                        error: "Cada item na doação deve ter 'nome', 'valor' (maior que zero) e 'quantidade' (maior que zero).",
                    });
                }
            }
        } else {
            return res
                .status(400)
                .json({ error: "Tipo de doação inválido." });
        }

        const novoId = await createDoacao(doacaoData);
        res.status(201).json({ id: novoId });

    } catch (error) {
        console.error("Erro em createDoacaoController:", error);
        res.status(500).json({ error: "Erro ao criar doação." });
    }
}

export async function getDoacoesController(req, res) {
    try {
        const doacoes = await getDoacoes();
        res.status(200).json(doacoes);
    } catch (error) {
        console.error("Erro em getDoacoesController:", error);
        res.status(500).json({ error: "Erro ao buscar doações." });
    }
}

export async function getDoacaoByIdController(req, res) {
    try {
        const { id } = req.params;
        const doacao = await getDoacaoById(id);

        if (!doacao) {
            return res.status(404).json({ error: "Doação não encontrada." });
        }

        res.status(200).json(doacao);
    } catch (error) {
        console.error("Erro em getDoacaoByIdController:", error);
        res.status(500).json({ error: "Erro ao buscar doação." });
    }
}

export async function updateDoacaoController(req, res) {
    try {
        const { id } = req.params;
        const doacaoData = req.body;
        const { dataDoacao, tipo, valor, itens } = doacaoData;

        if (!dataDoacao || !tipo) {
            return res.status(400).json({
                error: "Dados incompletos. 'dataDoacao' e 'tipo' são obrigatórios.",
            });
        }

        if (tipo === "Monetária" || tipo === "Monetaria") {
            if (!valor || valor <= 0) {
                return res.status(400).json({
                    error: "Para doação 'Monetária', o 'valor' é obrigatório e deve ser maior que zero.",
                });
            }
        } else if (tipo === "Itens") {
            if (!itens || !Array.isArray(itens) || itens.length === 0) {
                return res.status(400).json({
                    error: "Para doação 'Itens', o array 'itens' é obrigatório e não pode estar vazio.",
                });
            }
            
            for (const item of itens) {
                if (!item.nome || !item.valor || item.valor <= 0 || !item.quantidade || item.quantidade <= 0) {
                    return res.status(400).json({
                        error: "Cada item na doação deve ter 'nome', 'valor' (maior que zero) e 'quantidade' (maior que zero).",
                    });
                }
            }
        }

        await updateDoacao(id, doacaoData);
        res.status(200).json({ message: "Doação atualizada com sucesso." });

    } catch (error) {
        console.error("Erro em updateDoacaoController:", error);
        res.status(500).json({ error: "Erro ao atualizar doação." });
    }
}

export async function deleteDoacaoController(req, res) {
    try {
        const { id } = req.params;
        const affectedRows = await deleteDoacao(id);

        if (affectedRows === 0) {
            return res
                .status(404)
                .json({ error: "Doação não encontrada para deletar." });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Erro em deleteDoacaoController:", error);
        res.status(500).json({ error: "Erro ao deletar doação." });
    }
}

// --- Controladores Bônus ---

export async function getDoacoesByPessoaController(req, res) {
    try {
        const { pessoaId } = req.params;
        const doacoes = await getDoacoesByPessoa(pessoaId);
        
        // Não precisa de 404, um array vazio é uma resposta válida
        res.status(200).json(doacoes);

    } catch (error) {
        console.error("Erro em getDoacoesByPessoaController:", error);
        res.status(500).json({ error: "Erro ao buscar doações da pessoa." });
    }
}

export async function getDoacoesByRecursoController(req, res) {
    try {
        const { recursoId } = req.params;
        const doacoes = await getDoacoesByRecurso(recursoId);
        
        // Não precisa de 404, um array vazio é uma resposta válida
        res.status(200).json(doacoes);

    } catch (error) {
        console.error("Erro em getDoacoesByRecursoController:", error);
        res.status(500).json({ error: "Erro ao buscar doações por recurso." });
    }
}

export async function getRelatorioDoacoesController(req, res) {
    try {
        const relatorio = await getRelatorioDoacoes();
        res.status(200).json(relatorio);
    } catch (error) {
        console.error("Erro em getRelatorioDoacoesController:", error);
        res.status(500).json({ error: "Erro ao gerar relatório de doações." });
    }
}