import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Requires the caller to be logged in (RLS on storage.objects enforces this
// for the underlying read), then mints a short-lived signed URL so the
// browser can open/download the private file directly from Supabase.
export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const path = req.nextUrl.searchParams.get("path");
  if (!path) return NextResponse.json({ error: "Missing path." }, { status: 400 });

  const { data, error } = await supabase.storage.from("candidate-documents").createSignedUrl(path, 60 * 10);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ url: data.signedUrl });
}
