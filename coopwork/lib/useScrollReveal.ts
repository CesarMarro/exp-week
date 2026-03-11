"use client";

import { useEffect, useRef } from "react";
import { useInView, useAnimation } from "framer-motion";

export function useScrollReveal(threshold = 0.2) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: threshold });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  return { ref, controls };
}
