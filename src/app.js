const UserRepository = require('./users/users');
const express = require('express');
const Container = require('./container/container');

const app = express();
app.use(express.json());
app.set('container', new Container());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Request-Width, Content-Type, Accept'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.get('/users', async (request, response) => {
  const repository = await app.get('container').getRepository();
  const users = (await repository.findAll()).map((e) => {
    e.id = e._id;
    delete e._id;
    return e;
  });

  response.setHeader('Access-Control-Expose-Headers', [
    'X-Total-Count',
    'Access-Control-Allow-Origin',
  ]);
  response.setHeader('X-Total-Count', users.length);

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
    user.id = user._id;
    delete user._id;

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

app.delete('/users', async (request, response) => {
  const repository = await app.get('container').getRepository();

  await repository.deleteAll();
  response.sendStatus(204);
});

module.exports = app;
