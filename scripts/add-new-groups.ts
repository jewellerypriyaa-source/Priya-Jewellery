/**
 * Add 4 new jewellery group placeholder categories to the DB.
 * Run: npx ts-node --esm scripts/add-new-groups.ts
 */
import { PrismaClient } from "../src/generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as unknown as ConstructorParameters<typeof PrismaClient>[0]);

const newGroups = [
  { name: "Polki Kundan",  slug: "polki-kundan",  group: "Polki Kundan",  displayOrder: 1 },
  { name: "Bridal",        slug: "bridal",         group: "Bridal",        displayOrder: 1 },
  { name: "German Silver", slug: "german-silver",  group: "German Silver", displayOrder: 1 },
  { name: "Oxidised",      slug: "oxidised",       group: "Oxidised",      displayOrder: 1 },
];

async function main() {
  for (const g of newGroups) {
    const existing = await prisma.category.findUnique({ where: { slug: g.slug } });
    if (existing) {
      console.log(`⏭️  "${g.name}" already exists — skipping`);
      continue;
    }
    await prisma.category.create({
      data: {
        name: g.name,
        slug: g.slug,
        group: g.group,
        displayOrder: g.displayOrder,
        description: `${g.group} jewellery collection at Priyaa Jewellery.`,
        metaTitle: `${g.name} Jewellery | Priyaa Jewellery`,
        metaDesc: `Shop ${g.name} jewellery at Priyaa Jewellery. Quality pieces at great prices.`,
        isActive: true,
      },
    });
    console.log(`✅ Added: ${g.name}`);
  }
  console.log("🎉 Done!");
}

main()
  .catch((e) => { console.error("❌", e); process.exit(1); })
  .finally(() => { prisma.$disconnect(); pool.end(); });
