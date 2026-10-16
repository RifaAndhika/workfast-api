import { prisma } from "../../lib/prisma";
import cron from "node-cron";

export const generateMonthlyRevenueReport = async (customDate?: Date) => {
  const today = customDate || new Date();

  //ambil tahun dan bulan saat ini dalam format UTC agar terhindar dari bug zona waktu server (UTC vs WIB)
  const currentUTCFullYear = today.getUTCFullYear();
  const currentUTCMonth = today.getUTCMonth();

  // tentukan target bulan lalu yang mau digenerate report-nya. Misal sekarang tanggal 3 october (bulan  indeks 9), maka target bulan lalu adalah september (bulan indeks 8)
  const targetMonthIndex = currentUTCMonth - 1;

  const startDate = new Date(
    Date.UTC(currentUTCFullYear, targetMonthIndex, 1, 0, 0, 0),
  );
  const firstDayOfCurrentMonth = Date.UTC(
    currentUTCFullYear,
    currentUTCMonth,
    1,
    0,
    0,
    0,
    0,
  );
  // tanggal terakhir bulan lalu adalah satu milidetik sebelum tanggal pertama bulan ini
  const endDate = new Date(firstDayOfCurrentMonth - 1); // tanggal terakhir bulan lalu

  console.log(
    `Generating monthly revenue report for ${startDate.toISOString()} to ${endDate.toISOString()}`,
  );

  try {
    const revenueAgregation = await prisma.revenueEntry.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        recordedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalRevenue = revenueAgregation._sum.amount
      ? Number(revenueAgregation._sum.amount)
      : 0;
    console.log(
      `Total revenue for ${startDate.toISOString()} to ${endDate.toISOString()}: ${totalRevenue}`,
    );

    // 5. Simpan ke database Supabase menggunakan Upsert
    const monthlyReport = await prisma.monthlyReport.upsert({
      where: {
        month_year: {
          month: targetMonthIndex + 1,
          year: currentUTCFullYear,
        },
      },
      update: {
        totalRevenueCached: totalRevenue,
        generatedAt: new Date(),
      },
      create: {
        month: targetMonthIndex + 1,
        year: currentUTCFullYear,
        totalRevenueCached: totalRevenue,
        generatedAt: new Date(),
      },
    });
    return monthlyReport;
  } catch (error) {
    console.error("Error generating monthly revenue report:", error);
    throw error;
  }
};

// --- PINDAHKAN CRON SCHEDULE KE LUAR FUNGSI DI SINI ---
// Berjalan otomatis setiap tanggal 1 jam 00:05 UTC
cron.schedule(
  "5 0 1 * *",
  async () => {
    console.log("Running scheduled monthly revenue report CRON job...");
    try {
      await generateMonthlyRevenueReport();
    } catch (err) {
      console.error("CRON Job failed:", err);
    }
  },
  {
    timezone: "UTC", // Memastikan berjalan berbasis waktu UTC sesuai logika codingan Anda
  },
);

generateMonthlyRevenueReport(); // Panggil fungsi ini saat server dijalankan untuk memastikan data bulan lalu sudah ada di database
