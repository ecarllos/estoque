import { Injectable } from '@nestjs/common';
import { VinculoCommand } from '../repository/command.repo';
import { VinculoQuery } from '../repository/query.repo';

@Injectable()
export class CriarVinculoUseCase {
  constructor(
    private readonly command: VinculoCommand,
    private readonly query: VinculoQuery,
  ) {}
}
