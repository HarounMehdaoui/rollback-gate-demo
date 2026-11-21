// The "application" for the rollback lab: create one user, then list users.
// Each step is caught separately so that one failure doesn't hide the other.
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

let failed = false;

async function step(label: string, run: () => Promise<unknown>): Promise<void> {
  try {
    console.log(`${label}: OK`, JSON.stringify(await run()));
  } catch (err) {
    failed = true;
    const e = err as { code?: string; message?: string };
    console.log(`${label}: FAILED code=${e.code ?? "none"}\n${e.message}`);
  }
}

await step("create", () =>
  prisma.user.create({
    data: {
      fullName: "Grace Hopper",
      email: `grace+${Date.now()}@example.com`,
      phone: "+1-555-0100",
    },
  }),
);
await step("list", () => prisma.user.findMany());

await prisma.$disconnect();
process.exitCode = failed ? 1 : 0;
