import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// All admin routes rely on the user's session (not the service client), so
// Row Level Security naturally blocks anyone who isn't logged in — the
// middleware also redirects unauthenticated page loads before this runs.

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase.from("vacancies").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 401 });
  return NextResponse.json({ vacancies: data });
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const body = await req.json();
  const { data, error } = await supabase.from("vacancies").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ vacancy: data });
}
