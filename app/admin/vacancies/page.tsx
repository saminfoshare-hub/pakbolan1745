"use client";
import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import type { Vacancy } from "@/lib/types";

const emptyForm: Partial<Vacancy> = {
  title: "", employer: "", country: "", category: "", positions: 1, salary: "", currency: "",
  accommodation: "", food: "", transportation: "", duration: "", experience: "", qualification: "",
  age: "", gender: "", deadline: "", description: "", requirements: "", benefits: "",
  status: "published", featured: false, urgent: false,
};

export default function AdminVacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Partial<Vacancy> | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/vacancies");
    const json = await res.json();
    setVacancies(json.vacancies || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing) return;
    setSaving(true);
    const isNew = !editing.id;
    const url = isNew ? "/api/admin/vacancies" : `/api/admin/vacancies/${editing.id}`;
    const method = isNew ? "POST" : "PATCH";
    const { id, created_at, updated_at, ...payload } = editing as any;
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    if (res.ok) {
      setEditing(null);
      load();
    } else {
      const json = await res.json();
      alert(json.error || "Save failed.");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this vacancy? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/vacancies/${id}`, { method: "DELETE" });
    if (res.ok) load();
  }

  async function toggleStatus(v: Vacancy) {
    const newStatus = v.status === "published" ? "unpublished" : "published";
    const res = await fetch(`/api/admin/vacancies/${v.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) load();
  }

  const filtered = vacancies.filter(
    (v) =>
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      (v.employer || "").toLowerCase().includes(search.toLowerCase()) ||
      (v.country || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell>
      <div className="admin-topbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontFamily: "var(--font-display)", color: "var(--navy)" }}>Vacancy Management</h2>
        <button className="btn btn-gold btn-sm" onClick={() => setEditing({ ...emptyForm })}>
          <i className="fa-solid fa-plus" /> Add Vacancy
        </button>
      </div>

      <input
        type="text"
        placeholder="Search vacancies…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ minWidth: 240, marginBottom: 14, border: "1px solid var(--border)", borderRadius: 5, padding: "8px 10px", fontSize: ".82rem" }}
      />

      {loading ? (
        <div className="loading-row">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-row">No vacancies found.</div>
      ) : (
        <div className="card-white" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".82rem" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
                <th style={{ padding: 10 }}>Title</th>
                <th style={{ padding: 10 }}>Country</th>
                <th style={{ padding: 10 }}>Positions</th>
                <th style={{ padding: 10 }}>Status</th>
                <th style={{ padding: 10 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: 10 }}>
                    {v.title}
                    <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                      {v.featured && <span className="mini-tag featured">Featured</span>}
                      {v.urgent && <span className="mini-tag urgent">Urgent</span>}
                    </div>
                  </td>
                  <td style={{ padding: 10 }}>{v.country}</td>
                  <td style={{ padding: 10 }}>{v.positions}</td>
                  <td style={{ padding: 10 }}>
                    <span className={`status-pill ${v.status}`} style={{ padding: "3px 8px", borderRadius: 4, fontSize: ".72rem" }}>
                      {v.status}
                    </span>
                  </td>
                  <td style={{ padding: 10 }}>
                    <div className="table-actions">
                      <button className="btn btn-outline-navy btn-sm" onClick={() => setEditing(v)}>Edit</button>
                      <button className="btn btn-outline-navy btn-sm" onClick={() => toggleStatus(v)}>
                        {v.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      <button className="btn btn-outline-navy btn-sm" style={{ color: "var(--red)" }} onClick={() => remove(v.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="modal-overlay" style={{ display: "flex" }}>
          <div className="modal-box wide" style={{ maxWidth: 720, maxHeight: "88vh", overflowY: "auto" }}>
            <button className="modal-close" onClick={() => setEditing(null)}><i className="fa-solid fa-xmark" /></button>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", marginBottom: 20 }}>
              {editing.id ? "Edit Vacancy" : "Add Vacancy"}
            </h3>
            <div className="form-grid">
              <div className="field"><label>Title</label><input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
              <div className="field"><label>Employer</label><input value={editing.employer || ""} onChange={(e) => setEditing({ ...editing, employer: e.target.value })} /></div>
              <div className="field"><label>Country</label><input value={editing.country || ""} onChange={(e) => setEditing({ ...editing, country: e.target.value })} /></div>
              <div className="field"><label>Category</label><input value={editing.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></div>
              <div className="field"><label>Positions</label><input type="number" value={editing.positions || 1} onChange={(e) => setEditing({ ...editing, positions: parseInt(e.target.value) || 1 })} /></div>
              <div className="field"><label>Salary</label><input value={editing.salary || ""} onChange={(e) => setEditing({ ...editing, salary: e.target.value })} /></div>
              <div className="field"><label>Currency</label><input value={editing.currency || ""} onChange={(e) => setEditing({ ...editing, currency: e.target.value })} /></div>
              <div className="field"><label>Duration</label><input value={editing.duration || ""} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} /></div>
              <div className="field"><label>Experience</label><input value={editing.experience || ""} onChange={(e) => setEditing({ ...editing, experience: e.target.value })} /></div>
              <div className="field"><label>Qualification</label><input value={editing.qualification || ""} onChange={(e) => setEditing({ ...editing, qualification: e.target.value })} /></div>
              <div className="field"><label>Age</label><input value={editing.age || ""} onChange={(e) => setEditing({ ...editing, age: e.target.value })} /></div>
              <div className="field"><label>Gender</label><input value={editing.gender || ""} onChange={(e) => setEditing({ ...editing, gender: e.target.value })} /></div>
              <div className="field"><label>Deadline</label><input type="date" value={editing.deadline || ""} onChange={(e) => setEditing({ ...editing, deadline: e.target.value })} /></div>
              <div className="field"><label>Accommodation</label><input value={editing.accommodation || ""} onChange={(e) => setEditing({ ...editing, accommodation: e.target.value })} /></div>
              <div className="field"><label>Food</label><input value={editing.food || ""} onChange={(e) => setEditing({ ...editing, food: e.target.value })} /></div>
              <div className="field"><label>Transportation</label><input value={editing.transportation || ""} onChange={(e) => setEditing({ ...editing, transportation: e.target.value })} /></div>
              <div className="field full"><label>Description</label><textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
              <div className="field full"><label>Requirements</label><textarea value={editing.requirements || ""} onChange={(e) => setEditing({ ...editing, requirements: e.target.value })} /></div>
              <div className="field full"><label>Benefits</label><textarea value={editing.benefits || ""} onChange={(e) => setEditing({ ...editing, benefits: e.target.value })} /></div>
              <div className="field">
                <label>Status</label>
                <select value={editing.status || "published"} onChange={(e) => setEditing({ ...editing, status: e.target.value as any })}>
                  <option value="published">Published</option>
                  <option value="unpublished">Unpublished</option>
                </select>
              </div>
              <div className="field" style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 22 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} /> Featured
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input type="checkbox" checked={!!editing.urgent} onChange={(e) => setEditing({ ...editing, urgent: e.target.checked })} /> Urgent
                </label>
              </div>
            </div>
            <button className="btn btn-navy btn-block" style={{ marginTop: 20 }} onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save Vacancy"}
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
