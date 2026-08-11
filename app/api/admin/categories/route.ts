import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase.from("job_categories").select("*").order("sort_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 401 });
  return NextResponse.json({ categories: data });
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  const { data, error } = await supabase.from("job_categories").insert({ name }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ category: data });
}

export async function DELETE(req: NextRequest) {
  const supabase = createClient();
  const { id } = await req.json();
  const { error } = await supabase.from("job_categories").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
