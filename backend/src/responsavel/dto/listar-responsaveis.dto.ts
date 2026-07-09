import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class ListarResponsaveisDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  paginas: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limite: number = 5;
}
