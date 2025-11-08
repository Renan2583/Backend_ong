import pool from "../config/db.js";


export async function createRaca(raca) {
    const {
        nome,
        origem,
        tamanho,
        expectativaVida,
        temperamento,
        pelagem,
        especiesId, 
    } = raca;

    const [result] = await pool.query(
        `INSERT INTO racas 
         (nome, origem, tamanho, expectativaVida, temperamento, pelagem, especiesId, isDeleted) 
         VALUES (?, ?, ?, ?, ?, ?, ?, FALSE)`,
        [
            nome,
            origem,
            tamanho,
            expectativaVida,
            temperamento,
            pelagem,
            especiesId,
        ]
    );
    return result.insertId;
}


export async function getRacas() {
    const [rows] = await pool.query(`
        SELECT 
            r.*, 
            e.nome AS especieNome 
        FROM racas r
        JOIN especies e ON r.especiesId = e.id
        WHERE r.isDeleted = FALSE AND e.isDeleted = FALSE
    `);
    return rows;
}


export async function getRacaById(id) {
    const [rows] = await pool.query(
        `
        SELECT 
            r.*, 
            e.nome AS especieNome 
        FROM racas r
        JOIN especies e ON r.especiesId = e.id
        WHERE r.id = ? AND r.isDeleted = FALSE AND e.isDeleted = FALSE
    `,
        [id]
    );
    return rows[0];
}


export async function getRacasByEspecie(especieId) {
    const [rows] = await pool.query(
        "SELECT * FROM racas WHERE especiesId = ? AND isDeleted = FALSE",
        [especieId]
    );
    return rows;
}


export async function updateRaca(id, raca) {
    const {
        nome,
        origem,
        tamanho,
        expectativaVida,
        temperamento,
        pelagem,
        especiesId,
    } = raca;

    const [result] = await pool.query(
        `UPDATE racas SET 
         nome = ?, origem = ?, tamanho = ?, expectativaVida = ?, 
         temperamento = ?, pelagem = ?, especiesId = ? 
         WHERE id = ?`,
        [
            nome,
            origem,
            tamanho,
            expectativaVida,
            temperamento,
            pelagem,
            especiesId,
            id,
        ]
    );
    return result.affectedRows;
}


export async function deleteRaca(id) {
    const [result] = await pool.query(
        "UPDATE racas SET isDeleted = TRUE WHERE id = ?",
        [id]
    );
    return result.affectedRows;
}