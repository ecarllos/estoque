import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ResponsavelCommand } from '../repository/command.repo';
import { ResponsavelQuery } from '../repository/query.repo';
import { UpdateResponsavelDto } from '../dto/update-responsavel.dto';

@Injectable()
export class AtualizarResponsavel {
  constructor(
    private readonly command: ResponsavelCommand,
    private readonly query: ResponsavelQuery,
  ) {}

  async execute(id: string, dto: UpdateResponsavelDto) {
    const foundId = await this.query.buscarId(id);
    if (!foundId) {
      throw new NotFoundException('id do responsável não encontrado');
    }

    if (dto.email) {
      const foundEmail = await this.query.buscarId(id);

      if (foundEmail?.email == dto.email) {
        throw new BadRequestException(`esse responsável já possui esse email`);
      }
      if (foundEmail) {
        throw new ConflictException(`esse email já está em uso`);
      }
    }

    const update = await this.command.updateResponsavel(id, dto);

    return update;
  }
}
