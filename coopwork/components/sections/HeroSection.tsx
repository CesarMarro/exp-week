"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ShaderBackground from "@/components/ui/shader-background";
import { fadeUp, fadeIn } from "@/lib/animations";
import { hero } from "@/lib/content";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20 text-center">
      {/* WebGL Shader background */}
      <ShaderBackground className="absolute inset-0 w-full h-full" />

      {/* Indigo glow overlay — blends with shader */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-0">
        <div className="h-[600px] w-[600px] rounded-full bg-indigo-600/20 blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl">
        <motion.div
          className="mb-6 flex justify-center"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-sm font-semibold text-indigo-300 ring-1 ring-indigo-500/40">
            <span className="text-indigo-400">⬡</span>
            {hero.flag}
          </span>
        </motion.div>

        <motion.h1
          className="mb-6 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl text-white [text-shadow:0_0_40px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.4)]"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.15 }}
        >
          {hero.headlineStart}{" "}
          <span className="text-white [text-shadow:0_0_40px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.4)]">
            {hero.headlineEnd}
          </span>
        </motion.h1>

        <motion.p
          className="mb-10 text-lg text-slate-300 sm:text-xl [text-shadow:0_0_24px_rgba(0,0,0,0.4)]"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          {hero.description}
        </motion.p>

        <motion.div
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.45 }}
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/projects"
              className="block w-full rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold transition-colors hover:bg-indigo-500 sm:w-auto"
            >
              {hero.ctaPrimary}
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/projects/new"
              className="block w-full rounded-xl border border-slate-700 bg-slate-800/80 px-8 py-4 text-base font-semibold transition-colors hover:border-slate-500 hover:bg-slate-700 sm:w-auto"
            >
              {hero.ctaSecondary}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-slate-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: 1.2, duration: 0.5 },
          y: { delay: 1.2, duration: 1.6, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </section>
  );
}
