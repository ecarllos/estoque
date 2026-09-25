import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateHistoricoDto } from './createHistorico.dto';

export const tipoObjeto = ['ELETRONICO', 'PERIFERICO', 'CHIP'] as const;

export class CreateVinculoDto {
  @IsNotEmpty()
  @IsString()
  responsavelId!: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(tipoObjeto, { message: 'tipoObjeto inválido!' })
  tipoObjeto!: (typeof tipoObjeto)[number];

  @IsNotEmpty()
  @IsString()
  objetoId!: string;

  @IsOptional()
  @IsString()
  detalhes?: string;

  @ValidateNested()
  @Type(() => CreateHistoricoDto)
  historico!: CreateHistoricoDto;
}
