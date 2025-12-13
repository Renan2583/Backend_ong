import pool from "../config/db.js";

export async function registrarExclusao(dadosExclusao) {
    const {
        tipoEntidade,
        entidadeId,
        motivo,
        excluidoPor,
        dadosAntigos
    } = dadosExclusao;

    const [result] = await pool.query(
        `INSERT INTO historico_exclusoes 
         (tipoEntidade, entidadeId, motivo, excluidoPor, dadosAntigos) 
         VALUES (?, ?, ?, ?, ?)`,
        [
            tipoEntidade,
            entidadeId,
            motivo,
            excluidoPor,
            dadosAntigos ? JSON.stringify(dadosAntigos) : null
        ]
    );
    
    return result.insertId;
}

export async function getHistoricoExclusoes() {
    const [rows] = await pool.query(`
        SELECT 
            h.*,
            p.nome AS excluidoPorNome,
            p.cpf AS excluidoPorCpf
        FROM historico_exclusoes h
        LEFT JOIN pessoas p ON h.excluidoPor = p.id
        ORDER BY h.dataExclusao DESC
    `);
    
    // Parse JSON dos dados antigos (verificar se já é objeto ou precisa fazer parse)
    return rows.map(row => {
        let dadosAntigos = null;
        if (row.dadosAntigos) {
            // Se já for objeto, usar diretamente, senão fazer parse
            if (typeof row.dadosAntigos === 'object') {
                dadosAntigos = row.dadosAntigos;
            } else if (typeof row.dadosAntigos === 'string') {
                try {
                    dadosAntigos = JSON.parse(row.dadosAntigos);
                } catch (e) {
                    console.error('Erro ao fazer parse de dadosAntigos:', e);
                    dadosAntigos = null;
                }
            }
        }
        return {
            ...row,
            dadosAntigos
        };
    });
}

export async function getHistoricoExclusaoByTipo(tipoEntidade) {
    const [rows] = await pool.query(`
        SELECT 
            h.*,
            p.nome AS excluidoPorNome,
            p.cpf AS excluidoPorCpf
        FROM historico_exclusoes h
        LEFT JOIN pessoas p ON h.excluidoPor = p.id
        WHERE h.tipoEntidade = ?
        ORDER BY h.dataExclusao DESC
    `, [tipoEntidade]);
    
    // Parse JSON dos dados antigos (verificar se já é objeto ou precisa fazer parse)
    return rows.map(row => {
        let dadosAntigos = null;
        if (row.dadosAntigos) {
            // Se já for objeto, usar diretamente, senão fazer parse
            if (typeof row.dadosAntigos === 'object') {
                dadosAntigos = row.dadosAntigos;
            } else if (typeof row.dadosAntigos === 'string') {
                try {
                    dadosAntigos = JSON.parse(row.dadosAntigos);
                } catch (e) {
                    console.error('Erro ao fazer parse de dadosAntigos:', e);
                    dadosAntigos = null;
                }
            }
        }
        return {
            ...row,
            dadosAntigos
        };
    });
}

export async function restaurarExclusao(idHistorico, restauradoPor) {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        // Buscar o registro do histórico
        const [historicoRows] = await connection.query(
            "SELECT * FROM historico_exclusoes WHERE id = ? AND restaurado = FALSE",
            [idHistorico]
        );
        
        if (historicoRows.length === 0) {
            throw new Error("Registro de exclusão não encontrado ou já foi restaurado");
        }
        
        const historico = historicoRows[0];
        
        // Parse dos dados antigos
        let dadosAntigos = null;
        if (historico.dadosAntigos) {
            if (typeof historico.dadosAntigos === 'object') {
                dadosAntigos = historico.dadosAntigos;
            } else if (typeof historico.dadosAntigos === 'string') {
                dadosAntigos = JSON.parse(historico.dadosAntigos);
            }
        }
        
        if (!dadosAntigos) {
            throw new Error("Dados antigos não disponíveis para restauração");
        }
        
        // Restaurar baseado no tipo de entidade
        let affectedRows = 0;
        
        switch (historico.tipoEntidade) {
            case 'Doacao':
                await connection.query(
                    "UPDATE doacoes SET isDeleted = FALSE WHERE id = ?",
                    [historico.entidadeId]
                );
                affectedRows = 1;
                break;
                
            case 'Recurso':
                await connection.query(
                    "UPDATE recursos SET isDeleted = FALSE WHERE id = ?",
                    [historico.entidadeId]
                );
                affectedRows = 1;
                break;
                
            case 'Pessoa':
                await connection.query(
                    "UPDATE pessoas SET isDeleted = FALSE WHERE id = ?",
                    [historico.entidadeId]
                );
                affectedRows = 1;
                break;
                
            case 'Animal':
                await connection.query(
                    "UPDATE animais SET isDeleted = FALSE WHERE id = ?",
                    [historico.entidadeId]
                );
                affectedRows = 1;
                break;
                
            case 'Raca':
                await connection.query(
                    "UPDATE racas SET isDeleted = FALSE WHERE id = ?",
                    [historico.entidadeId]
                );
                affectedRows = 1;
                break;
                
            case 'Atendimento':
            case 'Adocao':
                throw new Error("Restauração de " + historico.tipoEntidade + " não é suportada ainda");
                
            default:
                throw new Error("Tipo de entidade não suportado para restauração");
        }
        
        // Atualizar o histórico para marcar como restaurado
        await connection.query(
            `UPDATE historico_exclusoes 
             SET restaurado = TRUE, 
                 dataRestauracao = NOW(), 
                 restauradoPor = ? 
             WHERE id = ?`,
            [restauradoPor, idHistorico]
        );
        
        await connection.commit();
        
        return { success: true, affectedRows };
        
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

export async function getHistoricoExclusaoById(id) {
    const [rows] = await pool.query(`
        SELECT 
            h.*,
            p.nome AS excluidoPorNome,
            p.cpf AS excluidoPorCpf,
            rp.nome AS restauradoPorNome
        FROM historico_exclusoes h
        LEFT JOIN pessoas p ON h.excluidoPor = p.id
        LEFT JOIN pessoas rp ON h.restauradoPor = rp.id
        WHERE h.id = ?
    `, [id]);
    
    if (rows.length === 0) return null;
    
    const row = rows[0];
    let dadosAntigos = null;
    if (row.dadosAntigos) {
        if (typeof row.dadosAntigos === 'object') {
            dadosAntigos = row.dadosAntigos;
        } else if (typeof row.dadosAntigos === 'string') {
            try {
                dadosAntigos = JSON.parse(row.dadosAntigos);
            } catch (e) {
                console.error('Erro ao fazer parse de dadosAntigos:', e);
            }
        }
    }
    
    return {
        ...row,
        dadosAntigos
    };
}
