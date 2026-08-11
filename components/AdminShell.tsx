import AdminNav from "@/components/AdminNav";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell-min" style={{ display: "flex", minHeight: "100vh" }}>
      <AdminNav />
      <main style={{ flex: 1, padding: "28px 32px", overflowX: "auto" }}>{children}</main>
    </div>
  );
}
