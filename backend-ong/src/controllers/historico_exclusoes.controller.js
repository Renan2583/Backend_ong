import {
    getHistoricoExclusoes,
    getHistoricoExclusaoByTipo,
    restaurarExclusao,
    getHistoricoExclusaoById
} from "../repositories/historico_exclusoes.repo.js";
import { verificarSeFoiRestaurado } from "../utils/verificarRestaurado.js";
import { verifyToken } from "./auth.controller.js";
import { getPessoaById } from "../repositories/pessoas.repo.js";

export async function getHistoricoExclusoesController(req, res) {
    try {
        const userId = req.userId;
        
        // Buscar dados do usuário logado
        const usuario = await getPessoaById(userId);
        
        // Verificar se é o CPF autorizado
        if (!usuario || usuario.cpf !== '37842476870') {
            return res.status(403).json({ 
                error: "Acesso negado. Apenas o usuário autorizado pode ver o histórico de exclusões." 
            });
        }
        
        const historico = await getHistoricoExclusoes();
        res.status(200).json(historico);
    } catch (error) {
        console.error("Erro em getHistoricoExclusoesController:", error);
        res.status(500).json({ error: "Erro ao buscar histórico de exclusões." });
    }
}

export async function getHistoricoExclusaoByTipoController(req, res) {
    try {
        const userId = req.userId;
        const { tipo } = req.params;
        
        // Buscar dados do usuário logado
        const usuario = await getPessoaById(userId);
        
        // Verificar se é o CPF autorizado
        if (!usuario || usuario.cpf !== '37842476870') {
            return res.status(403).json({ 
                error: "Acesso negado. Apenas o usuário autorizado pode ver o histórico de exclusões." 
            });
        }
        
        // Validar tipo
        const tiposValidos = ['Doacao', 'Atendimento', 'Adocao', 'Recurso', 'Pessoa', 'Animal', 'Raca'];
        if (!tiposValidos.includes(tipo)) {
            return res.status(400).json({ 
                error: "Tipo inválido. Tipos válidos: Doacao, Atendimento, Adocao, Recurso, Pessoa, Animal, Raca." 
            });
        }
        
        const historico = await getHistoricoExclusaoByTipo(tipo);
        res.status(200).json(historico);
    } catch (error) {
        console.error("Erro em getHistoricoExclusaoByTipoController:", error);
        res.status(500).json({ error: "Erro ao buscar histórico de exclusões por tipo." });
    }
}

export async function restaurarExclusaoController(req, res) {
    try {
        const userId = req.userId;
        const { id } = req.params;
        
        // Buscar dados do usuário logado
        const usuario = await getPessoaById(userId);
        
        // Verificar se é o CPF autorizado
        if (!usuario || usuario.cpf !== '37842476870') {
            return res.status(403).json({ 
                error: "Acesso negado. Apenas o usuário autorizado pode restaurar exclusões." 
            });
        }
        
        // Verificar se o registro existe
        const historico = await getHistoricoExclusaoById(parseInt(id));
        if (!historico) {
            return res.status(404).json({ error: "Registro de exclusão não encontrado." });
        }
        
        if (historico.restaurado) {
            return res.status(400).json({ error: "Esta exclusão já foi restaurada anteriormente." });
        }
        
        // Restaurar a exclusão
        const resultado = await restaurarExclusao(parseInt(id), userId);
        
        res.status(200).json({ 
            message: "Exclusão restaurada com sucesso.",
            ...resultado
        });
        
    } catch (error) {
        console.error("Erro em restaurarExclusaoController:", error);
        res.status(500).json({ 
            error: error.message || "Erro ao restaurar exclusão." 
        });
    }
}

export async function verificarSeFoiRestauradoController(req, res) {
    try {
        const { tipoEntidade, entidadeId } = req.params;
        
        const foiRestaurado = await verificarSeFoiRestaurado(tipoEntidade, parseInt(entidadeId));
        
        res.status(200).json({ foiRestaurado });
    } catch (error) {
        console.error("Erro em verificarSeFoiRestauradoController:", error);
        res.status(500).json({ error: "Erro ao verificar se foi restaurado." });
    }
}
