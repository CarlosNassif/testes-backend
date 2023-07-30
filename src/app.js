const UserRepository = require('./users/users');
const express = require('express');
const Container = require('./container/container');

const app = express();
app.use(express.json());
app.set('container', new Container());

app.get('/users', async (request, response) => {
  const repository = await app.get('container').getRepository();
  const users = await repository.findAll();

  response.json(users);
});

app.post('/users', async (request, response) => {
  const repository = await app.get('container').getRepository();

  try {
    const user = await repository.create(request.body);
    response.status(201).json(user);
  } catch (e) {
    response.status(500).json({ error: e.message });
  }
});

app.get('/users/:id', async (request, response) => {
  const repository = await app.get('container').getRepository();

  try {
    const user = await repository.findById(request.params.id);

    if (user === null) {
      response.status(404).json({
        status: 404,
        error: 'Usuário não encontrado',
      });
    } else {
      response.json(user);
    }
  } catch (e) {
    console.log(e);
    response.status(500).json({ error: e.message });
  }
});

app.put('/users/:id', async (request, response) => {
  const repository = await app.get('container').getRepository();
  const user = await repository.findById(request.params.id);

  if (user === null) {
    response.status(404).json({
      status: 404,
      error: 'Usuário não encontrado',
    });
  } else {
    const newUser = { ...user, ...request.body };
    await repository.update(newUser);
    response.json(newUser);
  }
});

app.delete('/users/:id', async (request, response) => {
  const repository = await app.get('container').getRepository();
  const user = await repository.findById(request.params.id);

  if (null !== user) {
    await repository.delete(user);
    response.sendStatus(204);
  } else {
    response.status(404).json({
      status: 404,
      error: 'Usuário não encontrado',
    });
  }
});

module.exports = app;
