import { PrismaClient } from '../src/generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load .env.local manually
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');
try {
  const envContent = readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^"|"$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
} catch {}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('ERROR: DATABASE_URL not found in .env.local');
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@priyajewellery.com';
  const password = process.env.ADMIN_PASSWORD || 'Priya@123';

  const hash = await bcrypt.hash(password, 12);

  // Check if admin already exists
  const existing = await prisma.admin.findUnique({ where: { email } });

  if (existing) {
    console.log('Admin already exists — updating password...');
    await prisma.admin.update({
      where: { email },
      data: { passwordHash: hash },
    });
  } else {
    console.log('Creating admin user...');
    await prisma.admin.create({
      data: { email, passwordHash: hash, name: 'Admin' },
    });
  }

  console.log('\n✅ Done! Login at http://localhost:3000/admin/login');
  console.log('   Email:   ', email);
  console.log('   Password:', password);

  // Also ensure Settings row exists
  const settings = await prisma.settings.findUnique({ where: { id: 'main' } });
  if (!settings) {
    await prisma.settings.create({ data: { id: 'main' } });
    console.log('✅ Settings row created.');
  }

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
