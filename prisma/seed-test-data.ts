import { prisma } from "../src/lib/prisma";

async function main() {
  const client = await prisma.client.upsert({
    where: {
      email: "client@gmail.com",
    },
    update: {},
    create: {
      name: "Client Utama",
      email: "rifaandhika9@gmail.com",
    },
  });
  console.log({ client });

  const invoice = await prisma.invoice.create({
    data: {
      clientId: client.id,
      productName: "Test Product",
      totalAmount: 100000,
      status: "PENDING",
      //Waktu sekarang dalam milidetik + (7 hari \(\times \) 24 jam \(\times \) 60 menit \(\times \) 60 detik \(\times \) 1000 milidetik).
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari dari sekarang
    },
  });
  console.log({ invoice });
}

main()
  .catch((error) => {
    console.error("Gagal membuat data test:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

//npx tsx buat jalanin seeder
