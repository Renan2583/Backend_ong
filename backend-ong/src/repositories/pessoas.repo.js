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
    
    // Incluir todos os campos que o banco exige (NOT NULL sem DEFAULT)
    // Usar valores padrão (string vazia) quando não fornecidos
    const query = `INSERT INTO pessoas (
        nome, cpf, dataNasc, telefone, email, cep, logradouro, numero, complemento, bairro, cidade, estado, senha, tipo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const valores = [
        nome,
        cpf,
        dataNasc,
        telefone || '', // Valor padrão: string vazia
        email || '', // Valor padrão: string vazia
        cep || '', // Valor padrão: string vazia
        logradouro || '', // Valor padrão: string vazia
        numero || '', // Valor padrão: string vazia
        complemento || '', // Valor padrão: string vazia
        bairro || '', // Valor padrão: string vazia
        cidade || '', // Valor padrão: string vazia
        estado || '', // Valor padrão: string vazia
        senha,
        tipo || 'User'
    ];
    
    const [result] = await pool.query(query, valores);
    
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
    const { nome, cpf, dataNasc, telefone, email, cep, logradouro, numero, complemento, bairro, cidade, estado, tipo } = pessoa;
    
   const [result] = await pool.query(
        "UPDATE pessoas SET nome = ?, cpf = ?, dataNasc = ?, telefone = ?, email = ?, cep = ?, logradouro = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, estado = ?, tipo = ? WHERE id = ?",
        [nome, cpf, dataNasc, telefone, email, cep, logradouro, numero, complemento, bairro, cidade, estado, tipo || 'User', id]
    );
    return result.affectedRows;
}

export async function deletePessoa(id) {
    // Primeiro buscar os dados antes de deletar para salvar no histórico
    const pessoa = await getPessoaById(id);
    
    const [result] = await pool.query(
        "UPDATE pessoas SET isDeleted = TRUE WHERE id = ?", 
        [id]
    );
    
    // Retornar os dados e o número de linhas afetadas
    return { affectedRows: result.affectedRows, dadosAntigos: pessoa };
}