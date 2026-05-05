import { RegisterForm } from "@/components/auth/register-form";
import { PageBack } from "@/components/layout/page-back";

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-[calc(100dvh-5rem)] flex-col">
      <main className="relative mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-6xl flex-col items-center justify-center px-4 py-10 md:py-14">
        <div className="absolute left-4 top-4 md:left-6 md:top-6">
          <PageBack href="/" label="Voltar ao inicio" variant="inverted" />
        </div>
        <RegisterForm />
      </main>
    </div>
  );
}
