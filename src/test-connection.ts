import { prisma } from "./lib/prisma";

async function main() {
  const result = await prisma.$queryRaw`SELECT 1 as result`;
  console.log("Koneksi berhasil:", result);
}

main()
  .catch((e) => console.error("Koneksi GAGAL:", e))
  .finally(() => process.exit());
