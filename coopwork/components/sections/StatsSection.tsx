"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { staggerContainer, scaleIn } from "@/lib/animations";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  emoji: string;
}

const stats: StatItem[] = [
  { value: 500, suffix: "+", label: "Proyectos creados", emoji: "🚀" },
  { value: 1200, suffix: "+", label: "Colaboradores activos", emoji: "🤝" },
  { value: 38, suffix: "", label: "Países representados", emoji: "🌎" },
  { value: 92, suffix: "%", label: "Satisfacción del equipo", emoji: "⭐" },
];

function AnimatedCounter({
  value,
  suffix,
  active,
}: {
  value: number;
  suffix: string;
  active: boolean;
}) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const duration = 1200;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, value]);

  return (
    <span>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const { ref, controls } = useScrollReveal(0.3);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="border-y border-slate-800 bg-slate-800/40 py-20 px-6"
    >
      <motion.div
        className="mx-auto max-w-5xl grid grid-cols-2 gap-8 sm:grid-cols-4"
        variants={staggerContainer}
        initial="hidden"
        animate={controls}
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={scaleIn}
            className="flex flex-col items-center text-center"
          >
            <span className="mb-3 text-3xl">{stat.emoji}</span>
            <span className="text-4xl font-extrabold text-white sm:text-5xl">
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                active={active}
              />
            </span>
            <span className="mt-2 text-sm text-slate-400">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
