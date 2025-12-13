import pool from "../config/db.js";

/**
 * Verifica se uma entidade foi restaurada do histórico de exclusões
 * @param {string} tipoEntidade - Tipo da entidade (Doacao, Recurso, Pessoa, Animal, Raca)
 * @param {number} entidadeId - ID da entidade
 * @returns {Promise<boolean>} - true se foi restaurado, false caso contrário
 */
export async function verificarSeFoiRestaurado(tipoEntidade, entidadeId) {
    try {
        const [rows] = await pool.query(`
            SELECT restaurado 
            FROM historico_exclusoes 
            WHERE tipoEntidade = ? AND entidadeId = ? AND restaurado = TRUE
            ORDER BY dataExclusao DESC
            LIMIT 1
        `, [tipoEntidade, entidadeId]);
        
        return rows.length > 0 && rows[0].restaurado === true;
    } catch (error) {
        console.error('Erro ao verificar se foi restaurado:', error);
        return false;
    }
}

