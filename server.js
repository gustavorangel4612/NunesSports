const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configuração do SQLite
const db = new sqlite3.Database('database.db');

// Criação da tabela
db.run(`
  CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    codigo TEXT,
    descricao TEXT,
    preco REAL
  )
`);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rotas
app.get('/produtos', (req, res) => {
  db.all('SELECT * FROM produtos', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ produtos: rows });
  });
});

app.post('/produtos', (req, res) => {
  const { nome, codigo, descricao, preco } = req.body;
  db.run(
    'INSERT INTO produtos (nome, codigo, descricao, preco) VALUES (?, ?, ?, ?)',
    [nome, codigo, descricao, preco],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Produto adicionado com sucesso' });
    }
  );
});

app.put('/produtos/:id', (req, res) => {
  const { nome, codigo, descricao, preco } = req.body;
  const id = req.params.id;
  db.run(
    'UPDATE produtos SET nome=?, codigo=?, descricao=?, preco=? WHERE id=?',
    [nome, codigo, descricao, preco, id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Produto atualizado com sucesso' });
    }
  );
});

app.delete('/produtos/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM produtos WHERE id=?', id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Produto excluído com sucesso' });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});