const Container = require('../container/container');

describe('UsersRepository', () => {
  let client;
  let repository;

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

  test('Repositório deve listar todos os Usuários', async () => {
    // Sem usuários
    const result1 = await repository.findAll();

    expect(result1.length).toBe(0);

    // Com usuários
    const newUser = {
      name: 'Teste Teste',
      email: 'teste@teste.com',
      password: 'Teste123',
    };

    await repository.create(newUser);

    const result2 = await repository.findAll();

    expect(result2.length).toBe(1);

    expect(result2[0]).toStrictEqual(expect.objectContaining(newUser));
  });

  test('Repositório deve criar um novo Usuário', async () => {
    const newUser = {
      name: 'Teste Teste',
      email: 'teste@teste.com',
      password: 'Teste123',
    };

    const result = await repository.create(newUser);

    expect(result).toStrictEqual(expect.objectContaining(newUser));

    const users = await repository.findAll();

    expect(users.length).toBe(1);
  });

  test('Repositório deve detalhar um Usuário', async () => {
    const newUser = {
      name: 'Teste Teste',
      email: 'teste@teste.com',
      password: 'Teste123',
    };

    const user = await repository.create(newUser);

    const result = await repository.findById(user._id);

    expect(result).toStrictEqual(user);
  });

  test('Repositório deve atualizar um Usuário', async () => {
    const newUser = {
      name: 'Teste Teste',
      email: 'teste@teste.com',
      password: 'Teste123',
    };

    const user = await repository.create(newUser);

    user.name = 'Teste Alterado';
    await repository.update(user);

    const result = await repository.findById(user._id);
    expect(result).toStrictEqual(
      expect.objectContaining({
        name: 'Teste Alterado',
        email: 'teste@teste.com',
        password: 'Teste123',
      })
    );
  });

  test('Repositório deve remover um Usuário', async () => {
    const newUser = {
      name: 'Teste Teste',
      email: 'teste@teste.com',
      password: 'Teste123',
    };

    const user = await repository.create(newUser);

    await repository.delete(user);

    const users = await repository.findAll();
    expect(users.length).toBe(0);
  });
});
