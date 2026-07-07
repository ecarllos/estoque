import { Controller, Post, Body } from '@nestjs/common';
import { CreateResponsavelDto } from './dto/create-responsavel.dto';
import { CriarResponsavelUseCase } from './use-cases/criar-responsavel.use-case';

@Controller('responsavel')
export class ResponsavelController {
  constructor(private readonly criarResponsavel: CriarResponsavelUseCase) {}

  @Post('/create')
  create(@Body() createResponsavelDto: CreateResponsavelDto) {
    return this.criarResponsavel.execute(createResponsavelDto);
  }
}
