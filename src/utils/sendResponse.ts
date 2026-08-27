import { Response } from "express";

// Membuat struktur data JSON yang konsisten untuk Frontend
interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export function sendResponse(
  res: Response,
  statusCode: number, // Tambahkan ini agar bisa kirim status selain 200 (misal 201 created)
  message: string, // Tambahkan pesan penjelasan respon
  data: any = null, // Data opsional, bawaannya bernilai null
) {
  const responseBody: ApiResponse = {
    success: statusCode >= 200 && statusCode < 300, // Otomatis true jika status 2xx
    message: message,
  };

  // Jika ada data yang dikirim, masukkan ke dalam objek response
  if (data !== null) {
    responseBody.data = data;
  }

  return res.status(statusCode).json(responseBody);
}
