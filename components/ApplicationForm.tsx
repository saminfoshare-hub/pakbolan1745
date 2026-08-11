"use client";
import { useState } from "react";
import type { Country, JobCategory } from "@/lib/types";

export default function ApplicationForm({
  countries,
  categories,
}: {
  countries: Country[];
  categories: JobCategory[];
}) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null); // holds reference # on success
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      const res = await fetch("/api/apply", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      setDone(json.reference);
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
        <h3>Application Received</h3>
        <p>
          Thank you for submitting your application. Your reference number is{" "}
          <b>{done}</b>. Our recruitment team will review your information and contact you if your
          profile matches an available opportunity.
        </p>
        <button className="btn btn-outline-navy" style={{ marginTop: 22 }} onClick={() => setDone(null)}>
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={onSubmit}>
      <div className="form-section-label">Personal Information</div>
      <div className="form-grid">
        <div className="field"><label>Full Name <span className="req">*</span></label><input type="text" name="fullName" required /></div>
        <div className="field"><label>Father / Husband Name</label><input type="text" name="fatherName" /></div>
        <div className="field"><label>Date of Birth</label><input type="date" name="dob" /></div>
        <div className="field"><label>CNIC Number</label><input type="text" name="cnic" placeholder="00000-0000000-0" /></div>
        <div className="field"><label>Gender</label>
          <select name="gender" defaultValue=""><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select>
        </div>
        <div className="field"><label>Marital Status</label>
          <select name="maritalStatus" defaultValue=""><option value="">Select</option><option>Single</option><option>Married</option></select>
        </div>
        <div className="field"><label>Nationality</label><input type="text" name="nationality" defaultValue="Pakistani" /></div>
        <div className="field"><label>City</label><input type="text" name="city" /></div>
        <div className="field"><label>Province</label>
          <select name="province" defaultValue="">
            <option value="">Select</option>
            <option>Punjab</option><option>Sindh</option><option>Khyber Pakhtunkhwa</option>
            <option>Balochistan</option><option>Gilgit-Baltistan</option><option>Azad Kashmir</option>
            <option>Islamabad Capital Territory</option>
          </select>
        </div>
        <div className="field"><label>Mobile Number <span className="req">*</span></label><input type="tel" name="mobile" placeholder="03XXXXXXXXX" required /></div>
        <div className="field"><label>WhatsApp Number</label><input type="tel" name="whatsapp" placeholder="03XXXXXXXXX" /></div>
        <div className="field"><label>Email Address</label><input type="email" name="email" /></div>
      </div>

      <div className="form-section-label">Professional Information</div>
      <div className="form-grid">
        <div className="field"><label>Profession <span className="req">*</span></label><input type="text" name="profession" required /></div>
        <div className="field"><label>Job Category</label>
          <select name="jobCategory" defaultValue="">
            <option value="">Select</option>
            {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <div className="field"><label>Qualification</label><input type="text" name="qualification" /></div>
        <div className="field"><label>Total Experience</label><input type="text" name="totalExperience" placeholder="e.g. 5 years" /></div>
        <div className="field"><label>Overseas Experience</label><input type="text" name="overseasExperience" /></div>
        <div className="field"><label>Current Employer</label><input type="text" name="currentEmployer" /></div>
        <div className="field"><label>Current Job Title</label><input type="text" name="currentJobTitle" /></div>
        <div className="field"><label>Preferred Country</label>
          <select name="preferredCountry" defaultValue="">
            <option value="">Select</option>
            {countries.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <div className="field"><label>Preferred Job</label><input type="text" name="preferredJob" /></div>
        <div className="field"><label>Expected Salary</label><input type="text" name="expectedSalary" /></div>
      </div>

      <div className="form-section-label">Documents</div>
      <div className="form-grid">
        <div className="field"><label>CV / Resume <span className="req">*</span></label>
          <div className="file-field"><i className="fa-solid fa-file-arrow-up" /><span className="file-label">PDF/DOC, max 5MB</span>
            <input type="file" name="cv" accept=".pdf,.doc,.docx" required /></div>
        </div>
        <div className="field"><label>Passport (if available)</label>
          <div className="file-field"><i className="fa-solid fa-file-arrow-up" /><span className="file-label">PDF/JPG, max 5MB</span>
            <input type="file" name="passport" accept=".pdf,.jpg,.jpeg,.png" /></div>
        </div>
        <div className="field"><label>CNIC (optional)</label>
          <div className="file-field"><i className="fa-solid fa-file-arrow-up" /><span className="file-label">PDF/JPG, max 5MB</span>
            <input type="file" name="cnicFile" accept=".pdf,.jpg,.jpeg,.png" /></div>
        </div>
        <div className="field"><label>Photograph (optional)</label>
          <div className="file-field"><i className="fa-solid fa-image" /><span className="file-label">JPG/PNG, max 2MB</span>
            <input type="file" name="photo" accept=".jpg,.jpeg,.png" /></div>
        </div>
        <div className="field full"><label>Other Documents</label>
          <div className="file-field"><i className="fa-solid fa-paperclip" /><span className="file-label">Optional — certificates, experience letters</span>
            <input type="file" name="otherDocs" multiple /></div>
        </div>
      </div>

      {error && <p className="form-note" style={{ color: "var(--red)" }}><i className="fa-solid fa-triangle-exclamation" /> {error}</p>}

      <button type="submit" className="btn btn-gold btn-block" style={{ marginTop: 22 }} disabled={submitting}>
        <i className="fa-solid fa-paper-plane" /> {submitting ? "Submitting…" : "Submit Application"}
      </button>
      <p className="form-note"><i className="fa-solid fa-circle-info" /> Only Full Name, Mobile Number, Profession, and CV are required — everything else is optional and can be added later.</p>
      <p className="form-note"><i className="fa-solid fa-shield-halved" /> Your documents are uploaded securely and are only visible to our recruitment team.</p>
    </form>
  );
}
