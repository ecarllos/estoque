import { Aparelhos, Cidades, Condicao, Marcas, Status } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CriarEletronicoDto {
  @IsNotEmpty()
  tipo!: Aparelhos;

  @IsNotEmpty()
  numeroSerie!: string;

  @IsNotEmpty()
  marca!: Marcas;

  @IsNotEmpty()
  modelo!: string;

  @IsOptional()
  senha?: string;

  @IsNotEmpty()
  situacao!: Status;

  @IsNotEmpty()
  seguro!: boolean;

  @IsNotEmpty()
  condicao!: Condicao;

  @IsNotEmpty()
  cidade!: Cidades;
}
