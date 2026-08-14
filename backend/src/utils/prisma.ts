/**
 * Singleton Prisma Client instance for the RPO backend.
 *
 * Prisma v7 requires a driver adapter — we use @prisma/adapter-pg with the
 * 'pg' library for direct PostgreSQL connection.
 *
 * Import this from anywhere in the backend:
 *   import { prisma } from '@/utils/prisma';
 * Or with relative path:
 *   import { prisma } from '../utils/prisma';
 */

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
