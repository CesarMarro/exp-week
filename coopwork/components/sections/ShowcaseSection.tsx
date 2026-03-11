"use client";

import { motion } from "framer-motion";
import { Users, Code2 } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { showcase } from "@/lib/content";

const statusStyles = {
  active: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  looking: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
};

const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

export default function ShowcaseSection() {
  const { ref, controls } = useScrollReveal();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="bg-slate-900/60 px-6 py-24"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          className="mb-16 text-center"
          variants={fadeUp}
          initial="hidden"
          animate={controls}
        >
          <h2 className="text-3xl font-bold sm:text-4xl">
            {showcase.title}
          </h2>
          <p className="mt-4 text-slate-400">
            {showcase.subtitle}
          </p>
        </motion.div>

        <motion.div
          className="grid gap-6 sm:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          animate={controls}
        >
          {showcase.projects.map((project) => (
            <motion.div
              key={project.name}
              variants={cardVariant}
              whileHover={{
                y: -6,
                boxShadow: "0 20px 40px rgba(99,102,241,0.12)",
              }}
              className="flex flex-col rounded-2xl border border-slate-800 bg-slate-800/50 p-6 cursor-default"
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between gap-2">
                <h3 className="text-xl font-bold">{project.name}</h3>
                <motion.span
                  className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[project.status]}`}
                  animate={
                    project.status === "looking"
                      ? { opacity: [1, 0.55, 1] }
                      : {}
                  }
                  transition={
                    project.status === "looking"
                      ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      : {}
                  }
                >
                  {project.statusLabel}
                </motion.span>
              </div>

              <p className="mb-4 text-sm text-slate-400 flex-1">
                {project.description}
              </p>

              {/* Tech stack */}
              <div className="mb-4 flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="flex items-center gap-1 rounded bg-slate-700 px-2 py-0.5 text-xs text-slate-300"
                  >
                    <Code2 className="h-3 w-3" />
                    {tech}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-slate-700 pt-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {project.members} colaboradores
                </span>
                <span className="text-slate-500">{project.equityExample}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
