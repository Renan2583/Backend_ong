import {
    createPessoa,
    getPessoas,
    getPessoaById,
    updatePessoa,
    deletePessoa,
    findPessoaByCpf,
} from "../repositories/pessoas.repo.js";
import bcrypt from 'bcrypt';

export async function createPessoaController(req, res) {
    try {
        
        const { senha, cpf, ...dadosPessoa } = req.body;

        
        if (!senha) {
            return res.status(400).json({ error: "A 'senha' é obrigatória." });
        }

        if (!cpf) {
            return res.status(400).json({ error: "O 'cpf' é obrigatório." });
        }

        if (!dadosPessoa.dataNasc) {
            return res.status(400).json({ error: "A 'dataNasc' é obrigatória." });
        }

        // Verificar se o CPF já existe
        const pessoaExistente = await findPessoaByCpf(cpf);
        if (pessoaExistente) {
            return res.status(409).json({ error: "CPF já cadastrado." });
        }
        
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        // Se o tipo não foi enviado, define como 'User' (cadastro pelo login)
        // Se foi enviado, usa o valor (cadastro pela página de Pessoas)
        const tipo = dadosPessoa.tipo || 'User';
        
        const novoId = await createPessoa({ 
            ...dadosPessoa,
            cpf,
            senha: senhaHash, 
            tipo: tipo 
        });

        res.status(201).json({ id: novoId });

    } catch (error) {
        console.error("Erro em createPessoaController:", error);
        
        // Tratar erro de CPF duplicado (caso a validação anterior falhe)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: "CPF já cadastrado." });
        }
        
        // Tratar erro de campo NULL
        if (error.code === 'ER_BAD_NULL_ERROR') {
            return res.status(400).json({ error: "Alguns campos obrigatórios não foram preenchidos." });
        }
        
        res.status(500).json({ error: "Erro ao criar pessoa" });
    }
}

export async function getPessoasController(req, res) {
    try {
        const pessoas = await getPessoas();
        res.status(200).json(pessoas);
    } catch (error) {
        console.error("Erro em getPessoasController:", error);
        res.status(500).json({ error: "Erro ao buscar pessoas" });
    }
}

export async function getPessoaByIdController(req, res) {
    try {
        const { id } = req.params;
        const pessoa = await getPessoaById(id);

        
        if (!pessoa) {
            return res.status(404).json({ error: "Pessoa não encontrada" });
        }
        
        res.status(200).json(pessoa);
    } catch (error) {
        console.error("Erro em getPessoaByIdController:", error);
        res.status(500).json({ error: "Erro ao buscar pessoa" });
    }
}

export async function updatePessoaController(req, res) {
    try {
        const { id } = req.params;
        const { nome, cpf, dataNasc, telefone, email, cep, logradouro, numero, complemento, bairro, cidade, estado, tipo } = req.body;

       
        if (!nome || !cpf) {
            return res.status(400).json({ error: "Dados incompletos. Nome e CPF são obrigatórios." });
        }
       
        const affectedRows = await updatePessoa(id, { nome, cpf, dataNasc, telefone, email, cep, logradouro, numero, complemento, bairro, cidade, estado, tipo });

      
        if (affectedRows === 0) {
            return res.status(404).json({ error: "Pessoa não encontrada para atualizar" });
        }
       
        res.status(200).json({ id: id, ...req.body }); 

    } catch (error) {
        console.error("Erro em updatePessoaController:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: "CPF ou Email já cadastrado." });
        }
        res.status(500).json({ error: "Erro ao atualizar pessoa" });
    }
}

export async function deletePessoaController(req, res) {
    try {
        const { id } = req.params;
        
        
        const affectedRows = await deletePessoa(id);

        
        if (affectedRows === 0) {
            return res.status(404).json({ error: "Pessoa não encontrada para deletar" });
        }
       
        res.status(204).send();

    } catch (error) {
        console.error("Erro em deletePessoaController:", error);
        res.status(500).json({ error: "Erro ao deletar pessoa" });
    }
}