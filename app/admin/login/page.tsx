"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Incorrect email or password.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--navy)",
      }}
    >
      <div className="card-white" style={{ padding: 40, width: 380, maxWidth: "92vw" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div className="logo-mark" style={{ margin: "0 auto 12px", color: "var(--navy)", borderColor: "var(--navy)" }}>
            PB
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", color: "var(--navy)" }}>Admin Login</h2>
          <p style={{ color: "var(--gray)", fontSize: ".85rem" }}>PAK BOLAN INTERNATIONAL</p>
        </div>
        <form onSubmit={onSubmit}>
          <div className="field" style={{ marginBottom: 14 }}>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" required />
          </div>
          <div className="field" style={{ marginBottom: 6 }}>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="off" required />
          </div>
          {error && <div style={{ color: "var(--red)", fontSize: ".8rem", marginBottom: 10 }}>{error}</div>}
          <button className="btn btn-gold btn-block" style={{ marginTop: 14 }} disabled={loading}>
            {loading ? "Signing in…" : "Log In"}
          </button>
        </form>
        <a href="/" className="btn btn-outline-navy btn-block" style={{ marginTop: 10 }}>
          <i className="fa-solid fa-arrow-left" /> Back to Website
        </a>
        <p style={{ fontSize: ".72rem", color: "var(--gray)", marginTop: 16, textAlign: "center" }}>
          Admin accounts are created in the Supabase Dashboard — see the project README.
        </p>
      </div>
    </div>
  );
}
