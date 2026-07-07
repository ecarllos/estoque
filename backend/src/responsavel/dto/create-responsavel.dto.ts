import { Cidades, Setores } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateResponsavelDto {
  @IsNotEmpty()
  @IsString()
  nome!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  setor!: Setores;

  @IsNotEmpty()
  cidade!: Cidades;

  @IsBoolean()
  status!: boolean;

  @IsOptional()
  @IsString()
  assinatura?: string;
}
