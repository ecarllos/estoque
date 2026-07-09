import { Body, Controller, Post } from '@nestjs/common';
import { CriarEletronicoDto } from './dto/criar-eletronico.dto';
import { CriarEletronicoUseCase } from './use-cases/criar-eletronico.use-case';

@Controller('eletronico')
export class EletronicoController {
  constructor(private readonly criar: CriarEletronicoUseCase) {}

  @Post('/create')
  async create(@Body() dto: CriarEletronicoDto) {
    return this.criar.execute(dto);
  }
}
