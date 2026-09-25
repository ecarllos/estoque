import { ConflictException, Injectable } from '@nestjs/common';
import { ResponsavelQuery } from '../repository/query.repo';
import { ResponsavelCommand } from '../repository/command.repo';
import { CreateResponsavelDto } from '../dto/create-responsavel.dto';

@Injectable()
export class CriarResponsavelUseCase {
  constructor(
    private readonly query: ResponsavelQuery,
    private readonly command: ResponsavelCommand,
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
