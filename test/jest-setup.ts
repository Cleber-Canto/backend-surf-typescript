import { SetupServer } from '@src/server';
import supertest from 'supertest';

let server: SetupServer;

beforeAll(async () => {
  server = new SetupServer();
  await server.init();
  global.testRequest = supertest(server.getApp()) as unknown as supertest.SuperTest<supertest.Test>;
});

afterAll(async () => {
  if (server) {
    try {
      await server.close(); // Fechar o servidor sem logs desnecessários
    } catch (error) {
      console.error('Erro ao fechar o servidor:', error); // Logar o erro caso ocorra
    }
  }
});
