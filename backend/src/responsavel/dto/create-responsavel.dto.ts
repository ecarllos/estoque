import { Cidades, Setores } from '@prisma/client';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

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
}
