import { ConflictException, Injectable } from '@nestjs/common';
import { ResponsavelQuery } from '../repository/query.repo';
import { responsavelCommand } from '../repository/command.repo';
import { CreateResponsavelDto } from '../dto/create-responsavel.dto';

@Injectable()
export class CriarResponsavelUseCase {
  constructor(
    private readonly query: ResponsavelQuery,
    private readonly command: responsavelCommand,
  ) {}

  async execute(dto: CreateResponsavelDto) {
    const foundEmail = await this.query.buscarEmail(dto.email);

    if (foundEmail) {
      throw new ConflictException(
        `esse email ja esta vinculado a outro responsavel`,
      );
    }

    return await this.command.createResponsavel(dto);
  }
}
