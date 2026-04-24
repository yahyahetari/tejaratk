export default function MarketingLayout({ children }) {
  return (
    <div data-theme="dark" className="min-h-screen bg-brand-950 text-white selection:bg-brand-500/30">
      {children}
    </div>
  );
}
