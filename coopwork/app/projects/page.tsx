"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Users, Layers, ShieldCheck, Search, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { fadeUp, staggerContainer } from "@/lib/animations"
import { MOCK_PROJECTS, relativeDate, type ProjectCategory } from "@/lib/mock-data"

function Section({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.section
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.section>
  )
}

const CATEGORY_META: Record<
  ProjectCategory,
  { icon: string; color: string; text: string; count: number }
> = {
  Tech:      { icon: "⚡", color: "border-indigo-800/60 hover:border-indigo-600",  text: "text-indigo-300",  count: 2 },
  Social:    { icon: "🌱", color: "border-green-800/60 hover:border-green-600",    text: "text-green-300",   count: 2 },
  Fintech:   { icon: "💳", color: "border-emerald-800/60 hover:border-emerald-600",text: "text-emerald-300", count: 1 },
  Health:    { icon: "🩺", color: "border-rose-800/60 hover:border-rose-600",      text: "text-rose-300",    count: 1 },
  Education: { icon: "📚", color: "border-amber-800/60 hover:border-amber-600",    text: "text-amber-300",   count: 1 },
  Creative:  { icon: "🎨", color: "border-purple-800/60 hover:border-purple-600",  text: "text-purple-300",  count: 1 },
}

const STEPS = [
  {
    number: "01",
    title: "Explora proyectos",
    description: "Navega el feed de proyectos abiertos. Filtra por área, categoría o estado.",
    icon: <Search size={18} />,
  },
  {
    number: "02",
    title: "Elige tu rol",
    description: "Cada proyecto define roles con su porcentaje de equity. Elige el que encaja contigo.",
    icon: <Users size={18} />,
  },
  {
    number: "03",
    title: "Colabora con claridad",
    description: "Equity definido desde el día uno. Sin sorpresas, sin jerarquías ambiguas.",
    icon: <ShieldCheck size={18} />,
  },
]

const STATUS_DOT: Record<string, string> = {
  open:   "bg-emerald-400",
  full:   "bg-amber-400",
  closed: "bg-slate-500",
}

const STATUS_LABEL: Record<string, string> = {
  open: "Abierto", full: "Lleno", closed: "Cerrado",
}

export default function ProjectsPage() {
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true })
  const featuredProjects = MOCK_PROJECTS.filter((p) => p.status === "open").slice(0, 3)

  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-indigo-600/6 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/5 blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* Hero */}
        <section
          ref={heroRef}
          className="mx-auto max-w-4xl px-6 pt-32 pb-20 text-center"
        >
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            className="mb-4 flex justify-center"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400">
              <Layers size={11} />
              {MOCK_PROJECTS.length} proyectos activos
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            transition={{ delay: 0.08 }}
            className="mb-5 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Encuentra el equipo{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              para tu próxima idea
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            transition={{ delay: 0.16 }}
            className="mb-10 text-lg text-slate-500 max-w-xl mx-auto leading-relaxed"
          >
            Proyectos reales con roles claros y distribución de equity transparente desde el primer día.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            transition={{ delay: 0.24 }}
            className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/projects-feed"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
              >
                Explorar proyectos
                <ArrowRight size={15} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/projects/new"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-7 py-3.5 text-sm font-semibold text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
              >
                <Plus size={15} />
                Crear proyecto
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Cómo funciona */}
        <Section className="mx-auto max-w-5xl px-6 py-16">
          <motion.div variants={fadeUp} className="mb-12 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-slate-600 mb-2">
              Proceso
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Tres pasos para colaborar
            </h2>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
              >
                {i < STEPS.length - 1 && (
                  <div className="absolute top-8 -right-2 hidden h-px w-4 bg-slate-700 sm:block" />
                )}
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-3xl font-black text-slate-800 leading-none select-none">
                    {step.number}
                  </span>
                  <span className="text-slate-500">{step.icon}</span>
                </div>
                <h3 className="mb-1.5 font-semibold text-slate-200 text-[15px]">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Categorías */}
        <Section className="mx-auto max-w-5xl px-6 py-16">
          <motion.div variants={fadeUp} className="mb-10 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-slate-600 mb-2">
              Áreas
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Proyectos de todo tipo
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {(Object.entries(CATEGORY_META) as [ProjectCategory, (typeof CATEGORY_META)[ProjectCategory]][]).map(
              ([cat, meta], i) => (
                <motion.div
                  key={cat}
                  variants={fadeUp}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -3 }}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border bg-slate-900/40 p-4 transition-colors cursor-default",
                    meta.color
                  )}
                >
                  <span className="text-2xl">{meta.icon}</span>
                  <span className={cn("text-xs font-semibold", meta.text)}>{cat}</span>
                  <span className="text-[10px] text-slate-600">
                    {meta.count} proyecto{meta.count !== 1 ? "s" : ""}
                  </span>
                </motion.div>
              )
            )}
          </div>
        </Section>

        {/* Preview de proyectos */}
        <Section className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-8 flex items-end justify-between">
            <motion.div variants={fadeUp}>
              <p className="text-xs font-medium uppercase tracking-widest text-slate-600 mb-1">
                Recientes
              </p>
              <h2 className="text-2xl font-bold text-white">
                Proyectos abiertos
              </h2>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Link
                href="/projects-feed"
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1"
              >
                Ver todos
                <ArrowRight size={13} />
              </Link>
            </motion.div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {featuredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -2 }}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-1.5 mb-3">
                  <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[project.status])} />
                  <span className="text-[11px] text-slate-500">{STATUS_LABEL[project.status]}</span>
                  <span className="text-slate-700 text-[11px] ml-auto">{relativeDate(project.created_at)}</span>
                </div>
                <h3 className="font-semibold text-slate-200 text-sm mb-1">{project.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.roles
                    .filter((r) => r.filled_by === null)
                    .slice(0, 2)
                    .map((r) => (
                      <span
                        key={r.id}
                        className="rounded-full border border-indigo-800/50 bg-indigo-500/10 px-2 py-0.5 text-[10px] text-indigo-400"
                      >
                        {r.role_name}
                      </span>
                    ))}
                  {project.roles.filter((r) => r.filled_by === null).length > 2 && (
                    <span className="text-[10px] text-slate-600 px-1 py-0.5">
                      +{project.roles.filter((r) => r.filled_by === null).length - 2} más
                    </span>
                  )}
                </div>
                <div className="flex h-1 w-full overflow-hidden rounded-full gap-px">
                  {project.roles.map((r, idx) => (
                    <div
                      key={r.id}
                      style={{ width: `${r.equity_percent}%` }}
                      className={cn(
                        "h-full",
                        r.filled_by !== null
                          ? "bg-slate-700"
                          : ["bg-indigo-500", "bg-violet-500", "bg-sky-500", "bg-purple-500"][idx % 4]
                      )}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Stats */}
        <Section className="mx-auto max-w-5xl px-6 py-16">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 grid grid-cols-3 divide-x divide-slate-800">
            {[
              { value: `${MOCK_PROJECTS.filter((p) => p.status === "open").length}`, label: "Proyectos abiertos" },
              { value: "6", label: "Áreas de conocimiento" },
              { value: "100%", label: "Equity transparente" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center justify-center py-8 px-4 text-center"
              >
                <span className="text-3xl font-bold text-white mb-1">{stat.value}</span>
                <span className="text-xs text-slate-500">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* CTA final */}
        <Section className="mx-auto max-w-5xl px-6 py-16 pb-32">
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 px-8 py-12 text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-3 sm:text-3xl">
              ¿Tienes una idea en mente?
            </h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
              Define los roles, asigna el equity y publica tu proyecto. El equipo correcto te encuentra.
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/projects-feed"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
              >
                Explorar proyectos
                <ArrowRight size={15} />
              </Link>
            </motion.div>
          </motion.div>
        </Section>
      </div>
    </div>
  )
}
