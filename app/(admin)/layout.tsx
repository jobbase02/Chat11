// app/(admin)/admin/layout.tsx
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#050505] min-h-screen text-[#FAFAFA] font-sans">
      {children}
    </div>
  );
}