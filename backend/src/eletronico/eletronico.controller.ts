import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CriarEletronicoDto } from './dto/criar-eletronico.dto';
import { CriarEletronicoUseCase } from './use-cases/criar-eletronico.use-case';
import { listarEletronicosDto } from './dto/listar-eletronicos.dto';
import { ListarEletronicosUseCase } from './use-cases/listar-eletronico.use-case';

@Controller('eletronico')
export class EletronicoController {
  constructor(
    private readonly criar: CriarEletronicoUseCase,
    private readonly listar: ListarEletronicosUseCase,
  ) {}

  @Post('/create')
  async create(@Body() dto: CriarEletronicoDto) {
    return this.criar.execute(dto);
  }

  @Get('/listar')
  async listarTodos(@Query() dto: listarEletronicosDto) {
    return await this.listar.execute(dto);
  }
}
