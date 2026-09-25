import { Injectable, NotFoundException } from '@nestjs/common';
import { ResponsavelCommand } from '../repository/command.repo';
import { ResponsavelQuery } from '../repository/query.repo';

@Injectable()
export class DeletarResponsavel {
  constructor(
    private readonly command: ResponsavelCommand,
    private readonly query: ResponsavelQuery,
  ) {}

  async execute(id: string) {
    const foundId = await this.query.buscarId(id);
    if (!foundId) {
      throw new NotFoundException('id do responsável não encontrado');
    }

    const deleted = await this.command.deleteResponsavel(id);

    return {
      message: 'responsavel foi deletado',
      deleted,
    };
  }
}
