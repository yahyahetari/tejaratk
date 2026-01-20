"use client";

export default function GlobalError({ error, reset }) {
  return (
    <main className="container py-16">
      <div className="card p-8">
        <h1 className="text-2xl font-semibold">حدث خطأ</h1>
        <p className="mt-2 text-neutral-600">{error?.message || "خطأ غير متوقع"}</p>
        <button className="mt-6 rounded-xl border px-4 py-2" onClick={reset}>
          إعادة المحاولة
        </button>
      </div>
    </main>
  );
}
