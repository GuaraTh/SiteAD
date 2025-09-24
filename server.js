const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// servir os arquivos estáticos (html, css, js, imagens)
app.use(express.static(__dirname));

// segredo do JWT
const SECRET = process.env.SECRET || 'seu_segredo_super_secreto';

// configuração do banco
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Oliveira312001!',
  database: process.env.DB_NAME || 'site_db'
};

// rota para cadastro de clientes
app.post('/api/clientes', async (req, res) => {
  const { nome, email, telefone, cpf, senha } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
  }
  try {
    const connection = await mysql.createConnection(dbConfig);
    // checar se email já existe
    const [rows] = await connection.execute('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (rows.length > 0) {
      await connection.end();
      return res.status(409).json({ error: 'Email já cadastrado' });
    }
    const hashed = await bcrypt.hash(senha, 10);
    await connection.execute(
      'INSERT INTO usuarios (nome, email, telefone, cpf, senha, tipo) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, email, telefone || '', cpf || '', hashed, 'cliente']
    );
    await connection.end();
    res.json({ message: 'Cadastro realizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

// outras rotas que você já tinha (login, profile, agendamentos…)
// exemplo: login
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    await connection.end();
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }
    const usuario = rows[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }
    const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo }, SECRET, { expiresIn: '1h' });
    res.json({ status: 'Login realizado', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no login' });
  }
});

// middleware para verificar token JWT
function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // formato: "Bearer token"
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  jwt.verify(token, SECRET, (err, usuario) => {
    if (err) return res.status(403).json({ error: 'Token inválido ou expirado' });
    req.usuario = usuario;
    next();
  });
}

// rota para perfil do usuário logado
app.get('/api/profile', autenticarToken, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      'SELECT id, nome, email, telefone, cpf, tipo, criado_em FROM usuarios WHERE id = ?',
      [req.usuario.id]
    );
    await connection.end();

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(rows[0]); // retorna os dados do usuário
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
});
