import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateResponsavelDto } from './dto/create-responsavel.dto';
import { CriarResponsavelUseCase } from './use-cases/criar-responsavel.use-case';
import { MostrarUmResponsavel } from './use-cases/mostrar-um-responsavel.use-case';

@Controller('responsavel')
export class ResponsavelController {
  constructor(
    private readonly criarResponsavel: CriarResponsavelUseCase,
    private readonly mostrarUmResponsavel: MostrarUmResponsavel,
  ) {}

  @Post('/create')
  async create(@Body() dto: CreateResponsavelDto) {
    return await this.criarResponsavel.execute(dto);
  }

  @Get(':email')
  async mostrarUm(@Param('email') email: string) {
    return await this.mostrarUmResponsavel.execute(email);
  }
}
