"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
// ─── Eyeball Component ────────────────────────────────────────────────────────

interface EyeBallProps {
  size?: number;
  pupilSize?: number;
  maxDistance?: number;
  eyeColor?: string;
  pupilColor?: string;
  isBlinking?: boolean;
  forceLookX?: number;
  forceLookY?: number;
}

function EyeBall({
  size = 48,
  pupilSize = 16,
  maxDistance = 10,
  eyeColor = "white",
  pupilColor = "#1e1b4b",
  isBlinking = false,
  forceLookX,
  forceLookY,
}: EyeBallProps) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const getPupilPos = () => {
    if (forceLookX !== undefined && forceLookY !== undefined)
      return { x: forceLookX, y: forceLookY };
    if (!eyeRef.current) return { x: 0, y: 0 };
    const r = eyeRef.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = mouse.x - cx;
    const dy = mouse.y - cy;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance);
    const angle = Math.atan2(dy, dx);
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
  };

  const pos = getPupilPos();

  return (
    <div
      ref={eyeRef}
      className="rounded-full flex items-center justify-center"
      style={{
        width: `${size}px`,
        height: isBlinking ? "2px" : `${size}px`,
        backgroundColor: eyeColor,
        overflow: "hidden",
        transition: "height 0.08s ease",
      }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            transition: "transform 0.1s ease-out",
          }}
        />
      )}
    </div>
  );
}

// ─── Pupil-only Component (for orange & yellow) ───────────────────────────────

interface PupilProps {
  size?: number;
  maxDistance?: number;
  pupilColor?: string;
  forceLookX?: number;
  forceLookY?: number;
}

function Pupil({
  size = 12,
  maxDistance = 5,
  pupilColor = "#1e1b4b",
  forceLookX,
  forceLookY,
}: PupilProps) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const getPos = () => {
    if (forceLookX !== undefined && forceLookY !== undefined)
      return { x: forceLookX, y: forceLookY };
    if (!ref.current) return { x: 0, y: 0 };
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = mouse.x - cx;
    const dy = mouse.y - cy;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance);
    const angle = Math.atan2(dy, dx);
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
  };

  const pos = getPos();

  return (
    <div
      ref={ref}
      className="rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: pupilColor,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: "transform 0.1s ease-out",
      }}
    />
  );
}

// ─── Characters Panel ─────────────────────────────────────────────────────────

interface CharactersPanelProps {
  isTypingEmail: boolean;
  isTypingPassword: boolean;
  showPassword: boolean;
  hasPassword: boolean;
}

function CharactersPanel({
  isTypingEmail,
  isTypingPassword,
  showPassword,
  hasPassword,
}: CharactersPanelProps) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [purpleBlink, setPurpleBlink] = useState(false);
  const [darkBlink, setDarkBlink] = useState(false);
  const [lookingAtEachOther, setLookingAtEachOther] = useState(false);
  const [purplePeeking, setPurplePeeking] = useState(false);

  const purpleRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const coralRef = useRef<HTMLDivElement>(null);
  const goldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Random blink — purple
  useEffect(() => {
    const scheduleBlink = (): ReturnType<typeof setTimeout> => {
      const t = setTimeout(() => {
        setPurpleBlink(true);
        setTimeout(() => {
          setPurpleBlink(false);
          scheduleBlink();
        }, 150);
      }, Math.random() * 4000 + 3000);
      return t;
    };
    const t = scheduleBlink();
    return () => clearTimeout(t);
  }, []);

  // Random blink — dark
  useEffect(() => {
    const scheduleBlink = (): ReturnType<typeof setTimeout> => {
      const t = setTimeout(() => {
        setDarkBlink(true);
        setTimeout(() => {
          setDarkBlink(false);
          scheduleBlink();
        }, 150);
      }, Math.random() * 4000 + 3500);
      return t;
    };
    const t = scheduleBlink();
    return () => clearTimeout(t);
  }, []);

  // Look at each other when typing email
  useEffect(() => {
    if (isTypingEmail) {
      setLookingAtEachOther(true);
      const t = setTimeout(() => setLookingAtEachOther(false), 800);
      return () => clearTimeout(t);
    } else {
      setLookingAtEachOther(false);
    }
  }, [isTypingEmail]);

  // Purple peeks when password is visible
  useEffect(() => {
    if (hasPassword && showPassword) {
      const schedulePeek = (): ReturnType<typeof setTimeout> => {
        const t = setTimeout(() => {
          setPurplePeeking(true);
          setTimeout(() => {
            setPurplePeeking(false);
          }, 900);
        }, Math.random() * 3000 + 2000);
        return t;
      };
      const t = schedulePeek();
      return () => clearTimeout(t);
    } else {
      setPurplePeeking(false);
    }
  }, [hasPassword, showPassword, purplePeeking]);

  const calcPos = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 3;
    const dx = mouse.x - cx;
    const dy = mouse.y - cy;
    return {
      faceX: Math.max(-15, Math.min(15, dx / 20)),
      faceY: Math.max(-10, Math.min(10, dy / 30)),
      bodySkew: Math.max(-6, Math.min(6, -dx / 120)),
    };
  };

  const pp = calcPos(purpleRef);
  const dp = calcPos(darkRef);
  const cp = calcPos(coralRef);
  const gp = calcPos(goldRef);

  const isHidingPassword = hasPassword && !showPassword;
  const isPeeking = hasPassword && showPassword;

  return (
    <div className="relative flex items-end justify-center" style={{ width: "460px", height: "360px" }}>

      {/* Purple tall rectangle — back layer */}
      <div
        ref={purpleRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: "50px",
          width: "160px",
          height: isHidingPassword || isTypingPassword ? "420px" : "370px",
          backgroundColor: "#4f46e5",
          borderRadius: "10px 10px 0 0",
          zIndex: 1,
          transform: isPeeking
            ? `skewX(0deg)`
            : isHidingPassword || isTypingPassword
            ? `skewX(${(pp.bodySkew || 0) - 12}deg) translateX(36px)`
            : `skewX(${pp.bodySkew || 0}deg)`,
          transformOrigin: "bottom center",
          boxShadow: "inset 0 -4px 24px rgba(0,0,0,0.3)",
        }}
      >
        {/* Shine */}
        <div className="absolute top-0 left-0 right-0 h-1/3 rounded-t-[10px]"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)" }} />
        {/* Eyes */}
        <div
          className="absolute flex gap-7 transition-all duration-700 ease-in-out"
          style={{
            left: isPeeking ? `18px` : lookingAtEachOther ? `50px` : `${42 + pp.faceX}px`,
            top: isPeeking ? `30px` : lookingAtEachOther ? `60px` : `${38 + pp.faceY}px`,
          }}
        >
          <EyeBall
            size={16} pupilSize={6} maxDistance={4}
            eyeColor="rgba(255,255,255,0.95)" pupilColor="#1e1b4b"
            isBlinking={purpleBlink}
            forceLookX={isPeeking ? (purplePeeking ? 3 : -3) : lookingAtEachOther ? 3 : undefined}
            forceLookY={isPeeking ? (purplePeeking ? 4 : -3) : lookingAtEachOther ? 4 : undefined}
          />
          <EyeBall
            size={16} pupilSize={6} maxDistance={4}
            eyeColor="rgba(255,255,255,0.95)" pupilColor="#1e1b4b"
            isBlinking={purpleBlink}
            forceLookX={isPeeking ? (purplePeeking ? 3 : -3) : lookingAtEachOther ? 3 : undefined}
            forceLookY={isPeeking ? (purplePeeking ? 4 : -3) : lookingAtEachOther ? 4 : undefined}
          />
        </div>
      </div>

      {/* Dark slate tall rectangle — middle layer */}
      <div
        ref={darkRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: "200px",
          width: "110px",
          height: "285px",
          backgroundColor: "#0f172a",
          borderRadius: "8px 8px 0 0",
          zIndex: 2,
          border: "1px solid rgba(99,102,241,0.3)",
          transform: isPeeking
            ? `skewX(0deg)`
            : lookingAtEachOther
            ? `skewX(${(dp.bodySkew || 0) * 1.5 + 10}deg) translateX(18px)`
            : isTypingPassword
            ? `skewX(${(dp.bodySkew || 0) * 1.5}deg)`
            : `skewX(${dp.bodySkew || 0}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1/4 rounded-t-[8px]"
          style={{ background: "linear-gradient(180deg, rgba(99,102,241,0.2) 0%, transparent 100%)" }} />
        <div
          className="absolute flex gap-5 transition-all duration-700 ease-in-out"
          style={{
            left: isPeeking ? `8px` : lookingAtEachOther ? `28px` : `${22 + dp.faceX}px`,
            top: isPeeking ? `24px` : lookingAtEachOther ? `10px` : `${28 + dp.faceY}px`,
          }}
        >
          <EyeBall
            size={14} pupilSize={5} maxDistance={3}
            eyeColor="rgba(255,255,255,0.9)" pupilColor="#312e81"
            isBlinking={darkBlink}
            forceLookX={isPeeking ? -3 : lookingAtEachOther ? 0 : undefined}
            forceLookY={isPeeking ? -3 : lookingAtEachOther ? -3 : undefined}
          />
          <EyeBall
            size={14} pupilSize={5} maxDistance={3}
            eyeColor="rgba(255,255,255,0.9)" pupilColor="#312e81"
            isBlinking={darkBlink}
            forceLookX={isPeeking ? -3 : lookingAtEachOther ? 0 : undefined}
            forceLookY={isPeeking ? -3 : lookingAtEachOther ? -3 : undefined}
          />
        </div>
      </div>

      {/* Coral semi-circle — front left */}
      <div
        ref={coralRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: "-10px",
          width: "210px",
          height: "175px",
          zIndex: 3,
          backgroundColor: "#f97316",
          borderRadius: "110px 110px 0 0",
          transform: isPeeking ? `skewX(0deg)` : `skewX(${cp.bodySkew || 0}deg)`,
          transformOrigin: "bottom center",
          boxShadow: "inset 0 -4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <div
          className="absolute flex gap-7 transition-all duration-200 ease-out"
          style={{
            left: isPeeking ? `46px` : `${70 + (cp.faceX || 0)}px`,
            top: isPeeking ? `76px` : `${80 + (cp.faceY || 0)}px`,
          }}
        >
          <Pupil size={11} maxDistance={4} pupilColor="#431407"
            forceLookX={isPeeking ? -4 : undefined}
            forceLookY={isPeeking ? -3 : undefined} />
          <Pupil size={11} maxDistance={4} pupilColor="#431407"
            forceLookX={isPeeking ? -4 : undefined}
            forceLookY={isPeeking ? -3 : undefined} />
        </div>
      </div>

      {/* Gold rounded-top rectangle — front right */}
      <div
        ref={goldRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: "275px",
          width: "130px",
          height: "210px",
          backgroundColor: "#eab308",
          borderRadius: "65px 65px 0 0",
          zIndex: 4,
          transform: isPeeking ? `skewX(0deg)` : `skewX(${gp.bodySkew || 0}deg)`,
          transformOrigin: "bottom center",
          boxShadow: "inset 0 -4px 20px rgba(0,0,0,0.15)",
        }}
      >
        <div
          className="absolute flex gap-5 transition-all duration-200 ease-out"
          style={{
            left: isPeeking ? `16px` : `${45 + (gp.faceX || 0)}px`,
            top: isPeeking ? `28px` : `${34 + (gp.faceY || 0)}px`,
          }}
        >
          <Pupil size={11} maxDistance={4} pupilColor="#422006"
            forceLookX={isPeeking ? -4 : undefined}
            forceLookY={isPeeking ? -3 : undefined} />
          <Pupil size={11} maxDistance={4} pupilColor="#422006"
            forceLookX={isPeeking ? -4 : undefined}
            forceLookY={isPeeking ? -3 : undefined} />
        </div>
        {/* Mouth */}
        <div
          className="absolute h-[3px] w-16 rounded-full transition-all duration-200 ease-out"
          style={{
            backgroundColor: "#422006",
            left: isPeeking ? `8px` : `${36 + (gp.faceX || 0)}px`,
            top: isPeeking ? `80px` : `${80 + (gp.faceY || 0)}px`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Main AuthForm ────────────────────────────────────────────────────────────

type Tab = "login" | "register";

interface FormState {
  tab: Tab;
  email: string;
  password: string;
  fullName: string;
  career: string;
  loading: boolean;
  error: string;
  showPassword: boolean;
  isTypingEmail: boolean;
  isTypingPassword: boolean;
}

interface MockUser {
  id: string
  email: string
  user_metadata: { full_name: string; career: string }
}

const CAREERS_PLACEHOLDER = "Elige una carrera...";

export default function AuthForm() {
  const router = useRouter();
  const [s, setS] = useState<FormState>({
    tab: "login",
    email: "",
    password: "",
    fullName: "",
    career: "",
    loading: false,
    error: "",
    showPassword: false,
    isTypingEmail: false,
    isTypingPassword: false,
  });
  const [careers, setCareers] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("careers")
        .select("id, name")
        .order("display_order");
      setCareers(data ?? []);
    };
    load();
  }, []);

  function set(partial: Partial<FormState>) {
    setS((prev) => ({ ...prev, ...partial }));
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!s.email || !s.password) {
      set({ error: "Completa todos los campos." });
      return;
    }
    set({ loading: true, error: "" });
    await new Promise((r) => setTimeout(r, 600));
    const mockUser: MockUser = {
      id: crypto.randomUUID(),
      email: s.email,
      user_metadata: { full_name: s.email.split("@")[0], career: "Colaborador" },
    };
    localStorage.setItem("mockUser", JSON.stringify(mockUser));
    router.push("/projects");
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (s.password.length < 6) {
      set({ error: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }
    set({ loading: true, error: "" });
    await new Promise((r) => setTimeout(r, 600));
    const mockUser: MockUser = {
      id: crypto.randomUUID(),
      email: s.email,
      user_metadata: { full_name: s.fullName || s.email.split("@")[0], career: s.career || "Colaborador" },
    };
    localStorage.setItem("mockUser", JSON.stringify(mockUser));
    router.push("/projects");
  }

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-950">

      {/* ── Left Panel: Characters ── */}
      <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 p-12 overflow-hidden">
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Glow blobs */}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <Link href="/" className="text-2xl font-bold text-white tracking-tight">
            Coop<span className="text-indigo-300">Work</span>
          </Link>
        </div>

        {/* Characters */}
        <div className="relative z-10 flex justify-center">
          <CharactersPanel
            isTypingEmail={s.isTypingEmail}
            isTypingPassword={s.isTypingPassword}
            showPassword={s.showPassword}
            hasPassword={s.password.length > 0}
          />
        </div>

        {/* Footer links */}
        <div className="relative z-10 flex gap-6 text-xs text-indigo-300/60">
          <span className="hover:text-indigo-200 transition-colors cursor-pointer">Privacidad</span>
          <span className="hover:text-indigo-200 transition-colors cursor-pointer">Términos</span>
          <span className="hover:text-indigo-200 transition-colors cursor-pointer">Contacto</span>
        </div>
      </div>

      {/* ── Right Panel: Form ── */}
      <div className="flex items-center justify-center p-8 bg-slate-950">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[420px]"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <Link href="/" className="text-2xl font-bold text-white">
              Coop<span className="text-indigo-400">Work</span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-1.5">
              {s.tab === "login" ? "Bienvenido de nuevo" : "Crea tu cuenta"}
            </h1>
            <p className="text-slate-400 text-sm">
              {s.tab === "login"
                ? "Ingresa tus datos para continuar"
                : "Únete y empieza a colaborar"}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex mb-7 border-b border-slate-800">
            {(["login", "register"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => set({ tab, error: "" })}
                className="relative px-1 pb-3 mr-6 text-sm font-medium transition-colors"
                style={{ color: s.tab === tab ? "white" : "rgb(100,116,139)" }}
              >
                {tab === "login" ? "Iniciar sesión" : "Registrarse"}
                {s.tab === tab && (
                  <motion.div
                    layoutId="tab-line"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-indigo-500"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Forms */}
          <AnimatePresence mode="wait">
            {s.tab === "login" ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.18 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={s.email}
                    onChange={(e) => set({ email: e.target.value })}
                    onFocus={() => set({ isTypingEmail: true })}
                    onBlur={() => set({ isTypingEmail: false })}
                    placeholder="tu@email.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={s.showPassword ? "text" : "password"}
                      required
                      value={s.password}
                      onChange={(e) => set({ password: e.target.value })}
                      onFocus={() => set({ isTypingPassword: true })}
                      onBlur={() => set({ isTypingPassword: false })}
                      placeholder="••••••••"
                      className={`${inputClass} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => set({ showPassword: !s.showPassword })}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {s.showPassword ? <EyeOffSvg /> : <EyeSvg />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <span className="text-xs text-slate-600 select-none cursor-default">
                    ¿Olvidaste tu contraseña?
                  </span>
                </div>

                {s.error && (
                  <div className="rounded-xl border border-red-900/40 bg-red-950/30 px-4 py-3 text-xs text-red-400">
                    {s.error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={s.loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-60"
                >
                  {s.loading ? <SpinnerSvg /> : "Iniciar sesión"}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                onSubmit={handleRegister}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      required
                      value={s.fullName}
                      onChange={(e) => set({ fullName: e.target.value })}
                      onFocus={() => set({ isTypingEmail: true })}
                      onBlur={() => set({ isTypingEmail: false })}
                      placeholder="Ana García"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Carrera / Área
                    </label>
                    <select
                      required
                      value={s.career}
                      onChange={(e) => set({ career: e.target.value })}
                      onFocus={() => set({ isTypingEmail: true })}
                      onBlur={() => set({ isTypingEmail: false })}
                      className={inputClass}
                      aria-label="Carrera o área"
                    >
                      <option value="">{CAREERS_PLACEHOLDER}</option>
                      {careers.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={s.email}
                    onChange={(e) => set({ email: e.target.value })}
                    onFocus={() => set({ isTypingEmail: true })}
                    onBlur={() => set({ isTypingEmail: false })}
                    placeholder="tu@email.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Contraseña{" "}
                    <span className="text-slate-600">(mín. 6 caracteres)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={s.showPassword ? "text" : "password"}
                      required
                      value={s.password}
                      onChange={(e) => set({ password: e.target.value })}
                      onFocus={() => set({ isTypingPassword: true })}
                      onBlur={() => set({ isTypingPassword: false })}
                      placeholder="••••••••"
                      className={`${inputClass} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => set({ showPassword: !s.showPassword })}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {s.showPassword ? <EyeOffSvg /> : <EyeSvg />}
                    </button>
                  </div>
                </div>

                {s.error && (
                  <div className="rounded-xl border border-red-900/40 bg-red-950/30 px-4 py-3 text-xs text-red-400">
                    {s.error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={s.loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-60"
                >
                  {s.loading ? <SpinnerSvg /> : "Crear cuenta"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Bottom switch */}
          <p className="mt-7 text-center text-sm text-slate-500">
            {s.tab === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button
              onClick={() => set({ tab: s.tab === "login" ? "register" : "login", error: "" })}
              className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors"
            >
              {s.tab === "login" ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────

function EyeSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function SpinnerSvg() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
