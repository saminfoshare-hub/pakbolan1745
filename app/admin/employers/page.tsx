"use client";
import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import type { EmployerInquiry } from "@/lib/types";

const STATUS_FLOW = ["New", "Contacted", "In Progress", "Closed"];

export default function AdminEmployersPage() {
  const [inquiries, setInquiries] = useState<EmployerInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<EmployerInquiry | null>(null);
  const [notes, setNotes] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/employer-inquiries");
    const json = await res.json();
    setInquiries(json.inquiries || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(e: EmployerInquiry, status: string) {
    const res = await fetch(`/api/admin/employer-inquiries/${e.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) load();
  }

  async function saveNotes() {
    if (!selected) return;
    const res = await fetch(`/api/admin/employer-inquiries/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_notes: notes }),
    });
    if (res.ok) load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this inquiry? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/employer-inquiries/${id}`, { method: "DELETE" });
    if (res.ok) { load(); setSelected(null); }
  }

  return (
    <AdminShell>
      <h2 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", marginBottom: 16 }}>Employer Inquiries</h2>

      {loading ? (
        <div className="loading-row">Loading…</div>
      ) : inquiries.length === 0 ? (
        <div className="empty-row">No employer inquiries yet.</div>
      ) : (
        <div className="card-white" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".82rem" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
                <th style={{ padding: 10 }}>Company</th>
                <th style={{ padding: 10 }}>Contact</th>
                <th style={{ padding: 10 }}>Profession</th>
                <th style={{ padding: 10 }}>Workers</th>
                <th style={{ padding: 10 }}>Status</th>
                <th style={{ padding: 10 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((e) => (
                <tr key={e.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: 10 }}>{e.company_name}</td>
                  <td style={{ padding: 10 }}>{e.contact_person}<br /><span style={{ color: "var(--gray)", fontSize: ".72rem" }}>{e.phone}</span></td>
                  <td style={{ padding: 10 }}>{e.profession || "—"}</td>
                  <td style={{ padding: 10 }}>{e.workers ?? "—"}</td>
                  <td style={{ padding: 10 }}>
                    <select value={e.status} onChange={(ev) => updateStatus(e, ev.target.value)} style={{ fontSize: ".75rem", padding: "3px 6px" }}>
                      {STATUS_FLOW.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: 10 }}>
                    <div className="table-actions">
                      <button className="btn btn-outline-navy btn-sm" onClick={() => { setSelected(e); setNotes(e.admin_notes || ""); }}>View</button>
                      <button className="btn btn-outline-navy btn-sm" style={{ color: "var(--red)" }} onClick={() => remove(e.id)}>Delete</button>
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
          <div className="modal-box" style={{ maxWidth: 520, maxHeight: "88vh", overflowY: "auto" }}>
            <button className="modal-close" onClick={() => setSelected(null)}><i className="fa-solid fa-xmark" /></button>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", marginBottom: 18 }}>{selected.company_name}</h3>
            <div style={{ display: "grid", gap: 6, fontSize: ".85rem", marginBottom: 18 }}>
              <div><b>Contact Person:</b> {selected.contact_person}</div>
              <div><b>Email:</b> {selected.email}</div>
              <div><b>Phone:</b> {selected.phone}</div>
              <div><b>Country:</b> {selected.country || "—"}</div>
              <div><b>Profession Needed:</b> {selected.profession || "—"}</div>
              <div><b>Workers:</b> {selected.workers ?? "—"}</div>
              <div><b>Qualification:</b> {selected.qualification || "—"}</div>
              <div><b>Experience:</b> {selected.experience || "—"}</div>
              <div><b>Salary:</b> {selected.salary || "—"}</div>
              <div><b>Benefits:</b> {selected.benefits || "—"}</div>
              <div><b>Notes:</b> {selected.notes || "—"}</div>
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
