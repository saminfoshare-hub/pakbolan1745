"use client";
import { useState } from "react";

export default function EmployerForm() {
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
      const res = await fetch("/api/employer-inquiry", {
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
        <h3>Request Received</h3>
        <p>Thank you — our recruitment team will review your manpower request and get in touch shortly.</p>
        <button className="btn btn-outline-navy" style={{ marginTop: 22 }} onClick={() => setDone(false)}>
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={onSubmit}>
      <div className="form-grid">
        <div className="field"><label>Company Name <span className="req">*</span></label><input type="text" name="companyName" required /></div>
        <div className="field"><label>Contact Person <span className="req">*</span></label><input type="text" name="contactPerson" required /></div>
        <div className="field"><label>Email <span className="req">*</span></label><input type="email" name="email" required /></div>
        <div className="field"><label>Phone <span className="req">*</span></label><input type="tel" name="phone" required /></div>
        <div className="field"><label>Country</label><input type="text" name="country" /></div>
        <div className="field"><label>Required Profession</label><input type="text" name="profession" /></div>
        <div className="field"><label>Number of Workers</label><input type="number" name="workers" min={1} /></div>
        <div className="field"><label>Required Qualification</label><input type="text" name="qualification" /></div>
        <div className="field"><label>Experience Required</label><input type="text" name="experience" /></div>
        <div className="field"><label>Salary</label><input type="text" name="salary" /></div>
        <div className="field full"><label>Benefits</label><input type="text" name="benefits" /></div>
        <div className="field full"><label>Additional Requirements</label><textarea name="notes" /></div>
      </div>
      {error && <p className="form-note" style={{ color: "var(--red)" }}><i className="fa-solid fa-triangle-exclamation" /> {error}</p>}
      <button type="submit" className="btn btn-navy btn-block" style={{ marginTop: 20 }} disabled={submitting}>
        <i className="fa-solid fa-paper-plane" /> {submitting ? "Submitting…" : "Submit Manpower Request"}
      </button>
      <p className="form-note"><i className="fa-solid fa-circle-info" /> We'll email your request to our recruitment team and follow up directly.</p>
    </form>
  );
}
