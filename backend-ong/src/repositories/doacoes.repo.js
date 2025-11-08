import pool from "../config/db.js";

export async function createDoacao(doacaoData) {
    const {
        pessoaId,
        dataDoacao,
        tipo,
        valor, 
        descricao,
        itens,
    } = doacaoData;

    
    const connection = await pool.getConnection();

    try {
        
        await connection.beginTransaction();

    
        const [doacaoResult] = await connection.query(
            "INSERT INTO doacoes (dataDoacao, tipo, valor, descricao, isDeleted) VALUES (?, ?, ?, ?, FALSE)",
            [dataDoacao, tipo, valor, descricao]
        );
        const newDoacaoId = doacaoResult.insertId;

            await connection.query(
                "INSERT INTO pessoas_doacoes (pessoaId, doacaoId) VALUES (?, ?)",
                [pessoaId, newDoacaoId]
            );
        

        
        if (tipo === "Itens" && itens && itens.length > 0) {
            for (const item of itens) {
                
                await connection.query(
                    "INSERT INTO doacoes_itens (doacaoId, recursoId, quantidade) VALUES (?, ?, ?)",
                    [newDoacaoId, item.recursoId, item.quantidade]
                );
                
                
                await connection.query(
                    "UPDATE recursos SET quantidade = quantidade + ? WHERE id = ?",
                    [item.quantidade, item.recursoId]
                );
            }
        }

       
        await connection.commit();
        return newDoacaoId; 

    } catch (error) {
       
        await connection.rollback();
        console.error("Erro na transação createDoacao:", error);
        throw error; 
    
    } finally {
        
        connection.release();
    }
}


export async function getDoacoes() {
    const [rows] = await pool.query(`
        SELECT 
            d.*, 
            p.nome AS doadorNome 
        FROM doacoes d
        LEFT JOIN pessoas_doacoes pd ON d.id = pd.doacaoId
        LEFT JOIN pessoas p ON pd.pessoaId = p.id
        WHERE d.isDeleted = FALSE
        ORDER BY d.dataDoacao DESC
    `);
    return rows;
}


export async function getDoacaoById(id) {
    
    const [doacaoRows] = await pool.query(`
        SELECT 
            d.*, 
            p.nome AS doadorNome,
            p.id AS doadorId
        FROM doacoes d
        LEFT JOIN pessoas_doacoes pd ON d.id = pd.doacaoId
        LEFT JOIN pessoas p ON pd.pessoaId = p.id
        WHERE d.id = ? AND d.isDeleted = FALSE
    `, [id]);

    const doacao = doacaoRows[0];
    if (!doacao) return undefined; 

    
    if (doacao.tipo === 'Itens') {
        const [itensRows] = await pool.query(`
            SELECT 
                r.nome, 
                di.quantidade, 
                r.id AS recursoId
            FROM doacoes_itens di
            JOIN recursos r ON di.recursoId = r.id
            WHERE di.doacaoId = ?
        `, [id]);
        
        doacao.itens = itensRows; 
    }

    return doacao;
}


export async function deleteDoacao(id) {
    const [result] = await pool.query(
        "UPDATE doacoes SET isDeleted = TRUE WHERE id = ?",
        [id]
    );
    return result.affectedRows;
}


export async function getDoacoesByPessoa(pessoaId) {
    const [rows] = await pool.query(`
        SELECT d.*
        FROM doacoes d
        JOIN pessoas_doacoes pd ON d.id = pd.doacaoId
        WHERE pd.pessoaId = ? AND d.isDeleted = FALSE
        ORDER BY d.dataDoacao DESC
    `, [pessoaId]);
    return rows;
}


export async function getDoacoesByRecurso(recursoId) {
    const [rows] = await pool.query(`
        SELECT d.*, di.quantidade
        FROM doacoes d
        JOIN doacoes_itens di ON d.id = di.doacaoId
        WHERE di.recursoId = ? AND d.isDeleted = FALSE
        ORDER BY d.dataDoacao DESC
    `, [recursoId]);
    return rows;
}