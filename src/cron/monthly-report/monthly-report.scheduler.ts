import { prisma } from "../../lib/prisma";

export const generateMonthlyRevenueReport = async () => {
  // 1. Tentukan tanggal hari ini (misal running di 1 Oktober)
  const today = new Date();

  // 2. Cari batas akhir bulan lalu (Tanggal 0 jam 23:59:59)
  const endDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    0,
    23,
    59,
    59,
    999,
  );

  // 3. Cari batas awal bulan lalu (Tanggal 1 jam 00:00:00 di bulan yang sama dengan endDate)
  const startDate = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    1,
    0,
    0,
    0,
    0,
  );

  console.log(
    `🔎 Menarik data transaksi dari: ${startDate.toISOString()} sampai ${endDate.toISOString()}`,
  );
  console.log(
    `📅 Bulan: ${startDate.toLocaleString("default", { month: "long" })}`,
  );
  console.log(`📅 Tahun: ${startDate.getFullYear()}`);

  // 4. Jalankan Query SUM dengan Prisma Aggregate
  try {
    const revenueAggregation = await prisma.revenueEntry.aggregate({
      _sum: {
        amount: true, // sesuaikan dengan nama kolom nominal uang Anda
      },
      where: {
        recordedAt: {
          gte: startDate, // Mulai dari tanggal 1 jam 00:00:00
          lte: endDate, // Sampai tanggal 30/31 jam 23:59:59
        },
      },
    });

    const totalRevenue = revenueAggregation._sum.amount || 0;
    console.log(`💰 Total Revenue: ${totalRevenue}`);

    const MonthlyReport = await prisma.monthlyReport.upsert({
      where: {
        // Pastikan di schema.prisma Anda memiliki: @@unique([month, year])
        // Jika nama index compound-nya otomatis, tulisannya seperti di bawah ini:
        month_year: {
          month: startDate.getMonth() + 1, // Menggunakan 1-12 agar konsisten dengan filter data
          year: startDate.getFullYear(),
        },
      },
      update: {
        totalRevenueCached: totalRevenue,
        generatedAt: new Date(),
      },
      create: {
        month: startDate.getMonth() + 1,
        year: startDate.getFullYear(),
        totalRevenueCached: totalRevenue,
        generatedAt: new Date(),
      },
    });

    return MonthlyReport;
  } catch (error) {
    console.error("Error generating monthly report:", error);
    throw new Error("Failed to generate monthly report");
  }
};
