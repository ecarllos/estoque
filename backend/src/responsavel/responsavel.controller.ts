import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateResponsavelDto } from './dto/create-responsavel.dto';
import { CriarResponsavelUseCase } from './use-cases/criar-responsavel.use-case';
import { MostrarUmResponsavel } from './use-cases/mostrar-um-responsavel.use-case';
import { ListarTodosResponsaveis } from './use-cases/listar-todos-responsaveis.use-case';
import { ListarResponsaveisDto } from './dto/listar-responsaveis.dto';
import { UpdateResponsavelDto } from './dto/update-responsavel.dto';
import { AtualizarResponsavel } from './use-cases/atualizar-responsavel.use-case';
import { DeletarResponsavel } from './use-cases/deletar-responsavel.use-case';

@Controller('responsavel')
export class ResponsavelController {
  constructor(
    private readonly criarResponsavel: CriarResponsavelUseCase,
    private readonly mostrarUmResponsavel: MostrarUmResponsavel,
    private readonly listarTodosResponsaveis: ListarTodosResponsaveis,
    private readonly atualizarResponsavel: AtualizarResponsavel,
    private readonly deleteResponsavel: DeletarResponsavel,
  ) {}

  @Post('/create')
  async create(@Body() dto: CreateResponsavelDto) {
    return await this.criarResponsavel.execute(dto);
  }

  @Get('/listar')
  async listarTodos(@Query() dto: ListarResponsaveisDto) {
    return await this.listarTodosResponsaveis.execute(dto);
  }

  @Get(':email')
  async mostrarUm(@Param('email') email: string) {
    return await this.mostrarUmResponsavel.execute(email);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateResponsavelDto) {
    return await this.atualizarResponsavel.execute(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.deleteResponsavel.execute(id);
  }
}
