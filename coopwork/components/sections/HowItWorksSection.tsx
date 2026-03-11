"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { fadeUp, staggerContainer, scaleIn } from "@/lib/animations";
import { howItWorks } from "@/lib/content";

export default function HowItWorksSection() {
  const { ref, controls } = useScrollReveal();

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          className="mb-16 text-center text-3xl font-bold sm:text-4xl"
          variants={fadeUp}
          initial="hidden"
          animate={controls}
        >
          {howItWorks.title}
        </motion.h2>

        <motion.div
          className="grid gap-8 sm:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          animate={controls}
        >
          {howItWorks.steps.map((step) => (
            <motion.div
              key={step.number}
              variants={scaleIn}
              whileHover={{
                y: -6,
                borderColor: "rgba(99,102,241,0.45)",
                backgroundColor: "rgba(99,102,241,0.06)",
              }}
              className="flex flex-col items-center rounded-2xl border border-slate-800 bg-slate-800/50 p-8 text-center cursor-default transition-colors"
            >
              <motion.div
                className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600/20 text-2xl"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {step.icon}
              </motion.div>
              <span className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-400">
                Paso {step.number}
              </span>
              <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
              <p className="text-slate-400">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
