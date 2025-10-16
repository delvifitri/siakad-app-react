import type { ReactNode } from "react";

export default function StatCard({
  icon,
  title,
  value,
}: {
  icon: ReactNode;
  title: string;
  value: string | number;
}) {
  return (
    <div className="p-5 h-24 rounded-2xl bg-white/30 backdrop-blur-lg ring-1 ring-white/30 shadow-lg flex items-start gap-3 overflow-hidden">
      <div className="p-2 rounded-xl bg-white/30 backdrop-blur-md flex-shrink-0 text-current">{icon}</div>
      <div className="min-w-0">
        <p className="text-sm text-gray-700 truncate">{title}</p>
        <p className="text-l font-semibold text-gray-900 whitespace-normal break-words leading-snug">{value}</p>
      </div>
    </div>
  );
}
