-- CreateEnum
CREATE TYPE "Acao" AS ENUM ('DEVOLVIDO', 'ENTREGUE');

-- CreateEnum
CREATE TYPE "Perifericos" AS ENUM ('MOUSE', 'TECLADO', 'MOUSE_PAD', 'CARREGADOR', 'SUPORTE');

-- CreateEnum
CREATE TYPE "Operadoras" AS ENUM ('CLARO', 'TIM', 'VIVO');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('LIVRE', 'OCUPADO');

-- CreateEnum
CREATE TYPE "Marcas" AS ENUM ('LENOVO', 'SAMSUNG', 'XIAOMI', 'MOTOROLA', 'GENERICO', 'OUTRA');

-- CreateEnum
CREATE TYPE "Condicao" AS ENUM ('NOVO', 'SEMI_NOVO', 'USADO');

-- CreateEnum
CREATE TYPE "Aparelhos" AS ENUM ('NOTEBOOK', 'CELULAR', 'TABLET');

-- CreateEnum
CREATE TYPE "Setores" AS ENUM ('COMERCIAL', 'BACKOFFICE', 'ADMINISTRATIVO', 'RELACIONAMENTO', 'TI');

-- CreateEnum
CREATE TYPE "Cidades" AS ENUM ('FORTALEZA', 'JUAZEIRO', 'JOINVILLE', 'JOAO_PESSOA');

-- CreateTable
CREATE TABLE "Responsavel" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "setor" "Setores" NOT NULL,
    "cidade" "Cidades" NOT NULL,
    "status" BOOLEAN NOT NULL,
    "assinatura" TEXT NOT NULL,

    CONSTRAINT "Responsavel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Eletronico" (
    "id" TEXT NOT NULL,
    "tipo" "Aparelhos" NOT NULL,
    "numeroSerie" TEXT NOT NULL,
    "marca" "Marcas" NOT NULL,
    "modelo" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "situacao" "Status" NOT NULL,
    "seguro" BOOLEAN NOT NULL,
    "condicao" "Condicao" NOT NULL,
    "vinculoId" TEXT,

    CONSTRAINT "Eletronico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chip" (
    "id" TEXT NOT NULL,
    "operadora" "Operadoras" NOT NULL,
    "ddd" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "vinculoId" TEXT,

    CONSTRAINT "Chip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Periferico" (
    "id" TEXT NOT NULL,
    "tipo" "Perifericos" NOT NULL,
    "marca" "Marcas" NOT NULL,
    "condicao" "Condicao" NOT NULL,
    "situacao" "Status" NOT NULL,
    "vinculoId" TEXT,

    CONSTRAINT "Periferico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vinculo" (
    "id" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "responsavelId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vinculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricoObjeto" (
    "id" TEXT NOT NULL,
    "vinculoId" TEXT NOT NULL,
    "responsavelId" TEXT NOT NULL,
    "condicao" "Condicao" NOT NULL,
    "acao" "Acao" NOT NULL,
    "detalhes" TEXT,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoricoObjeto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Responsavel_email_key" ON "Responsavel"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Eletronico_numeroSerie_key" ON "Eletronico"("numeroSerie");

-- CreateIndex
CREATE UNIQUE INDEX "Eletronico_vinculoId_key" ON "Eletronico"("vinculoId");

-- CreateIndex
CREATE UNIQUE INDEX "Chip_numero_key" ON "Chip"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Chip_vinculoId_key" ON "Chip"("vinculoId");

-- CreateIndex
CREATE UNIQUE INDEX "Periferico_vinculoId_key" ON "Periferico"("vinculoId");

-- CreateIndex
CREATE INDEX "Vinculo_responsavelId_idx" ON "Vinculo"("responsavelId");

-- CreateIndex
CREATE INDEX "HistoricoObjeto_responsavelId_idx" ON "HistoricoObjeto"("responsavelId");

-- AddForeignKey
ALTER TABLE "Eletronico" ADD CONSTRAINT "Eletronico_vinculoId_fkey" FOREIGN KEY ("vinculoId") REFERENCES "Vinculo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chip" ADD CONSTRAINT "Chip_vinculoId_fkey" FOREIGN KEY ("vinculoId") REFERENCES "Vinculo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Periferico" ADD CONSTRAINT "Periferico_vinculoId_fkey" FOREIGN KEY ("vinculoId") REFERENCES "Vinculo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vinculo" ADD CONSTRAINT "Vinculo_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "Responsavel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoObjeto" ADD CONSTRAINT "HistoricoObjeto_vinculoId_fkey" FOREIGN KEY ("vinculoId") REFERENCES "Vinculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoObjeto" ADD CONSTRAINT "HistoricoObjeto_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "Responsavel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
