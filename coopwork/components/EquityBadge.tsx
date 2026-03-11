interface EquityBadgeProps {
  percentage: number;
  label?: string;
}

export default function EquityBadge({ percentage, label }: EquityBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-sm font-semibold text-indigo-300 ring-1 ring-indigo-500/40">
      <span className="text-indigo-400">⬡</span>
      {percentage}% equity{label ? ` · ${label}` : ""}
    </span>
  );
}
