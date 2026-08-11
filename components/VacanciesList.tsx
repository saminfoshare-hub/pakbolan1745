"use client";
import { useMemo, useState } from "react";
import type { Vacancy } from "@/lib/types";

function daysLeft(deadline: string | null) {
  if (!deadline) return null;
  const diff = (new Date(deadline).getTime() - Date.now()) / 86400000;
  return Math.ceil(diff);
}

export default function VacanciesList({ vacancies }: { vacancies: Vacancy[] }) {
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("");

  const countries = useMemo(
    () => Array.from(new Set(vacancies.map((v) => v.country).filter(Boolean))) as string[],
    [vacancies]
  );

  const filtered = vacancies.filter((v) => {
    const matchesQ =
      !q ||
      v.title.toLowerCase().includes(q.toLowerCase()) ||
      (v.category || "").toLowerCase().includes(q.toLowerCase());
    const matchesCountry = !country || v.country === country;
    return matchesQ && matchesCountry;
  });

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
        <input
          type="text"
          placeholder="Search by title or category…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            flex: "1 1 240px",
            border: "1px solid var(--border)",
            borderRadius: 5,
            padding: "10px 12px",
            fontSize: ".85rem",
          }}
        />
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          style={{ border: "1px solid var(--border)", borderRadius: 5, padding: "10px 12px", fontSize: ".85rem" }}
        >
          <option value="">All Countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-row">No open vacancies match your search right now.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {filtered.map((v) => {
            const dl = daysLeft(v.deadline);
            return (
              <div key={v.id} className="card-white" style={{ padding: 22 }}>
                <div className="badge-row" style={{ marginBottom: 10 }}>
                  {v.featured && <span className="mini-tag featured"><i className="fa-solid fa-star" /> Featured</span>}
                  {v.urgent && <span className="mini-tag urgent"><i className="fa-solid fa-bolt" /> Urgent</span>}
                  {dl !== null && dl <= 7 && dl >= 0 && (
                    <span className="mini-tag closing"><i className="fa-solid fa-clock" /> Closing Soon</span>
                  )}
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", fontSize: "1.2rem", marginBottom: 6 }}>
                  {v.title}
                </h3>
                <p style={{ color: "var(--gray)", fontSize: ".85rem", marginBottom: 12 }}>
                  {v.employer} · {v.country}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", fontSize: ".78rem", color: "var(--gray)", marginBottom: 16 }}>
                  <span><i className="fa-solid fa-users" /> {v.positions} positions</span>
                  <span><i className="fa-solid fa-sack-dollar" /> {v.salary} {v.currency}</span>
                  {v.experience && <span><i className="fa-solid fa-briefcase" /> {v.experience}</span>}
                </div>
                <a href="#apply" className="btn btn-outline-navy btn-sm btn-block">
                  Apply Now
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
