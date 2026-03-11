"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function CTASection() {
  const { ref, controls } = useScrollReveal(0.3);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative overflow-hidden px-6 py-32"
    >
      {/* Pulsing gradient orb */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          className="h-[500px] w-[500px] rounded-full bg-gradient-to-br from-indigo-600/30 to-violet-600/20 blur-[100px]"
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.65, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        className="relative z-10 mx-auto max-w-2xl text-center"
        variants={staggerContainer}
        initial="hidden"
        animate={controls}
      >
        <motion.h2
          variants={fadeUp}
          className="text-4xl font-extrabold leading-tight sm:text-5xl"
        >
          ¿Listo para construir{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            algo juntos?
          </span>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mt-6 text-lg text-slate-400"
        >
          Únete a más de 1,200 colaboradores que ya están creando el futuro,
          con transparencia y equidad desde el primer día.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/projects/new"
              className="block w-full rounded-xl bg-indigo-600 px-10 py-4 text-base font-semibold transition-colors hover:bg-indigo-500 sm:w-auto"
            >
              Crear mi proyecto
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/projects"
              className="block w-full rounded-xl border border-slate-700 bg-slate-800/80 px-10 py-4 text-base font-semibold transition-colors hover:border-slate-500 hover:bg-slate-700 sm:w-auto"
            >
              Explorar proyectos
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
