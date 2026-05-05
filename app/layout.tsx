import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TOUR 360",
  description: "Viaje com qualidade, seguranca e conforto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className={`${inter.variable} h-full antialiased`}>
      {/* Fundo alinhado à página Corporativo: #0A2342 + gradientes + orbes */}
      <body className="relative flex min-h-full flex-col overflow-x-hidden text-zinc-900">
        <div className="pointer-events-none fixed inset-0 z-0 bg-[#0A2342]" aria-hidden />
        <div
          className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(80%_60%_at_15%_0%,rgba(78,168,222,0.28),transparent),radial-gradient(70%_50%_at_100%_20%,rgba(20,90,150,0.4),transparent)]"
          aria-hidden
        />
        <div
          className="pointer-events-none fixed -right-32 top-1/3 z-0 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none fixed -left-20 bottom-0 z-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl"
          aria-hidden
        />

        <div className="relative z-10 flex min-h-full flex-col">
          <Navbar />
          {/* min-h-0: permite scroll correcto dentro da coluna flex (evita "pagina presa"). */}
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
