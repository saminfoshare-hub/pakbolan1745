import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendApplicationEmail } from "@/lib/email";

const MAX_CV_MB = 5;
const MAX_PHOTO_MB = 2;

async function uploadFile(
  supabase: ReturnType<typeof createServiceClient>,
  file: File | null,
  folder: string,
  maxMb: number
) {
  if (!file || file.size === 0) return null;
  if (file.size > maxMb * 1024 * 1024) {
    throw new Error(`${file.name} is larger than ${maxMb}MB.`);
  }
  const ext = file.name.split(".").pop();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from("candidate-documents").upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return path;
}

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();
    const supabase = createServiceClient();

    const fullName = String(fd.get("fullName") || "").trim();
    const mobile = String(fd.get("mobile") || "").trim();
    const profession = String(fd.get("profession") || "").trim();
    const cvFile = fd.get("cv") as File | null;

    if (!fullName || !mobile || !profession || !cvFile || cvFile.size === 0) {
      return NextResponse.json(
        { error: "Full Name, Mobile Number, Profession, and CV are required." },
        { status: 400 }
      );
    }

    const cvPath = await uploadFile(supabase, cvFile, "cv", MAX_CV_MB);
    const passportPath = await uploadFile(supabase, fd.get("passport") as File | null, "passport", MAX_CV_MB);
    const cnicFilePath = await uploadFile(supabase, fd.get("cnicFile") as File | null, "cnic", MAX_CV_MB);
    const photoPath = await uploadFile(supabase, fd.get("photo") as File | null, "photo", MAX_PHOTO_MB);

    const otherDocs = fd.getAll("otherDocs") as File[];
    const otherDocsPaths: string[] = [];
    for (const f of otherDocs) {
      if (f && f.size > 0) {
        const p = await uploadFile(supabase, f, "other", MAX_CV_MB);
        if (p) otherDocsPaths.push(p);
      }
    }

    const row = {
      full_name: fullName,
      father_name: fd.get("fatherName") || null,
      dob: fd.get("dob") || null,
      cnic: fd.get("cnic") || null,
      gender: fd.get("gender") || null,
      marital_status: fd.get("maritalStatus") || null,
      nationality: fd.get("nationality") || "Pakistani",
      city: fd.get("city") || null,
      province: fd.get("province") || null,
      mobile,
      whatsapp: fd.get("whatsapp") || null,
      email: fd.get("email") || null,
      profession,
      job_category: fd.get("jobCategory") || null,
      qualification: fd.get("qualification") || null,
      total_experience: fd.get("totalExperience") || null,
      overseas_experience: fd.get("overseasExperience") || null,
      current_employer: fd.get("currentEmployer") || null,
      current_job_title: fd.get("currentJobTitle") || null,
      preferred_country: fd.get("preferredCountry") || null,
      preferred_job: fd.get("preferredJob") || null,
      expected_salary: fd.get("expectedSalary") || null,
      cv_path: cvPath,
      passport_path: passportPath,
      cnic_file_path: cnicFilePath,
      photo_path: photoPath,
      other_docs_paths: otherDocsPaths.length ? otherDocsPaths : null,
    };

    const { data, error } = await supabase.from("applications").insert(row).select("reference").single();
    if (error) throw new Error(error.message);

    await sendApplicationEmail({
      reference: data.reference,
      full_name: fullName,
      mobile,
      email: row.email as string | null,
      profession,
      preferred_country: row.preferred_country as string | null,
    });

    return NextResponse.json({ ok: true, reference: data.reference });
  } catch (err: any) {
    console.error("apply error:", err);
    return NextResponse.json({ error: err.message || "Submission failed." }, { status: 500 });
  }
}
