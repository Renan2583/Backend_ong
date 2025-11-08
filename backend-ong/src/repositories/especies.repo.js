import pool from "../config/db.js";


export async function createEspecie(nome) {
    const [result] = await pool.query(
        "INSERT INTO especies (nome) VALUES (?)",
        [nome]
    );
    return result.insertId;
}


export async function getEspecies() {
    const [rows] = await pool.query(
        "SELECT * FROM especies WHERE isDeleted = FALSE"
    );
    return rows;
}


export async function getEspecieById(id) {
    const [rows] = await pool.query(
        "SELECT * FROM especies WHERE id = ? AND isDeleted = FALSE",
        [id]
    );
    return rows[0];
}


export async function updateEspecie(id, nome) {
    const [result] = await pool.query(
        "UPDATE especies SET nome = ? WHERE id = ?",
        [nome, id]
    );
    
    return result.affectedRows;
}


export async function deleteEspecie(id) {
    const [result] = await pool.query(
        "UPDATE especies SET isDeleted = TRUE WHERE id = ?",
        [id]
    );
    return result.affectedRows;
}