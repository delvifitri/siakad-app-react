import type { ReactNode } from "react";

type Variant = 'default' | 'large';

export default function StatCard({
  icon,
  title,
  value,
  variant = 'default',
  wrapTitle = false,
}: {
  icon: ReactNode;
  title: string;
  value: string | number;
  variant?: Variant;
  wrapTitle?: boolean;
}) {
  const isLarge = variant === 'large';
  const container = isLarge
    ? 'p-6 min-h-[7rem]'
    : 'p-5 h-24';
  const titleCls = `${isLarge ? 'text-base' : 'text-sm'} text-gray-700 ${wrapTitle ? 'whitespace-normal break-words leading-snug' : 'truncate'}`;
  const valueCls = `${isLarge ? 'text-lg' : 'text-base'} font-semibold text-gray-900 ${isLarge ? 'break-words leading-snug' : 'whitespace-normal'}`;

  return (
    <div className={`${container} rounded-2xl bg-white/30 backdrop-blur-lg ring-1 ring-white/30 shadow-lg flex items-start gap-4`}>
      <div className={`${isLarge ? 'p-2.5' : 'p-2'} rounded-xl bg-white/30 backdrop-blur-md flex-shrink-0 text-current`}>{icon}</div>
      <div className="min-w-0">
        <p className={titleCls}>{title}</p>
        <p className={valueCls}>{value}</p>
      </div>
    </div>
  );
}
