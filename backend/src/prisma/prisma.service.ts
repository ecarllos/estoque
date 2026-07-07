import 'dotenv/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // 1. Lemos a URL de conexão do ambiente
    const connectionString = process.env.DATABASE_URL;

    // 2. Criamos um Pool de conexão nativo do PostgreSQL
    const pool = new Pool({ connectionString });

    // 3. Criamos o adapter exigido pela v7
    const adapter = new PrismaPg(pool);

    // 4. Injetamos o adapter no PrismaClient
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
