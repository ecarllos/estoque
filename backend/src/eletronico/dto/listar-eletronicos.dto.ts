import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class listarEletronicosDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  paginas: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limite: number = 10;
}
