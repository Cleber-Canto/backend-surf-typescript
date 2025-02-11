import { Controller, Post, Get } from '@overnightjs/core';
import { Response, Request } from 'express';
import { User } from '@src/models/user';
import AuthService from '@src/services/auth';
import { BaseController } from './index';

@Controller('users')
export class UsersController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const newUser = await user.save();
      console.log('Novo usuário criado:', newUser); // Log no terminal
      res.status(201).send(newUser);
    } catch (error) {
      console.error('Erro ao criar usuário:', error); // Log de erro
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Post('authenticate')
  public async authenticate(req: Request, res: Response): Promise<Response> {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        console.warn('Tentativa de login com email não cadastrado:', req.body.email);
        return res.status(401).send({ code: 401, error: 'User not found!' });
      }
      
      const passwordMatch = await AuthService.comparePasswords(req.body.password, user.password);
      if (!passwordMatch) {
        console.warn('Tentativa de login com senha incorreta para o usuário:', req.body.email);
        return res.status(401).send({ code: 401, error: 'Password does not match!' });
      }
      
      const token = AuthService.generateToken(user.toJSON());
      console.log('Usuário autenticado com sucesso:', user.email);
      
      return res.send({ ...user.toJSON(), ...{ token } });
    } catch (error) {
      console.error('Erro ao autenticar usuário:', error); // Log de erro
      return res.status(500).send({ code: 500, error: 'Internal server error' });
    }
  }

  @Get('')
  public async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await User.find();
      console.log('Lista de usuários retornada:', users);
      return res.status(200).json({ message: 'Lista de usuários', data: users });
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
