import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendContactMessageEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, message } = body;

    if (!name || !phone || !email || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase.from("contact_messages").insert({ name, phone, email, message });
    if (error) throw new Error(error.message);

    await sendContactMessageEmail({ name, phone, email, message });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("contact error:", err);
    return NextResponse.json({ error: err.message || "Submission failed." }, { status: 500 });
  }
}
