import Link from "next/link";
import EquityBadge from "@/components/EquityBadge";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20 text-center">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[600px] w-[600px] rounded-full bg-indigo-600/20 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="mb-6 flex justify-center">
            <EquityBadge percentage={33} label="ejemplo" />
          </div>

          <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Construye proyectos reales.{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Reparte ganancias con justicia.
            </span>
          </h1>

          <p className="mb-10 text-lg text-slate-400 sm:text-xl">
            CoopWork conecta personas con habilidades complementarias para
            construir productos colaborativos, con reparto de equity transparente
            desde el primer día.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/projects"
              className="w-full rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold transition-colors hover:bg-indigo-500 sm:w-auto"
            >
              Ver proyectos
            </Link>
            <Link
              href="/projects/new"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-8 py-4 text-base font-semibold transition-colors hover:border-slate-500 hover:bg-slate-700 sm:w-auto"
            >
              Crear proyecto
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-16 text-center text-3xl font-bold sm:text-4xl">
            ¿Cómo funciona?
          </h2>

          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex flex-col items-center rounded-2xl border border-slate-800 bg-slate-800/50 p-8 text-center"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600/20 text-2xl">
                  {step.icon}
                </div>
                <span className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-400">
                  Paso {step.number}
                </span>
                <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
                <p className="text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 px-6 py-10 text-center text-sm text-slate-500">
        <p className="font-semibold text-slate-300">CoopWork</p>
        <p className="mt-1">Hackathon · 11 de marzo 2026</p>
      </footer>
    </main>
  );
}

const steps = [
  {
    number: 1,
    icon: "🚀",
    title: "Crea tu proyecto",
    description:
      "Define tu idea, las habilidades que necesitas y cómo se repartirá el equity entre colaboradores.",
  },
  {
    number: 2,
    icon: "🤝",
    title: "Únete a un equipo",
    description:
      "Explora proyectos activos, aplica con tu perfil y negocia tu participación de forma transparente.",
  },
  {
    number: 3,
    icon: "⚡",
    title: "Colabora y crece",
    description:
      "Trabaja en equipo, registra contribuciones y cobra tu parte proporcional cuando el proyecto genere ingresos.",
  },
];
