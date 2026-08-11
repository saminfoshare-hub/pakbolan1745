import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/AdminShell";

export const revalidate = 0;

export default async function AdminDashboard() {
  const supabase = createClient();

  const [{ count: totalVac }, { count: publishedVac }, { count: totalApps }, { count: newApps }, { count: totalInquiries }] =
    await Promise.all([
      supabase.from("vacancies").select("*", { count: "exact", head: true }),
      supabase.from("vacancies").select("*", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("applications").select("*", { count: "exact", head: true }),
      supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "New"),
      supabase.from("employer_inquiries").select("*", { count: "exact", head: true }),
    ]);

  const cards = [
    { label: "Published Vacancies", value: publishedVac ?? 0 },
    { label: "Total Vacancies", value: totalVac ?? 0 },
    { label: "New Applications", value: newApps ?? 0 },
    { label: "Total Applications", value: totalApps ?? 0 },
    { label: "Employer Inquiries", value: totalInquiries ?? 0 },
  ];

  return (
    <AdminShell>
      <h2 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", marginBottom: 20 }}>Dashboard</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        {cards.map((c) => (
          <div key={c.label} className="card-white" style={{ padding: 20 }}>
            <b style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--navy)", display: "block" }}>{c.value}</b>
            <span style={{ color: "var(--gray)", fontSize: ".82rem" }}>{c.label}</span>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
