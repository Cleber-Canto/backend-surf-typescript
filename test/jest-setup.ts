import { SetupServer } from '@src/server';
import supertest from 'supertest';

let server: SetupServer;

beforeAll(async () => {
  server = new SetupServer();
  await server.init();
  global.testRequest = supertest(server.getApp()) as unknown as supertest.SuperTest<supertest.Test>;
});

afterAll(async () => {
  try {
    if (server) {
      await server.close(); // Fecha o servidor e libera recursos sem logs desnecessários
    }
  } catch (error) {
    console.error('Erro ao fechar o servidor:', error); // Apenas loga o erro se ocorrer
  }
});
