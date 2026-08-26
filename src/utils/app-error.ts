export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message); // panggil constructor Error bawaan, isi message-nya
    this.statusCode = statusCode;
    this.name = "AppError"; // biar kelihatan beda dari Error biasa kalau di-log
  }
}
