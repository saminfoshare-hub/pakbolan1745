"use client";
import { useState } from "react";

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      const payload = Object.fromEntries(fd.entries());
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      setDone(true);
      e.currentTarget.reset();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="success-box">
        <i className="fa-solid fa-circle-check" />
        <h3>Message Sent</h3>
        <p>Thanks for reaching out — we'll get back to you shortly.</p>
        <button className="btn btn-outline-navy" style={{ marginTop: 22 }} onClick={() => setDone(false)}>
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={onSubmit} data-aos>
      <div className="form-grid">
        <div className="field"><label>Full Name <span className="req">*</span></label><input type="text" name="name" required /></div>
        <div className="field"><label>Phone <span className="req">*</span></label><input type="tel" name="phone" required /></div>
        <div className="field full"><label>Email <span className="req">*</span></label><input type="email" name="email" required /></div>
        <div className="field full"><label>Message <span className="req">*</span></label><textarea name="message" required /></div>
      </div>
      {error && <p className="form-note" style={{ color: "var(--red)" }}><i className="fa-solid fa-triangle-exclamation" /> {error}</p>}
      <button type="submit" className="btn btn-navy btn-block" style={{ marginTop: 18 }} disabled={submitting}>
        <i className="fa-solid fa-paper-plane" /> {submitting ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
