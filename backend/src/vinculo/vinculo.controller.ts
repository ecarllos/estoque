import { Body, Controller, Post } from '@nestjs/common';
import { CriarVinculoUseCase } from './use-cases/criar-vinculo.use-case';
import { CreateVinculoDto } from './dto/create/createVinculo.dto';

@Controller('vinculo')
export class VinculoController {
  constructor(private readonly criar: CriarVinculoUseCase) {}
  @Post('create')
  async criarVinculo(@Body() dto: CreateVinculoDto) {
    // console.log(dto);

    return await this.criar.execute(dto);
  }
}
