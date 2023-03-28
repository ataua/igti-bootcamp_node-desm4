const { Router } = require('express');
const db = require('./db');

const productRoute = new Router();

productRoute.post('/', async (req, res) => {
  const { Codigo, Descricao, Preco } = req.body;
  try {
    const result = await db.produto.create({ Codigo, Descricao, Preco });
    return res.status(201).json(result);
  } catch (error) {
    return res.json({ erro: error.message });
  }
});

productRoute.get('/', async (req, res) => {
  try {
    return res.status(200).json(await db.produto.findAll());
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
});

productRoute.delete('/:codigo', async (req, res) => {
  const { codigo } = req.params;
  const found = await db.produto.findOne({ where: { Codigo: codigo } });
  if (!found) {
    return res.status(405).json({ erro: 'Produto não encontrado' });
  }
  return res.status(200).json({ mensagem: 'Deletado' });
});

productRoute.put('/', async (req, res) => {
  try {
    const { Codigo, Descricao, Preco } = req.body;
    if (!Codigo || !Descricao || !Preco) {
      return res.status(400).json({ erro: 'Codigo, Descricao e Preco são obrigatórios. ' });
    }
    const found = await db.produto.findOne({ where: { Codigo } });
    if (!found) {
      return res.status(405).json({ erro: `Produto não encontrado com o Codigo ${Codigo}` });
    }
    await db.produto.update(
      { Descricao, Preco },
      { where: { Codigo } },
    );
    return res.status(200).json(await db.produto.findOne({ where: { Codigo } }));
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
});

module.exports = productRoute;
