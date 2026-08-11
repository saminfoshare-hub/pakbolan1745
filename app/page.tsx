import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatActions from "@/components/FloatActions";
import VacanciesList from "@/components/VacanciesList";
import ApplicationForm from "@/components/ApplicationForm";
import EmployerForm from "@/components/EmployerForm";
import ContactForm from "@/components/ContactForm";
import type { Vacancy, Country, JobCategory } from "@/lib/types";

export const revalidate = 0; // always fetch fresh vacancy/candidate counts

export default async function HomePage() {
  const supabase = createClient();

  const [{ data: vacancies }, { data: countries }, { data: categories }, { count: openCount }] =
    await Promise.all([
      supabase.from("vacancies").select("*").eq("status", "published").order("created_at", { ascending: false }),
      supabase.from("countries").select("*").order("sort_order"),
      supabase.from("job_categories").select("*").order("sort_order"),
      supabase.from("vacancies").select("*", { count: "exact", head: true }).eq("status", "published"),
    ]);

  return (
    <>
      <Header />

      <section className="hero" id="home">
        <div className="container">
          <div className="eyebrow">Overseas Employment Promoters — Pakistan</div>
          <h1 style={{ fontFamily: "var(--font-display)", color: "var(--white)", fontSize: "clamp(2.2rem,5vw,3.6rem)", maxWidth: 780, lineHeight: 1.1 }}>
            Connecting Pakistani Talent with <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Global Opportunities</em>
          </h1>
          <p style={{ color: "rgba(255,255,255,.7)", maxWidth: 560, marginTop: 18, fontSize: "1.05rem" }}>
            We help skilled, semi-skilled, and professional workers find verified overseas employment — and help
            employers abroad find the right people, fast.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 30, flexWrap: "wrap" }}>
            <a href="#vacancies" className="btn btn-gold">Browse Vacancies</a>
            <a href="#apply" className="btn btn-outline">Submit Your CV</a>
          </div>
          <div className="hero-stat" style={{ marginTop: 40 }}>
            <b>{openCount ?? "—"}</b>
            <span>Open Vacancies</span>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <div className="container section-head center">
          <div className="eyebrow" style={{ justifyContent: "center" }}>About Us</div>
          <h2 className="section-title">Trusted Overseas <em>Employment Partner</em></h2>
          <p className="section-sub">
            PAK BOLAN INTERNATIONAL connects Pakistani skilled, semi-skilled and professional workers with vetted
            overseas employers, handling the process from application to placement.
          </p>
        </div>
      </section>

      <section className="vacancies" id="vacancies">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Current Openings</div>
            <h2 className="section-title">Live <em>Vacancies</em></h2>
            <p className="section-sub">Current openings from our partner employers abroad. New vacancies are added regularly by our recruitment team.</p>
          </div>
          <VacanciesList vacancies={(vacancies as Vacancy[]) || []} />
        </div>
      </section>

      <section className="employers" id="employers">
        <div className="container employer-grid">
          <div className="employer-copy" data-aos>
            <div className="eyebrow">For Employers</div>
            <h2 className="section-title">Are you an employer looking for <em>skilled workers</em>?</h2>
            <p>Tell us about your manpower requirements and our recruitment team will help you find suitable candidates.</p>
            <div className="employer-points">
              <div><i className="fa-solid fa-check" /> Access to a wide pool of skilled and semi-skilled Pakistani workers</div>
              <div><i className="fa-solid fa-check" /> Structured screening and shortlisting process</div>
              <div><i className="fa-solid fa-check" /> Direct coordination with our recruitment team</div>
            </div>
          </div>
          <EmployerForm />
        </div>
      </section>

      <section className="apply" id="apply">
        <div className="container">
          <div className="section-head center">
            <div className="eyebrow" style={{ justifyContent: "center" }}>Candidates</div>
            <h2 className="section-title">Submit Your <em>Application</em></h2>
            <p className="section-sub">Complete the form below — our recruitment team will review your profile against current opportunities.</p>
          </div>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <ApplicationForm countries={(countries as Country[]) || []} categories={(categories as JobCategory[]) || []} />
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="container contact-grid">
          <div data-aos>
            <div className="eyebrow">Get In Touch</div>
            <h2 className="section-title" style={{ marginBottom: 26 }}>Contact <em>Us</em></h2>
            <div className="contact-person">
              <h5>Sardar M Ishaq Khan</h5><span className="role">Overseas Employment Promoter</span>
              <div className="contact-actions">
                <a href="tel:+923028202273" className="call-btn"><i className="fa-solid fa-phone" /> Call · 0302-8202273</a>
                <a href="https://wa.me/923028202273" target="_blank" rel="noopener" className="wa-btn"><i className="fa-brands fa-whatsapp" /> WhatsApp</a>
              </div>
            </div>
            <div className="contact-person">
              <h5>Muhammad Shakeel Khan</h5><span className="role">Overseas Employment Promoter</span>
              <div className="contact-actions">
                <a href="tel:+923008202273" className="call-btn"><i className="fa-solid fa-phone" /> Call · 0300-8202273</a>
                <a href="https://wa.me/923008202273" target="_blank" rel="noopener" className="wa-btn"><i className="fa-brands fa-whatsapp" /> WhatsApp</a>
              </div>
            </div>
            <div className="contact-email-card">
              <i className="fa-solid fa-envelope" />
              <div><b>almirahmed638@gmail.com</b><span>Applications &amp; general inquiries</span></div>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      <FloatActions />
      <Footer />
    </>
  );
}
