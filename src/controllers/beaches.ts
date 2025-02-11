import { Controller, Post, Get, ClassMiddleware } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Beach } from '@src/models/beach';
import mongoose from 'mongoose';
import { authMiddleware } from '@src/middlewares/auth';

@Controller('beaches')
@ClassMiddleware(authMiddleware)
export class BeachesController {
  constructor() {
    console.log('🔥 BeachesController registrado!');
  }

  @Post('')
  public async create(req: Request, res: Response): Promise<Response> {
    console.log('Headers:', req.headers);
    console.log('Recebendo dados no body:', req.body);

    try {
      const beach = new Beach({ ...req.body, user: req.decoded?.id });
      const result = await beach.save();

      const response = { message: 'Praia criada com sucesso', data: result };
      console.log('✅ Resposta enviada (POST /beaches):', response);

      return res.status(201).json(response);
    } catch (error) {
      return this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Get('')
  public async getAll(req: Request, res: Response): Promise<Response> {
    console.log('🔥 Rota /beaches chamada');
    try {
      const beaches = await Beach.find();
      const response = { message: 'Lista de praias', data: beaches };
      
      console.log('✅ Resposta enviada (GET /beaches):', response);
      return res.status(200).json(response);
    } catch (error) {
      console.error('❌ Erro ao buscar praias:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  protected sendCreateUpdateErrorResponse(res: Response, error: unknown): Response {
    if (error instanceof mongoose.Error.ValidationError) {
      const clientErrors = this.handleClientErrors(error);
      console.error('❌ Erro de validação:', clientErrors);
      return res.status(clientErrors.code).json(clientErrors);
    }
    console.error('❌ Erro interno:', error);
    return res.status(500).json({ code: 500, error: 'Erro interno do servidor' });
  }

  private handleClientErrors(
    error: mongoose.Error.ValidationError
  ): { code: number; error: string } {
    const duplicatedKindErrors = Object.values(error.errors).filter(
      (err) => err.name === 'ValidatorError' && err.kind === 'duplicated'
    );
    if (duplicatedKindErrors.length) {
      return { code: 409, error: 'Registro duplicado' };
    }
    return { code: 422, error: error.message };
  }
}
