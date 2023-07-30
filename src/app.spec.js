const app = require('./app');
const Container = require('./container/container');
const request = require('supertest')(app);

describe('API Backend para gestão de usuários', () => {
  let repository;
  let client;

  beforeAll(async () => {
    const container = new Container();
    client = container.getClient();
    repository = await container.getRepository();
  });

  afterAll(async () => {
    await client.close();
  });

  beforeEach(async () => {
    await repository.deleteAll();
  });

  describe('Endpoints de coleção', () => {
    test('GET /users deve listar todos os Usuários - Status 200', async () => {
      const newUser = {
        name: 'Teste Teste',
        email: 'teste@teste.com',
        password: 'Teste123',
      };

      await repository.create(newUser);

      const response = await request
        .get('/users')
        .expect('Content-type', /application\/json/);

      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toStrictEqual(
        expect.objectContaining({
          name: 'Teste Teste',
          email: 'teste@teste.com',
          password: 'Teste123',
        })
      );
    });

    test('POST /users deve criar um novo Usuário - Status 201', async () => {
      const newUser = {
        name: 'Teste Teste',
        email: 'teste@teste.com',
        password: 'Teste123',
      };

      const response = await request.post('/users').send(newUser);

      expect(response.statusCode).toBe(201);
      expect(response.body).toStrictEqual(expect.objectContaining(newUser));
    });
  });

  describe('Endpoints de item', () => {
    describe('GET /users/:id deve detalhar um Usuário - Status 200 ou Status 404', () => {
      test('Deve retornar 200 para um Usuário existente', async () => {
        const user = await repository.create({
          name: 'Teste Teste',
          email: 'teste@teste.com',
          password: 'Teste123',
        });

        const response = await request
          .get(`/users/${user._id}`)
          .expect('Content-type', /application\/json/);

        expect(response.statusCode).toBe(200);

        expect(response.body).toStrictEqual(
          expect.objectContaining({
            name: 'Teste Teste',
            email: 'teste@teste.com',
            password: 'Teste123',
          })
        );
      });

      test('Deve retornar 404 para um Usuário inexistente', async () => {
        const response = await request
          .get('/users/123456789012')
          .expect('Content-type', /application\/json/);

        expect(response.statusCode).toBe(404);

        expect(response.body).toStrictEqual({
          status: 404,
          error: 'Usuário não encontrado',
        });
      });
    });

    describe('PUT /users/:id deve atualizar um Usuário - Status 200 ou Status 400', () => {
      test('Deve retornar 200 para um Usuário existente', async () => {
        const user = await repository.create({
          name: 'Teste Teste',
          email: 'teste@teste.com',
          password: 'Teste123',
        });

        const response = await request
          .put(`/users/${user._id}`)
          .send({
            name: 'Teste2 Teste2',
            email: 'teste2@teste2.com',
            password: 'Teste1232',
          })
          .expect('Content-type', /application\/json/);

        expect(response.statusCode).toBe(200);

        expect(response.body).toStrictEqual(
          expect.objectContaining({
            name: 'Teste2 Teste2',
            email: 'teste2@teste2.com',
            password: 'Teste1232',
          })
        );

        const newUser = await repository.findById(user._id);
        expect(newUser).toStrictEqual(
          expect.objectContaining({
            name: 'Teste2 Teste2',
            email: 'teste2@teste2.com',
            password: 'Teste1232',
          })
        );
      });

      test('Deve retornar 404 para um Usuário inexistente', async () => {
        const response = await request
          .put('/users/123456789012')
          .send({
            name: 'Teste Teste',
            email: 'teste@teste.com',
            password: 'Teste123',
          })
          .expect('Content-type', /application\/json/);

        expect(response.statusCode).toBe(404);

        expect(response.body).toStrictEqual({
          status: 404,
          error: 'Usuário não encontrado',
        });
      });
    });

    describe('DELETE /users/:id deve remover um Usuário - Status 204 ou Status 404', () => {
      test('Deve retornar 204 para um Usuário existente', async () => {
        const user = await repository.create({
          name: 'Teste Teste',
          email: 'teste@teste.com',
          password: 'Teste123',
        });

        const response = await request.delete(`/users/${user._id}`);

        expect(response.statusCode).toBe(204);

        expect(response.body).toStrictEqual({});

        const newUser = await repository.findById(user._id);
        expect(newUser).toBe(null);
      });

      test('Deve retornar 404 para um Usuário inexistente', async () => {
        const response = await request
          .delete('/users/123456789012')
          .expect('Content-type', /application\/json/);

        expect(response.statusCode).toBe(404);

        expect(response.body).toStrictEqual({
          status: 404,
          error: 'Usuário não encontrado',
        });
      });
    });
  });
});
