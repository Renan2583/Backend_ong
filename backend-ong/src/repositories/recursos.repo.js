import pool from "../config/db.js";

export async function createRecurso(recurso){
    const {tipo,nome,quantidade,descricao } = recurso;
    const [result] = await pool.query(
        "INSERT INTO recursos(tipo,nome,quantidade,descricao)VALUES (?, ?, ?, ?)",
        [tipo,nome,quantidade,descricao]
    );
    return result.insertId;
}

export async function getRecursos() {
    const [rows] = await pool.query(
        "SELECT * FROM recursos WHERE isDeleted = FALSE"
    );
    return rows;
}

export async function getRecursoById(id) {
    const [rows] = await pool.query(
        "SELECT * FROM recursos WHERE id = ? AND isDeleted = FALSE",
        [id]
    );
    return rows[0];
}

export async function updateRecurso(id,recurso){
    const {tipo,nome,quantidade,descricao} = recurso;
    const [result] = await pool.query(
        "UPDATE recursos SET tipo = ?, nome = ?, quantidade = ?, descricao = ? WHERE id = ?",
        [tipo,nome,quantidade,descricao,id]
    );
    return result.affectedRows;
}

export async function deleteRecurso(id){
    const [result] = await pool.query(
        "UPDATE recursos SET isDeleted = TRUE WHERE id = ?",
        [id]
    );
    return result.affectedRows;
}
