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
                // Se tiver recursoId, usar a estrutura antiga (compatibilidade)
                if (item.recursoId) {
                    await connection.query(
                        "INSERT INTO doacoes_itens (doacaoId, recursoId, quantidade) VALUES (?, ?, ?)",
                        [newDoacaoId, item.recursoId, item.quantidade]
                    );
                    
                    await connection.query(
                        "UPDATE recursos SET quantidade = quantidade + ? WHERE id = ?",
                        [item.quantidade, item.recursoId]
                    );
                } else {
                    // Nova estrutura: salvar nome, valor e quantidade diretamente
                    // Usando recursoId como NULL e armazenando dados na descrição ou em campos adicionais
                    // Por enquanto, vamos salvar na tabela com recursoId NULL e usar um campo JSON ou texto
                    await connection.query(
                        "INSERT INTO doacoes_itens (doacaoId, recursoId, quantidade, nomeItem, valorItem) VALUES (?, NULL, ?, ?, ?)",
                        [newDoacaoId, item.quantidade, item.nome, item.valor]
                    );
                }
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
            p.nome AS doadorNome,
            p.id AS pessoaId
        FROM doacoes d
        LEFT JOIN pessoas_doacoes pd ON d.id = pd.doacaoId
        LEFT JOIN pessoas p ON pd.pessoaId = p.id
        WHERE d.isDeleted = FALSE
        ORDER BY d.dataDoacao DESC
    `);
    
    // Para cada doação de itens, buscar os itens
    for (const doacao of rows) {
        if (doacao.tipo === 'Itens') {
            const [itensRows] = await pool.query(`
                SELECT 
                    COALESCE(r.nome, di.nomeItem) AS nome,
                    COALESCE(r.valor, di.valorItem) AS valor,
                    di.quantidade,
                    r.id AS recursoId
                FROM doacoes_itens di
                LEFT JOIN recursos r ON di.recursoId = r.id
                WHERE di.doacaoId = ?
            `, [doacao.id]);
            
            doacao.itens = itensRows.map(item => ({
                nome: item.nome,
                valor: parseFloat(item.valor) || 0,
                quantidade: parseInt(item.quantidade) || 0,
                recursoId: item.recursoId || null
            }));
        }
    }
    
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
        // Buscar itens que podem ser de recursos ou itens manuais
        const [itensRows] = await pool.query(`
            SELECT 
                COALESCE(r.nome, di.nomeItem) AS nome,
                COALESCE(r.valor, di.valorItem) AS valor,
                di.quantidade,
                r.id AS recursoId
            FROM doacoes_itens di
            LEFT JOIN recursos r ON di.recursoId = r.id
            WHERE di.doacaoId = ?
        `, [id]);
        
        // Formatar itens para o formato esperado
        doacao.itens = itensRows.map(item => ({
            nome: item.nome,
            valor: parseFloat(item.valor) || 0,
            quantidade: parseInt(item.quantidade) || 0,
            recursoId: item.recursoId || null
        }));
    }

    return doacao;
}


export async function updateDoacao(id, doacaoData) {
    const {
        dataDoacao,
        tipo,
        valor,
        descricao,
        itens,
    } = doacaoData;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Atualizar dados da doação
        await connection.query(
            "UPDATE doacoes SET dataDoacao = ?, tipo = ?, valor = ?, descricao = ? WHERE id = ?",
            [dataDoacao, tipo, valor, descricao, id]
        );

        // Se for doação de itens, atualizar os itens
        if (tipo === "Itens" && itens && itens.length > 0) {
            // Deletar itens antigos
            await connection.query(
                "DELETE FROM doacoes_itens WHERE doacaoId = ?",
                [id]
            );

            // Inserir novos itens
            for (const item of itens) {
                if (item.recursoId) {
                    await connection.query(
                        "INSERT INTO doacoes_itens (doacaoId, recursoId, quantidade) VALUES (?, ?, ?)",
                        [id, item.recursoId, item.quantidade]
                    );
                    
                    await connection.query(
                        "UPDATE recursos SET quantidade = quantidade + ? WHERE id = ?",
                        [item.quantidade, item.recursoId]
                    );
                } else {
                    await connection.query(
                        "INSERT INTO doacoes_itens (doacaoId, recursoId, quantidade, nomeItem, valorItem) VALUES (?, NULL, ?, ?, ?)",
                        [id, item.quantidade, item.nome, item.valor]
                    );
                }
            }
        }

        await connection.commit();
        return 1; // Sucesso

    } catch (error) {
        await connection.rollback();
        console.error("Erro na transação updateDoacao:", error);
        throw error;
    } finally {
        connection.release();
    }
}

export async function deleteDoacao(id) {
    // Primeiro buscar os dados antes de deletar para salvar no histórico
    const doacao = await getDoacaoById(id);
    
    const [result] = await pool.query(
        "UPDATE doacoes SET isDeleted = TRUE WHERE id = ?",
        [id]
    );
    
    // Retornar os dados e o número de linhas afetadas
    return { affectedRows: result.affectedRows, dadosAntigos: doacao };
}


export async function getDoacoesByPessoa(pessoaId) {
    const [rows] = await pool.query(`
        SELECT 
            d.*,
            p.nome AS doadorNome
        FROM doacoes d
        JOIN pessoas_doacoes pd ON d.id = pd.doacaoId
        LEFT JOIN pessoas p ON pd.pessoaId = p.id
        WHERE pd.pessoaId = ? AND d.isDeleted = FALSE
        ORDER BY d.dataDoacao DESC
    `, [pessoaId]);
    
    // Buscar itens de cada doação
    for (const doacao of rows) {
        if (doacao.tipo === 'Itens') {
            const [itensRows] = await pool.query(`
                SELECT 
                    COALESCE(r.nome, di.nomeItem) AS nome,
                    COALESCE(r.valor, di.valorItem) AS valor,
                    di.quantidade
                FROM doacoes_itens di
                LEFT JOIN recursos r ON di.recursoId = r.id
                WHERE di.doacaoId = ?
            `, [doacao.id]);
            
            doacao.itens = itensRows.map(item => ({
                nome: item.nome,
                valor: parseFloat(item.valor) || 0,
                quantidade: parseInt(item.quantidade) || 0
            }));
        }
    }
    
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

// Relatório de doações agrupado por pessoa com detalhes
export async function getRelatorioDoacoes() {
    // Primeiro buscar todas as doações com detalhes
    const [doacoesRows] = await pool.query(`
        SELECT 
            d.id AS doacaoId,
            d.dataDoacao,
            d.tipo,
            d.valor,
            d.descricao,
            p.id AS pessoaId,
            p.nome AS pessoaNome,
            p.cpf,
            p.email
        FROM doacoes d
        INNER JOIN pessoas_doacoes pd ON d.id = pd.doacaoId
        INNER JOIN pessoas p ON pd.pessoaId = p.id
        WHERE d.isDeleted = FALSE AND p.isDeleted = FALSE
        ORDER BY p.nome ASC, d.dataDoacao DESC
    `);

    // Buscar itens de cada doação
    for (const doacao of doacoesRows) {
        if (doacao.tipo === 'Itens') {
            const [itensRows] = await pool.query(`
                SELECT 
                    COALESCE(r.nome, di.nomeItem) AS nome,
                    COALESCE(r.valor, di.valorItem) AS valor,
                    di.quantidade
                FROM doacoes_itens di
                LEFT JOIN recursos r ON di.recursoId = r.id
                WHERE di.doacaoId = ?
            `, [doacao.doacaoId]);
            
            doacao.itens = itensRows.map(item => ({
                nome: item.nome,
                valor: parseFloat(item.valor) || 0,
                quantidade: parseInt(item.quantidade) || 0
            }));
        }
    }

    // Agrupar por pessoa
    const pessoasMap = new Map();
    
    doacoesRows.forEach(doacao => {
        if (!pessoasMap.has(doacao.pessoaId)) {
            pessoasMap.set(doacao.pessoaId, {
                pessoaId: doacao.pessoaId,
                pessoaNome: doacao.pessoaNome,
                cpf: doacao.cpf,
                email: doacao.email,
                totalDoacoes: 0,
                valorTotalMonetario: 0,
                doacoes: []
            });
        }
        
        const pessoa = pessoasMap.get(doacao.pessoaId);
        pessoa.totalDoacoes++;
        
        if (doacao.tipo === 'Monetária' || doacao.tipo === 'Monetaria') {
            pessoa.valorTotalMonetario += parseFloat(doacao.valor) || 0;
        }
        
        pessoa.doacoes.push({
            id: doacao.doacaoId,
            dataDoacao: doacao.dataDoacao,
            tipo: doacao.tipo,
            valor: doacao.valor,
            descricao: doacao.descricao,
            itens: doacao.itens || []
        });
    });

    // Converter para array e ordenar
    const resultado = Array.from(pessoasMap.values());
    resultado.sort((a, b) => {
        if (b.valorTotalMonetario !== a.valorTotalMonetario) {
            return b.valorTotalMonetario - a.valorTotalMonetario;
        }
        return a.pessoaNome.localeCompare(b.pessoaNome);
    });

    return resultado;
}