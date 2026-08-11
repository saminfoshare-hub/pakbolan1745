import { Resend } from "resend";

const NOTIFY_TO = process.env.NOTIFY_EMAIL || "almirahmed638@gmail.com";
const FROM = process.env.EMAIL_FROM || "PAK BOLAN INTERNATIONAL <notifications@yourdomain.com>";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

async function send(subject: string, html: string) {
  const resend = getResend();
  if (!resend) {
    // Not configured yet — don't crash the request, just skip silently.
    // (Form submissions still save to the database either way.)
    console.warn("RESEND_API_KEY not set — skipping email send:", subject);
    return { skipped: true };
  }
  try {
    return await resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      subject,
      html,
    });
  } catch (err) {
    console.error("Email send failed:", err);
    return { error: true };
  }
}

export async function sendApplicationEmail(a: {
  reference: string;
  full_name: string;
  mobile: string;
  email?: string | null;
  profession: string;
  preferred_country?: string | null;
}) {
  return send(
    `New Application: ${a.full_name} (${a.reference})`,
    `<h2>New Candidate Application</h2>
     <p><b>Reference:</b> ${a.reference}</p>
     <p><b>Name:</b> ${a.full_name}</p>
     <p><b>Mobile:</b> ${a.mobile}</p>
     <p><b>Email:</b> ${a.email || "—"}</p>
     <p><b>Profession:</b> ${a.profession}</p>
     <p><b>Preferred Country:</b> ${a.preferred_country || "—"}</p>
     <p>View full details and documents in the admin dashboard.</p>`
  );
}

export async function sendEmployerInquiryEmail(e: {
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  profession?: string | null;
  workers?: number | null;
}) {
  return send(
    `New Employer Inquiry: ${e.company_name}`,
    `<h2>New Employer Manpower Request</h2>
     <p><b>Company:</b> ${e.company_name}</p>
     <p><b>Contact Person:</b> ${e.contact_person}</p>
     <p><b>Email:</b> ${e.email}</p>
     <p><b>Phone:</b> ${e.phone}</p>
     <p><b>Profession Needed:</b> ${e.profession || "—"}</p>
     <p><b>Number of Workers:</b> ${e.workers ?? "—"}</p>
     <p>View full details in the admin dashboard.</p>`
  );
}

export async function sendContactMessageEmail(c: {
  name: string;
  phone: string;
  email: string;
  message: string;
}) {
  return send(
    `New Contact Message from ${c.name}`,
    `<h2>New Contact Form Message</h2>
     <p><b>Name:</b> ${c.name}</p>
     <p><b>Phone:</b> ${c.phone}</p>
     <p><b>Email:</b> ${c.email}</p>
     <p><b>Message:</b><br>${c.message.replace(/\n/g, "<br>")}</p>`
  );
}
