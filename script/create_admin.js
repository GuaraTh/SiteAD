// create_admin.js
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Oliveira312001!',
  database: process.env.DB_NAME || 'site_db'
};

(async () => {
  try {
    const nome = 'Administrador';
    const email = 'admin@advogado.com';
    const senha = 'Admin@2025!'; // <- troque para a senha que você quer
    const tipo = 'admin';

    const hashed = await bcrypt.hash(senha, 10);

    const conn = await mysql.createConnection(dbConfig);

    // evita duplicata
    const [exists] = await conn.execute('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (exists.length > 0) {
      console.log('Usuário admin já existe. Atualizando senha...');
      await conn.execute('UPDATE usuarios SET senha = ?, nome = ?, tipo = ? WHERE email = ?', [hashed, nome, tipo, email]);
    } else {
      await conn.execute(
        'INSERT INTO usuarios (nome, email, telefone, cpf, senha, tipo) VALUES (?, ?, ?, ?, ?, ?)',
        [nome, email, '', '', hashed, tipo]
      );
      console.log('Admin criado com sucesso.');
    }

    await conn.end();
    console.log(`Email: ${email}\nSenha: ${senha} (troque após o primeiro login)`);
  } catch (err) {
    console.error('Erro:', err);
  }
})();
