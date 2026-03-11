"use client";

import { motion } from "framer-motion";
import {
  BarChart2,
  Handshake,
  ShieldCheck,
  Layers,
  Banknote,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { features as featuresContent } from "@/lib/content";

const featureIcons: LucideIcon[] = [
  BarChart2,
  Handshake,
  ShieldCheck,
  Layers,
  Banknote,
  Users,
];

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function FeaturesSection() {
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
            {featuresContent.title}
          </h2>
          <p className="mt-4 text-slate-400">
            {featuresContent.subtitle}
          </p>
        </motion.div>

        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          animate={controls}
        >
          {featuresContent.items.map((feature, i) => {
            const Icon = featureIcons[i];
            return (
              <motion.div
                key={feature.title + i}
                variants={cardVariant}
                whileHover={{ y: -4, borderColor: "rgba(99,102,241,0.5)" }}
                className="rounded-2xl border border-slate-800 bg-slate-800/30 p-6 cursor-default transition-colors"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20">
                  <Icon className="h-5 w-5 text-indigo-400" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
