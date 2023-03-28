const express = require('express');
const request = require('supertest');
const db = require('../src/db');

const app = express().use(express.json()).use('/', require('../src/app'));

test('Servidor na porta 5678', async () => {
  const resposta = await request(app).get('/');

  expect(resposta.status).toBe(200);
});

describe('Testes do desafio M4', () => {
  beforeEach(async () => {
    await db.produto.destroy({ where: {} });
  });

  const produtoTeste = {
    Codigo: 'DESM4-12345',
    Descricao: 'amarelo',
    Preco: 123.45,
  };

  const produtoTeste2 = {
    Codigo: 'DESM4-12345',
    Descricao: 'azul',
    Preco: 45.67,
  };

  test('Cria produto corretamente', async () => {
    const resposta = await request(app)
      .post('/produto')
      .send(produtoTeste);

    const produto = await db.produto.findOne({ where: { Codigo: produtoTeste.Codigo } });
    delete produto.createdAt;
    delete produto.updatedAt;

    expect(resposta.body).not.toBeUndefined();
    expect(resposta.status).toBe(201);
    expect(produto.Preco).toBe(produtoTeste.Preco);
  });

  test('Busca a lista de produtos', async () => {
    await db.produto.create(produtoTeste);
    const resposta = await request(app).get('/produto');
    expect(resposta.body.length).toBe(1);
    expect(resposta.body[0].Preco).toBe(produtoTeste.Preco);
    expect(resposta.status).toBe(200);
  });

  test('Deleta produto', async () => {
    const { Codigo } = produtoTeste;
    await db.produto.create(produtoTeste);
    const salvo = db.produto.findOne({ where: { Codigo } });
    expect(salvo).not.toBeUndefined();

    const result = await request(app).delete(`/produto/${produtoTeste.Codigo}`);
    expect(result.status).toBe(200);
    expect(result.body.mensagem).not.toBeUndefined();
  });

  test('Atualiza produto', async () => {
    await db.produto.create(produtoTeste);
    const result = await request(app)
      .put('/produto')
      .send(produtoTeste2);

    expect(result.body.Preco).toBe(produtoTeste2.Preco);
  });
});
