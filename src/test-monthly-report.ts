import { prisma } from "./lib/prisma";
async function testMonthlyReport() {
  console.log("🚀 Memulai simulasi pencatatan laporan bulanan...");

  const today = new Date();

  // Batas akhir bulan lalu (Tanggal 0 jam 23:59:59)
  const endDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    0,
    23,
    59,
    59,
    999,
  );

  // Batas awal bulan lalu (Tanggal 1 jam 00:00:00)
  const startDate = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    1,
    0,
    0,
    0,
    0,
  );

  console.log(`\n📅 Rentang Waktu yang Dicari (Bulan Lalu):`);
  console.log(`   Garis Start  : ${startDate.toLocaleString()}`);
  console.log(`   Garis Finish : ${endDate.toLocaleString()}\n`);

  try {
    // Jalankan query ke tabel revenueEntry
    const report = await prisma.revenueEntry.aggregate({
      _sum: {
        amount: true, // ⚠️ Pastikan nama kolom ini sesuai dengan skema DB Anda
      },
      where: {
        recordedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalRevenue = report._sum.amount || 0;

    console.log("==================================================");
    console.log(`📊 HASIL REKAPITULASI BULANAN:`);
    console.log(
      `   Periode Bulan : ${startDate.getMonth() + 1} / ${startDate.getFullYear()}`,
    );
    console.log(
      `   Total Pendapatan: Rp ${totalRevenue.toLocaleString("id-ID")}`,
    );
    console.log("==================================================");
  } catch (error) {
    console.error("❌ Terjadi error saat query ke database:", error);
  }
}

testMonthlyReport();
