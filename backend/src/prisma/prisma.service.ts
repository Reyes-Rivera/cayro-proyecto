import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// ✅ Singleton para evitar conexiones múltiples en Vercel
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
  }

  async onModuleInit() {
    await prisma.$connect();
  }

  async onModuleDestroy() {
    await prisma.$disconnect();
  }
}
