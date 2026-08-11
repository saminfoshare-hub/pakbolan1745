import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmployerInquiryEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName, contactPerson, email, phone, country, profession, workers, qualification, experience, salary, benefits, notes } = body;

    if (!companyName || !contactPerson || !email || !phone) {
      return NextResponse.json({ error: "Company Name, Contact Person, Email, and Phone are required." }, { status: 400 });
    }

    const supabase = createServiceClient();
    const row = {
      company_name: companyName,
      contact_person: contactPerson,
      email,
      phone,
      country: country || null,
      profession: profession || null,
      workers: workers ? parseInt(workers, 10) : null,
      qualification: qualification || null,
      experience: experience || null,
      salary: salary || null,
      benefits: benefits || null,
      notes: notes || null,
    };

    const { error } = await supabase.from("employer_inquiries").insert(row);
    if (error) throw new Error(error.message);

    await sendEmployerInquiryEmail({
      company_name: companyName,
      contact_person: contactPerson,
      email,
      phone,
      profession,
      workers: row.workers,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("employer-inquiry error:", err);
    return NextResponse.json({ error: err.message || "Submission failed." }, { status: 500 });
  }
}
