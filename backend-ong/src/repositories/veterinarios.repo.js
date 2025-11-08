import pool from "../config/db.js";


export async function createVeterinario(veterinario) {
    const { pessoaId, CRMV } = veterinario;

    const [result] = await pool.query(
        "INSERT INTO veterinarios (pessoaId, CRMV, isDeleted) VALUES (?, ?, FALSE)",
        [pessoaId, CRMV]
    );
    return result.insertId;
}


export async function getVeterinarios() {
    const [rows] = await pool.query(`
        SELECT 
            v.id, 
            v.CRMV, 
            v.pessoaId, 
            p.nome, 
            p.email, 
            p.telefone 
        FROM veterinarios v
        JOIN pessoas p ON v.pessoaId = p.id
        WHERE v.isDeleted = FALSE AND p.isDeleted = FALSE
    `);
    return rows;
}


export async function getVeterinarioById(id) {
    const [rows] = await pool.query(
        `
        SELECT 
            v.id, 
            v.CRMV, 
            v.pessoaId, 
            p.nome, 
            p.email, 
            p.telefone 
        FROM veterinarios v
        JOIN pessoas p ON v.pessoaId = p.id
        WHERE v.id = ? AND v.isDeleted = FALSE AND p.isDeleted = FALSE
    `,
        [id]
    );
    return rows[0];
}


export async function getVeterinarioByPessoaId(pessoaId) {
    const [rows] = await pool.query(
        `
        SELECT 
            v.id, v.CRMV, v.pessoaId, p.nome 
        FROM veterinarios v
        JOIN pessoas p ON v.pessoaId = p.id
        WHERE v.pessoaId = ? AND v.isDeleted = FALSE
    `,
        [pessoaId]
    );
    return rows[0];
}


export async function updateVeterinario(id, CRMV) {
    const [result] = await pool.query(
        "UPDATE veterinarios SET CRMV = ? WHERE id = ?",
        [CRMV, id]
    );
    return result.affectedRows;
}


export async function deleteVeterinario(id) {
    const [result] = await pool.query(
        "UPDATE veterinarios SET isDeleted = TRUE WHERE id = ?",
        [id]
    );
    return result.affectedRows;
}