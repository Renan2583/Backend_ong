import {
    createPessoa,
    getPessoas,
    getPessoaById,
    updatePessoa,
    deletePessoa,
} from "../repositories/pessoas.repo.js";

export async function createPessoaController(req, res) {
    try {
        const { nome, cpf, dataNasc, telefone, email, cep, logradouro, numero, complemento, bairro, cidade, estado } = req.body;

      
        if (!nome || !cpf || !dataNasc || !telefone || !email || !cep || !logradouro || !numero || !cidade || !estado) {
            return res.status(400).json({ error: "Dados incompletos. Verifique os campos obrigatórios." });
        }
        

        const novoId = await createPessoa({ nome, cpf, dataNasc, telefone, email, cep, logradouro, numero, complemento, bairro, cidade, estado });
        
        
        res.status(201).json({ id: novoId });

    } catch (error) {
        console.error("Erro em createPessoaController:", error);
        
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: "CPF ou Email já cadastrado." }); 
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
        const { nome, cpf, dataNasc, telefone, email, cep, logradouro, numero, complemento, bairro, cidade, estado } = req.body;

       
        if (!nome || !cpf || !dataNasc || !telefone || !email || !cep || !logradouro || !numero || !cidade || !estado) {
            return res.status(400).json({ error: "Dados incompletos. Verifique os campos obrigatórios." });
        }
       
        const affectedRows = await updatePessoa(id, { nome, cpf, dataNasc, telefone, email, cep, logradouro, numero, complemento, bairro, cidade, estado });

      
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