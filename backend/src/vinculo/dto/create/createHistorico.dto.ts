import { Condicao } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHistoricoDto {
  @IsNotEmpty()
  condicao!: Condicao;

  @IsNotEmpty()
  @IsString()
  detalhes!: string;
}
