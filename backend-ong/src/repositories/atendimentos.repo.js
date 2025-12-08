import pool from "../config/db.js";


export async function createAtendimento(atendimento) {
    const {
        animalId,
        veterinarioId,
        dataAtendimento,
        tipo,
        descricao,
        custo,
    } = atendimento;

    const [result] = await pool.query(
        `INSERT INTO atendimentos 
         (animalId, veterinarioId, dataAtendimento, tipo, descricao, custo) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [animalId, veterinarioId, dataAtendimento, tipo, descricao, custo]
    );
    return result.insertId;
}


export async function getAtendimentosByAnimalId(animalId) {
    const [rows] = await pool.query(
        `
        SELECT 
            at.*, 
            an.nome AS animalNome,
            p.nome AS veterinarioNome,
            v.CRMV
        FROM atendimentos at
        JOIN animais an ON at.animalId = an.id
        LEFT JOIN veterinarios v ON at.veterinarioId = v.id
        LEFT JOIN pessoas p ON v.pessoaId = p.id
        WHERE at.animalId = ?
        ORDER BY at.dataAtendimento DESC
    `,
        [animalId]
    );
    
    return rows;
}


export async function getAtendimentoById(id) {
    const [rows] = await pool.query(
        `
        SELECT 
            at.*, 
            an.nome AS animalNome,
            p.nome AS veterinarioNome
        FROM atendimentos at
        JOIN animais an ON at.animalId = an.id
        LEFT JOIN veterinarios v ON at.veterinarioId = v.id
        LEFT JOIN pessoas p ON v.pessoaId = p.id
        WHERE at.id = ?
    `,
        [id]
    );
    return rows[0];
}


export async function updateAtendimento(id, atendimento) {
    const {
        veterinarioId,
        dataAtendimento,
        tipo,
        descricao,
        custo,
    } = atendimento;

    const [result] = await pool.query(
        `UPDATE atendimentos SET 
         veterinarioId = ?, dataAtendimento = ?, tipo = ?, descricao = ?, custo = ?
         WHERE id = ?`,
        [veterinarioId, dataAtendimento, tipo, descricao, custo, id]
    );
    return result.affectedRows;
}


export async function deleteAtendimento(id) {
    const [result] = await pool.query(
        "DELETE FROM atendimentos WHERE id = ?",
        [id]
    );
    return result.affectedRows;
}