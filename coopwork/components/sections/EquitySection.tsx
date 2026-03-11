"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { fadeUp, staggerContainer, fadeIn } from "@/lib/animations";
import EquityBadge from "@/components/EquityBadge";

interface EquitySlice {
  name: string;
  role: string;
  percentage: number;
  color: string;
  strokeColor: string;
}

const slices: EquitySlice[] = [
  {
    name: "Carlos",
    role: "Backend",
    percentage: 40,
    color: "text-violet-400",
    strokeColor: "#7c3aed",
  },
  {
    name: "Ana",
    role: "Diseño",
    percentage: 35,
    color: "text-indigo-400",
    strokeColor: "#4f46e5",
  },
  {
    name: "Marta",
    role: "Marketing",
    percentage: 25,
    color: "text-purple-400",
    strokeColor: "#9333ea",
  },
];

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 6;

function buildArcs(slicesData: EquitySlice[]) {
  let offset = 0;
  return slicesData.map((s) => {
    const arcLength = (s.percentage / 100) * CIRCUMFERENCE - GAP;
    const dashOffset = -offset;
    offset += arcLength + GAP;
    return { ...s, arcLength, dashOffset };
  });
}

export default function EquitySection() {
  const { ref, controls } = useScrollReveal(0.25);
  const [hovered, setHovered] = useState<string | null>(null);
  const arcs = buildArcs(slices);

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          className="mb-16 text-center"
          variants={fadeUp}
          initial="hidden"
          animate={controls}
        >
          <h2 className="text-3xl font-bold sm:text-4xl">
            Equity transparente desde el día uno
          </h2>
          <p className="mt-4 text-slate-400">
            Cada colaborador conoce exactamente su parte. Sin sorpresas, sin letra chica.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-16 lg:flex-row lg:justify-center"
          variants={staggerContainer}
          initial="hidden"
          animate={controls}
        >
          {/* Donut chart */}
          <motion.div variants={fadeIn} className="relative flex-shrink-0">
            <svg
              width="220"
              height="220"
              viewBox="0 0 220 220"
              className="drop-shadow-lg"
            >
              {/* Track */}
              <circle
                cx="110"
                cy="110"
                r={RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="28"
              />

              <g style={{ transformOrigin: "110px 110px" }}>
                {arcs.map((arc) => (
                  <motion.circle
                    key={arc.name}
                    cx="110"
                    cy="110"
                    r={RADIUS}
                    fill="none"
                    stroke={arc.strokeColor}
                    strokeWidth={28}
                    strokeLinecap="butt"
                    strokeDasharray={`${arc.arcLength} ${CIRCUMFERENCE}`}
                    initial={{
                      strokeDashoffset: CIRCUMFERENCE,
                      opacity: 0,
                    }}
                    animate={
                      controls === undefined
                        ? {}
                        : {
                            strokeDashoffset: arc.dashOffset,
                            opacity: hovered === null || hovered === arc.name ? 1 : 0.4,
                          }
                    }
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "110px 110px",
                    }}
                    onMouseEnter={() => setHovered(arc.name)}
                    onMouseLeave={() => setHovered(null)}
                    className="cursor-pointer"
                  />
                ))}
              </g>

              {/* Center label */}
              <text
                x="110"
                y="105"
                textAnchor="middle"
                className="fill-white text-sm font-bold"
                style={{ fontSize: 13, fill: "rgba(255,255,255,0.5)" }}
              >
                Proyecto
              </text>
              <text
                x="110"
                y="123"
                textAnchor="middle"
                style={{ fontSize: 15, fill: "white", fontWeight: "bold" }}
              >
                AppX
              </text>
            </svg>
          </motion.div>

          {/* Legend */}
          <motion.div
            className="flex flex-col gap-4 w-full max-w-xs"
            variants={staggerContainer}
          >
            {arcs.map((arc) => (
              <motion.div
                key={arc.name}
                variants={fadeUp}
                onMouseEnter={() => setHovered(arc.name)}
                onMouseLeave={() => setHovered(null)}
                whileHover={{ x: 4 }}
                className={`flex items-center justify-between rounded-xl border p-4 cursor-default transition-all duration-200 ${
                  hovered === arc.name
                    ? "border-indigo-500/50 bg-indigo-600/10"
                    : "border-slate-800 bg-slate-800/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: arc.strokeColor }}
                  />
                  <div>
                    <p className="font-semibold text-white">{arc.name}</p>
                    <p className="text-xs text-slate-400">{arc.role}</p>
                  </div>
                </div>
                <EquityBadge percentage={arc.percentage} />
              </motion.div>
            ))}

            <p className="mt-2 text-center text-xs text-slate-500">
              Pasa el cursor sobre cada sección para destacarla
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
