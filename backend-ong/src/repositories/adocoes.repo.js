import pool from "../config/db.js";



export async function createAdocao(adocaoData) {
    const { animalId, pessoaId, dataAdocao, termoAssinado, observacoes } =
        adocaoData;

  
    const connection = await pool.getConnection();

    try {
       
        await connection.beginTransaction();

        
        const [adocaoResult] = await connection.query(
            `INSERT INTO adocoes (animalId, pessoaId, dataAdocao, termoAssinado, observacoes) 
             VALUES (?, ?, ?, ?, ?)`,
            [animalId, pessoaId, dataAdocao, termoAssinado, observacoes]
        );
        const newAdocaoId = adocaoResult.insertId;

       
        await connection.query(
            "UPDATE animais SET pessoaId = ? WHERE id = ?",
            [pessoaId, animalId]
        );

       
        await connection.commit();
        return newAdocaoId;

    } catch (error) {
        
        await connection.rollback();
        console.error("Erro na transação createAdocao:", error);
        throw error; 
    
    } finally {
        
        connection.release();
    }
}


export async function getAdocoes() {
    const [rows] = await pool.query(`
        SELECT 
            ad.*,
            an.nome AS animalNome,
            p.nome AS adotanteNome,
            p.cpf AS adotanteCpf
        FROM adocoes ad
        JOIN animais an ON ad.animalId = an.id
        JOIN pessoas p ON ad.pessoaId = p.id
        ORDER BY ad.dataAdocao DESC
    `);
    return rows;
}


export async function getAdocaoById(id) {
    const [rows] = await pool.query(
        `
        SELECT 
            ad.*,
            an.nome AS animalNome,
            p.nome AS adotanteNome,
            p.cpf AS adotanteCpf
        FROM adocoes ad
        JOIN animais an ON ad.animalId = an.id
        JOIN pessoas p ON ad.pessoaId = p.id
        WHERE ad.id = ?
    `,
        [id]
    );
    return rows[0];
}


export async function getAdocaoByAnimalId(animalId) {
    const [rows] = await pool.query(
        "SELECT * FROM adocoes WHERE animalId = ?",
        [animalId]
    );
    return rows[0];
}


export async function getAdocoesByPessoaId(pessoaId) {
    const [rows] = await pool.query(
        `
        SELECT 
            ad.*,
            an.nome AS animalNome,
            an.fotoUrl AS animalFotoUrl,
            an.cor AS animalCor,
            an.dataNasc AS animalDataNasc,
            r.nome AS racaNome,
            e.nome AS especieNome
        FROM adocoes ad
        JOIN animais an ON ad.animalId = an.id
        JOIN racas r ON an.racasId = r.id
        JOIN especies e ON r.especiesId = e.id
        WHERE ad.pessoaId = ?
        ORDER BY ad.dataAdocao DESC
    `,
        [pessoaId]
    );
    return rows;
}


export async function updateAdocao(id, adocaoData) {
    const { termoAssinado, observacoes } = adocaoData;

    const [result] = await pool.query(
        "UPDATE adocoes SET termoAssinado = ?, observacoes = ? WHERE id = ?",
        [termoAssinado, observacoes, id]
    );
    return result.affectedRows;
}


export async function deleteAdocao(id) {
    const [result] = await pool.query("DELETE FROM adocoes WHERE id = ?", [id]);
    return result.affectedRows;
}