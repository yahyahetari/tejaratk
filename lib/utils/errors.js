export class AppError extends Error {
  constructor(message, status = 400, code = "BAD_REQUEST") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function toErrorResponse(err) {
  const status = err?.status || 500;
  const code = err?.code || "INTERNAL_ERROR";
  const message = status === 500 ? "حدث خطأ غير متوقع." : err.message;
  return Response.json({ ok: false, code, message }, { status });
}
