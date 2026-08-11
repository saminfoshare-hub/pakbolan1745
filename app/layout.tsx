import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PAK BOLAN INTERNATIONAL | Overseas Employment & Manpower Recruitment",
  description:
    "PAK BOLAN INTERNATIONAL connects Pakistani skilled, semi-skilled and professional workers with overseas employment opportunities. Explore current vacancies and submit your application online.",
  openGraph: {
    type: "website",
    title: "PAK BOLAN INTERNATIONAL | Overseas Employment & Manpower Recruitment",
    description:
      "Connecting skilled Pakistani professionals and workers with employment opportunities around the world.",
  },
  themeColor: "#0B1E3D",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EmploymentAgency",
              name: "PAK BOLAN INTERNATIONAL",
              description:
                "Overseas employment promoters connecting Pakistani workers with international job opportunities.",
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
