import pool from "../config/db.js";


export async function findPessoaByCpf(cpf) {
    const [rows] = await pool.query(
        "SELECT * FROM pessoas WHERE cpf = ? AND isDeleted = FALSE",
        [cpf]
    );
    return rows[0]; 
}


export async function createPessoa(pessoa) {
    const { nome, cpf, dataNasc, telefone, email, cep, logradouro, numero, complemento, bairro, cidade, estado, senha, tipo } = pessoa;
    
    
    const [result] = await pool.query(
        "INSERT INTO pessoas (nome, cpf, dataNasc, telefone, email, cep, logradouro, numero, complemento, bairro, cidade, estado,senha,tipo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)",
        [nome, cpf, dataNasc, telefone, email, cep, logradouro, numero, complemento, bairro, cidade, estado,senha,tipo]
    ); 
    
    return result.insertId;
}

export async function getPessoas() {
   
    const [rows] = await pool.query(
        "SELECT * FROM pessoas WHERE isDeleted = FALSE"
    );
    return rows;
}

export async function getPessoaById(id) {
   
    const [rows] = await pool.query(
        "SELECT * FROM pessoas WHERE id = ? AND isDeleted = FALSE", 
        [id]
    );
    return rows[0];
}

export async function updatePessoa(id, pessoa) {
    const { nome, cpf, dataNasc, telefone, email, cep, logradouro, numero, complemento, bairro, cidade, estado } = pessoa;
    
   const [result] = await pool.query(
        "UPDATE pessoas SET nome = ?, cpf = ?, dataNasc = ?, telefone = ?, email = ?, cep = ?, logradouro = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, estado = ? WHERE id = ?",
        [nome, cpf, dataNasc, telefone, email, cep, logradouro, numero, complemento, bairro, cidade, estado, id]
    );
    return result.affectedRows;
}

export async function deletePessoa(id) {
    const [result] = await pool.query(
        "UPDATE pessoas SET isDeleted = TRUE WHERE id = ?", 
        [id]
    );
    return result.affectedRows;
}