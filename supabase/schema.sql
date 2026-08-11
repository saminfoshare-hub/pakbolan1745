-- =========================================================================
-- PAK BOLAN INTERNATIONAL — Database Schema
-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query)
-- =========================================================================

-- ---------- extensions ----------
create extension if not exists "pgcrypto";

-- ---------- countries ----------
create table if not exists countries (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- job categories ----------
create table if not exists job_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- vacancies ----------
create table if not exists vacancies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  employer text,
  country text,
  category text,
  positions int default 1,
  salary text,
  currency text,
  accommodation text,
  food text,
  transportation text,
  duration text,
  experience text,
  qualification text,
  age text,
  gender text,
  deadline date,
  description text,
  requirements text,
  benefits text,
  status text not null default 'published' check (status in ('published','unpublished')),
  featured boolean not null default false,
  urgent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- applications (candidates) ----------
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null default ('PB-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  -- personal
  full_name text not null,
  father_name text,
  dob date,
  cnic text,
  gender text,
  marital_status text,
  nationality text default 'Pakistani',
  city text,
  province text,
  mobile text not null,
  whatsapp text,
  email text,
  -- professional
  profession text not null,
  job_category text,
  qualification text,
  total_experience text,
  overseas_experience text,
  current_employer text,
  current_job_title text,
  preferred_country text,
  preferred_job text,
  expected_salary text,
  -- optionally linked to a specific vacancy
  vacancy_id uuid references vacancies(id) on delete set null,
  -- documents (storage object paths, not public URLs)
  cv_path text,
  passport_path text,
  cnic_file_path text,
  photo_path text,
  other_docs_paths text[],
  -- admin workflow
  status text not null default 'New' check (status in ('New','Under Review','Shortlisted','Interview','Selected','Rejected')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- employer inquiries ----------
create table if not exists employer_inquiries (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_person text not null,
  email text not null,
  phone text not null,
  country text,
  profession text,
  workers int,
  qualification text,
  experience text,
  salary text,
  benefits text,
  notes text,
  status text not null default 'New' check (status in ('New','Contacted','In Progress','Closed')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- general contact messages ----------
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- ---------- updated_at triggers ----------
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_vacancies_updated on vacancies;
create trigger trg_vacancies_updated before update on vacancies
  for each row execute function set_updated_at();

drop trigger if exists trg_applications_updated on applications;
create trigger trg_applications_updated before update on applications
  for each row execute function set_updated_at();

drop trigger if exists trg_employer_updated on employer_inquiries;
create trigger trg_employer_updated before update on employer_inquiries
  for each row execute function set_updated_at();

-- =========================================================================
-- ROW LEVEL SECURITY
-- Public (anonymous) visitors may only: read published vacancies, read
-- countries/categories, and INSERT new applications / inquiries / messages.
-- They can never read applications, inquiries, or messages back.
-- Authenticated admins (see "Admin access" below) get full read/write.
-- =========================================================================

alter table countries enable row level security;
alter table job_categories enable row level security;
alter table vacancies enable row level security;
alter table applications enable row level security;
alter table employer_inquiries enable row level security;
alter table contact_messages enable row level security;

-- countries: public read, admin write
create policy "countries_public_read" on countries for select using (true);
create policy "countries_admin_write" on countries for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- job_categories: public read, admin write
create policy "categories_public_read" on job_categories for select using (true);
create policy "categories_admin_write" on job_categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- vacancies: public can read only published ones; admin can read/write everything
create policy "vacancies_public_read_published" on vacancies for select using (status = 'published');
create policy "vacancies_admin_all" on vacancies for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- applications: anyone can insert (apply), only admins can read/update/delete
create policy "applications_public_insert" on applications for insert with check (true);
create policy "applications_admin_read" on applications for select using (auth.role() = 'authenticated');
create policy "applications_admin_update" on applications for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "applications_admin_delete" on applications for delete using (auth.role() = 'authenticated');

-- employer_inquiries: anyone can insert, only admins can read/update/delete
create policy "employer_public_insert" on employer_inquiries for insert with check (true);
create policy "employer_admin_read" on employer_inquiries for select using (auth.role() = 'authenticated');
create policy "employer_admin_update" on employer_inquiries for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "employer_admin_delete" on employer_inquiries for delete using (auth.role() = 'authenticated');

-- contact_messages: anyone can insert, only admins can read
create policy "contact_public_insert" on contact_messages for insert with check (true);
create policy "contact_admin_read" on contact_messages for select using (auth.role() = 'authenticated');
create policy "contact_admin_delete" on contact_messages for delete using (auth.role() = 'authenticated');

-- =========================================================================
-- SEED DATA — starter countries, categories, and sample vacancies
-- Safe to skip/edit before running.
-- =========================================================================
insert into countries (name, sort_order) values
  ('Saudi Arabia',1),('UAE',2),('Qatar',3),('Oman',4),('Bahrain',5),('Kuwait',6)
on conflict (name) do nothing;

insert into job_categories (name, sort_order) values
  ('Electricians',1),('Heavy Drivers',2),('Healthcare Professionals',3),
  ('Construction Workers',4),('Hospitality Workers',5),('Security Staff',6),
  ('Technicians',7),('Engineers',8)
on conflict (name) do nothing;

insert into vacancies (title, employer, country, category, positions, salary, currency, accommodation, food, transportation, duration, experience, qualification, age, gender, deadline, description, requirements, benefits, status, featured, urgent)
values
  ('Site Electrician','Al Fahad Construction Co.','Saudi Arabia','Electricians',15,'1800-2200','SAR','Provided','Provided','Provided','2 Years (Renewable)','3+ years','Diploma in Electrical','22-40','Male', current_date + 18, 'Install, maintain and repair electrical systems on large construction sites.', 'Valid trade certificate, safety training preferred.', 'Free accommodation, food, transport, medical.', 'published', true, false),
  ('Heavy Duty Driver','Gulf Logistics LLC','UAE','Heavy Drivers',10,'1600-1900','AED','Provided','Not Provided','Provided','2 Years','5+ years','Heavy Vehicle License','25-45','Male', current_date + 6, 'Operate heavy trucks for logistics and material transport across UAE.', 'Valid heavy license, clean driving record.', 'Accommodation, transport, annual leave.', 'published', false, true),
  ('Registered Nurse','Al Noor Medical Group','Qatar','Healthcare Professionals',8,'4500-5200','QAR','Provided','Not Provided','Provided','3 Years','2+ years','BSN / Nursing Diploma','23-40','', current_date + 30, 'Provide patient care in a modern private hospital setting.', 'Valid nursing license, Prometric preferred.', 'Accommodation, transport, health insurance.', 'published', true, false)
on conflict do nothing;

-- =========================================================================
-- STORAGE — candidate documents bucket
-- Run this section too (or create the bucket manually in Storage → New bucket,
-- name: "candidate-documents", set it PRIVATE — not public).
-- =========================================================================
insert into storage.buckets (id, name, public)
values ('candidate-documents', 'candidate-documents', false)
on conflict (id) do nothing;

-- Anyone can upload (candidates submitting the form), nobody can list/read
-- back except admins. Files are fetched server-side via signed URLs only.
create policy "candidate_docs_public_insert" on storage.objects
  for insert with check (bucket_id = 'candidate-documents');

create policy "candidate_docs_admin_read" on storage.objects
  for select using (bucket_id = 'candidate-documents' and auth.role() = 'authenticated');

create policy "candidate_docs_admin_delete" on storage.objects
  for delete using (bucket_id = 'candidate-documents' and auth.role() = 'authenticated');

-- =========================================================================
-- ADMIN ACCESS
-- This project uses Supabase Auth. Create your admin user from the
-- Supabase Dashboard → Authentication → Users → Add User (set an email +
-- password). Any authenticated user can access the admin dashboard, so
-- only create accounts for people who should have admin access. There is
-- no separate "admin" role/table — auth.role() = 'authenticated' is the gate.
-- =========================================================================
