import { findPessoaByCpf } from "../repositories/pessoas.repo.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function loginController(req, res) {
    try {
        const { cpf, senha } = req.body;

        // 1. Valida a entrada
        if (!cpf || !senha) {
            return res.status(400).json({ error: "CPF e Senha são obrigatórios." });
        }

        // 2. Procura o usuário no banco pelo CPF
        const pessoa = await findPessoaByCpf(cpf);
        if (!pessoa) {
            // (Não diga se foi o CPF ou a senha que errou, por segurança)
            return res.status(404).json({ error: "Credenciais inválidas." });
        }

        // 3. Compara a senha enviada com a senha HASH do banco
        const senhaCorreta = await bcrypt.compare(senha, pessoa.senha);
        if (!senhaCorreta) {
            return res.status(404).json({ error: "Credenciais inválidas." });
        }

        // 4. Se tudo deu certo, crie o "Crachá" (Token JWT)
        const token = jwt.sign(
            { 
                id: pessoa.id, 
                tipo: pessoa.tipo // Coloca o ID e o TIPO (Admin/User) dentro do crachá
            },
            'SEU_SEGREDO_JWT_MUITO_SEGURO', 
            { expiresIn: '8h' } // Duração do login
        );

        // 5. Envia o token para o usuário
        res.status(200).json({ token: token });

    } catch (error) {
        console.error("Erro em loginController:", error);
        res.status(500).json({ error: "Erro interno no login." });
    }
}