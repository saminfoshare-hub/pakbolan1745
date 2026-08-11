"use client";
import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import type { Country, JobCategory } from "@/lib/types";

export default function AdminSettingsPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [newCountry, setNewCountry] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [cRes, catRes] = await Promise.all([fetch("/api/admin/countries"), fetch("/api/admin/categories")]);
    const c = await cRes.json();
    const cat = await catRes.json();
    setCountries(c.countries || []);
    setCategories(cat.categories || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function addCountry() {
    if (!newCountry.trim()) return;
    const res = await fetch("/api/admin/countries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCountry.trim() }),
    });
    if (res.ok) { setNewCountry(""); load(); } else { const j = await res.json(); alert(j.error); }
  }

  async function removeCountry(id: string) {
    const res = await fetch("/api/admin/countries", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) load();
  }

  async function addCategory() {
    if (!newCategory.trim()) return;
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategory.trim() }),
    });
    if (res.ok) { setNewCategory(""); load(); } else { const j = await res.json(); alert(j.error); }
  }

  async function removeCategory(id: string) {
    const res = await fetch("/api/admin/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) load();
  }

  return (
    <AdminShell>
      <h2 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", marginBottom: 20 }}>Settings</h2>
      {loading ? (
        <div className="loading-row">Loading…</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div className="card-white" style={{ padding: 20 }}>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", marginBottom: 14 }}>Countries</h3>
            <div id="adminCountryList" style={{ marginBottom: 14 }}>
              {countries.map((c) => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: ".85rem" }}>{c.name}</span>
                  <button onClick={() => removeCountry(c.id)} style={{ color: "var(--red)", fontSize: ".78rem" }}>
                    <i className="fa-solid fa-trash" />
                  </button>
                </div>
              ))}
              {countries.length === 0 && <p style={{ color: "var(--gray)", fontSize: ".82rem" }}>No countries yet.</p>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                placeholder="Country name"
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCountry()}
                style={{ flex: 1, border: "1px solid var(--border)", borderRadius: 5, padding: "8px 10px", fontSize: ".8rem" }}
              />
              <button className="btn btn-navy btn-sm" onClick={addCountry}>Add</button>
            </div>
          </div>

          <div className="card-white" style={{ padding: 20 }}>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", marginBottom: 14 }}>Job Categories</h3>
            <div id="adminCategoryList" style={{ marginBottom: 14 }}>
              {categories.map((c) => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: ".85rem" }}>{c.name}</span>
                  <button onClick={() => removeCategory(c.id)} style={{ color: "var(--red)", fontSize: ".78rem" }}>
                    <i className="fa-solid fa-trash" />
                  </button>
                </div>
              ))}
              {categories.length === 0 && <p style={{ color: "var(--gray)", fontSize: ".82rem" }}>No categories yet.</p>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                placeholder="Category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCategory()}
                style={{ flex: 1, border: "1px solid var(--border)", borderRadius: 5, padding: "8px 10px", fontSize: ".8rem" }}
              />
              <button className="btn btn-navy btn-sm" onClick={addCategory}>Add</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
