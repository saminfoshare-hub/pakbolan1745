"use client";
import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import type { Application } from "@/lib/types";

const STATUS_FLOW = ["New", "Under Review", "Shortlisted", "Interview", "Selected", "Rejected"];

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<Application | null>(null);
  const [notes, setNotes] = useState("");
  const [docUrls, setDocUrls] = useState<Record<string, string>>({});

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/applications");
    const json = await res.json();
    setApps(json.applications || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = apps.filter((a) => {
    const matchesQ =
      !search ||
      a.full_name.toLowerCase().includes(search.toLowerCase()) ||
      a.profession.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || a.status === statusFilter;
    return matchesQ && matchesStatus;
  });

  async function updateStatus(a: Application, status: string) {
    const res = await fetch(`/api/admin/applications/${a.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) load();
  }

  async function saveNotes() {
    if (!selected) return;
    const res = await fetch(`/api/admin/applications/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_notes: notes }),
    });
    if (res.ok) load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this application? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/applications/${id}`, { method: "DELETE" });
    if (res.ok) { load(); setSelected(null); }
  }

  async function openDoc(path: string | null) {
    if (!path) return;
    if (docUrls[path]) { window.open(docUrls[path], "_blank"); return; }
    const res = await fetch(`/api/admin/signed-url?path=${encodeURIComponent(path)}`);
    const json = await res.json();
    if (json.url) {
      setDocUrls((prev) => ({ ...prev, [path]: json.url }));
      window.open(json.url, "_blank");
    } else {
      alert(json.error || "Could not open document.");
    }
  }

  function exportCsv() {
    const headers = ["Reference", "Name", "Mobile", "Email", "Profession", "Preferred Country", "Status", "Submitted"];
    const rows = filtered.map((a) => [
      a.reference, a.full_name, a.mobile, a.email || "", a.profession, a.preferred_country || "", a.status,
      new Date(a.created_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "applications.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AdminShell>
      <div className="admin-topbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontFamily: "var(--font-display)", color: "var(--navy)" }}>Applications</h2>
        <button className="btn btn-outline-navy btn-sm" onClick={exportCsv}><i className="fa-solid fa-download" /> Export CSV</button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search candidate name, profession…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ minWidth: 240, border: "1px solid var(--border)", borderRadius: 5, padding: "8px 10px", fontSize: ".82rem" }}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ border: "1px solid var(--border)", borderRadius: 5, padding: "8px 10px", fontSize: ".82rem" }}>
          <option value="">All Statuses</option>
          {STATUS_FLOW.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="loading-row">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-row">No applications found.</div>
      ) : (
        <div className="card-white" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".82rem" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
                <th style={{ padding: 10 }}>Reference</th>
                <th style={{ padding: 10 }}>Name</th>
                <th style={{ padding: 10 }}>Profession</th>
                <th style={{ padding: 10 }}>Mobile</th>
                <th style={{ padding: 10 }}>Status</th>
                <th style={{ padding: 10 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: 10, fontFamily: "var(--font-mono)", fontSize: ".72rem" }}>{a.reference}</td>
                  <td style={{ padding: 10 }}>{a.full_name}</td>
                  <td style={{ padding: 10 }}>{a.profession}</td>
                  <td style={{ padding: 10 }}>{a.mobile}</td>
                  <td style={{ padding: 10 }}>
                    <select value={a.status} onChange={(e) => updateStatus(a, e.target.value)} style={{ fontSize: ".75rem", padding: "3px 6px" }}>
                      {STATUS_FLOW.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: 10 }}>
                    <div className="table-actions">
                      <button className="btn btn-outline-navy btn-sm" onClick={() => { setSelected(a); setNotes(a.admin_notes || ""); }}>View</button>
                      <button className="btn btn-outline-navy btn-sm" style={{ color: "var(--red)" }} onClick={() => remove(a.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="modal-overlay" style={{ display: "flex" }}>
          <div className="modal-box wide" style={{ maxWidth: 640, maxHeight: "88vh", overflowY: "auto" }}>
            <button className="modal-close" onClick={() => setSelected(null)}><i className="fa-solid fa-xmark" /></button>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", marginBottom: 6 }}>{selected.full_name}</h3>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: ".75rem", color: "var(--gray)", marginBottom: 18 }}>{selected.reference}</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 20px", fontSize: ".85rem", marginBottom: 18 }}>
              <div><b>Mobile:</b> {selected.mobile}</div>
              <div><b>WhatsApp:</b> {selected.whatsapp || "—"}</div>
              <div><b>Email:</b> {selected.email || "—"}</div>
              <div><b>CNIC:</b> {selected.cnic || "—"}</div>
              <div><b>City:</b> {selected.city || "—"}</div>
              <div><b>Province:</b> {selected.province || "—"}</div>
              <div><b>Profession:</b> {selected.profession}</div>
              <div><b>Category:</b> {selected.job_category || "—"}</div>
              <div><b>Qualification:</b> {selected.qualification || "—"}</div>
              <div><b>Experience:</b> {selected.total_experience || "—"}</div>
              <div><b>Preferred Country:</b> {selected.preferred_country || "—"}</div>
              <div><b>Expected Salary:</b> {selected.expected_salary || "—"}</div>
            </div>

            <div className="form-section-label">Documents</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
              {selected.cv_path && <button className="btn btn-outline-navy btn-sm" onClick={() => openDoc(selected.cv_path)}>CV</button>}
              {selected.passport_path && <button className="btn btn-outline-navy btn-sm" onClick={() => openDoc(selected.passport_path)}>Passport</button>}
              {selected.cnic_file_path && <button className="btn btn-outline-navy btn-sm" onClick={() => openDoc(selected.cnic_file_path)}>CNIC</button>}
              {selected.photo_path && <button className="btn btn-outline-navy btn-sm" onClick={() => openDoc(selected.photo_path)}>Photo</button>}
              {(selected.other_docs_paths || []).map((p, i) => (
                <button key={p} className="btn btn-outline-navy btn-sm" onClick={() => openDoc(p)}>Other {i + 1}</button>
              ))}
              {!selected.cv_path && !selected.passport_path && !selected.cnic_file_path && !selected.photo_path && (!selected.other_docs_paths || selected.other_docs_paths.length === 0) && (
                <span style={{ color: "var(--gray)", fontSize: ".82rem" }}>No documents uploaded.</span>
              )}
            </div>

            <div className="field" style={{ marginBottom: 14 }}>
              <label>Internal Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <button className="btn btn-navy btn-block" onClick={saveNotes}>Save Changes</button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
