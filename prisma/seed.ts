import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/modules/auth/auth.utils";

async function main() {
  const hashedPassword = await hashPassword("password");

  const user = await prisma.user.upsert({
    where: {
      email: "owner@gmail.com",
    },
    update: {},
    create: {
      name: "Owner Utama",
      email: "owner@gmail.com",
      passwordHash: hashedPassword,
      role: "Owner",
    },
  });

  console.log({ user });
}

main()
  .catch((error) => {
    console.error("terjadi kesalahan saat menjalankan seed:", error);
    process.exitCode = 1; // keluarkan skrip dengan kode error
  })
  .finally(async () => {
    console.log("selesai menjalankan seed");
    await prisma.$disconnect();
  });

// 2. Kenapa .finally() dengan prisma.$disconnect() itu Wajib?Sifat skrip seperti seed.
// ts atau test-connection.ts adalah skrip sekali jalan (ephemeral/short-lived script). Mereka bertugas menyelesaikan satu tugas
// spesifik lalu mati, sangat berbeda dengan server.ts (API Server)
//  yang memang didesain untuk hidup terus di latar belakang untuk mendengarkan request masuk.
