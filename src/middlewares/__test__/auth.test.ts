import AuthService from '@src/services/auth';
import { authMiddleware } from '../auth';

describe('AuthMiddleware', () => {
  it('should verify a JWT token and call the next middleware', () => {
    // Gera um token válido
    const jwtToken = AuthService.generateToken({ data: 'fake' });

    // Cria um objeto de requisição fake com o token
    const reqFake = {
      headers: {
        'x-access-token': jwtToken,
      },
    };

    // Cria um objeto de resposta fake
    const resFake = {};

    // Cria uma função next fake com Jest
    const nextFake = jest.fn();

    // Executa o middleware
    authMiddleware(reqFake as any, resFake as any, nextFake);

    // Verifica se o next foi chamado
    expect(nextFake).toHaveBeenCalled();
  });

  it('should return UNAUTHORIZED if there is a problem on the token verification', () => {
    // Cria um objeto de requisição fake com um token inválido
    const reqFake = {
      headers: {
        'x-access-token': 'invalid token',
      },
    };

    // Cria um mock para a função send
    const sendMock = jest.fn();

    // Cria um objeto de resposta fake com mocks para status e send
    const resFake = {
      status: jest.fn(() => ({
        send: sendMock,
      })),
    };

    // Cria uma função next fake com Jest
    const nextFake = jest.fn();

    // Executa o middleware
    authMiddleware(reqFake as any, resFake as any, nextFake);

    // Verifica se o status 401 foi retornado
    expect(resFake.status).toHaveBeenCalledWith(401);

    // Verifica se a mensagem de erro correta foi enviada
    expect(sendMock).toHaveBeenCalledWith({
      code: 401,
      error: 'jwt malformed',
    });
  });

  it('should return UNAUTHORIZED middleware if there is no token', () => {
    // Cria um objeto de requisição fake sem token
    const reqFake = {
      headers: {},
    };

    // Cria um mock para a função send
    const sendMock = jest.fn();

    // Cria um objeto de resposta fake com mocks para status e send
    const resFake = {
      status: jest.fn(() => ({
        send: sendMock,
      })),
    };

    // Cria uma função next fake com Jest
    const nextFake = jest.fn();

    // Executa o middleware
    authMiddleware(reqFake as any, resFake as any, nextFake);

    // Verifica se o status 401 foi retornado
    expect(resFake.status).toHaveBeenCalledWith(401);

    // Verifica se a mensagem de erro correta foi enviada
    expect(sendMock).toHaveBeenCalledWith({
      code: 401,
      error: 'jwt must be provided',
    });
  });
});
