export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <main className="container py-8">
        <div className="card p-6">{children}</div>
      </main>
    </div>
  );
}
