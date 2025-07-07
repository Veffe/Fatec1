// main.js - VERSÃO FINAL COM TODAS AS ROTAS

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// --- Configuração do Banco de Dados ---
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'petwash'
};

// --- ROTA DE CADASTRO (ATUALIZADA) ---
app.post('/usuarios', async (req, res) => {
    // 1. Recebe o 'porte_animal' junto com os outros dados
    const { nome, email, senha, cep, porte_animal } = req.body;

    // 2. Adiciona o novo campo na validação
    if (!nome || !email || !senha || !cep || !porte_animal) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        // 3. Atualiza o SQL para incluir a nova coluna e valor
        const sql = 'INSERT INTO usuarios (nome, email, senha, cep, porte_animal) VALUES (?, ?, ?, ?, ?)';
        const [result] = await connection.execute(sql, [nome, email, senha, cep, porte_animal]);
        
        await connection.end();
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', id: result.insertId });
    } catch (err) {
        console.error('ERRO na rota /usuarios:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Este e-mail já está cadastrado.' });
        }
        res.status(500).json({ message: 'Erro interno ao cadastrar usuário.' });
    }
});

// --- ROTA DE LOGIN (ATUALIZADA) ---
app.post('/login', async (req, res) => {
    console.log("Recebida requisição na rota /login...");

    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const sql = 'SELECT * FROM usuarios WHERE email = ?';
        const [users] = await connection.execute(sql, [email]);
        await connection.end();

        if (users.length === 0) {
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }

        const user = users[0];

        if (senha !== user.senha) {
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }

        console.log(`Login bem-sucedido para o usuário: ${email}`);
        
        // 4. Atualiza a resposta para incluir o 'porte_animal'
        res.status(200).json({
            message: 'Login bem-sucedido!',
            user: {
                nome: user.nome,
                email: user.email,
                porte_animal: user.porte_animal // Envia o porte para o frontend
            }
        });

    } catch (err) {
        console.error('ERRO CRÍTICO na rota /login:', err);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

// --- ✅ NOVA ROTA PARA BUSCAR SERVIÇOS POR ID ---
app.get('/servicos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const connection = await mysql.createConnection(dbConfig);
        
        // Usamos 'preco_base' como o nome da coluna no banco, conforme nosso SQL de criação
        const [servicos] = await connection.execute('SELECT id, nome, descricao, preco_base FROM servicos WHERE id = ?', [id]);
        
        await connection.end();

        if (servicos.length > 0) {
            res.status(200).json(servicos[0]);
        } else {
            res.status(404).json({ message: 'Serviço não encontrado.' });
        }

    } catch (err) {
        console.error('ERRO ao buscar serviço por ID:', err);
        res.status(500).json({ message: 'Erro ao buscar dados do serviço.' });
    }
});


// --- INICIA O SERVIDOR ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
});