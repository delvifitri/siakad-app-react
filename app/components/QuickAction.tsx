import { Link } from "react-router-dom";

type Size = 'md' | 'lg';

export default function QuickAction({
  icon,
  label,
  className,
  to,
  size = 'md',
  centered = false,
}: {
  icon: React.ReactNode;
  label: string;
  className?: string;
  to?: string;
  size?: Size;
  centered?: boolean;
}) {
  const base = `flex flex-col items-center justify-center rounded-2xl shadow-md ${centered ? 'text-center' : ''}`;
  const sizeCls = size === 'lg' ? 'p-4 h-32' : 'p-3 h-28';
  const labelCls = size === 'lg' ? 'text-base font-semibold mt-1' : 'text-sm font-medium mt-1';

  const content = (
    <div className={`${base} ${sizeCls} ${className ?? ''}`}>
      {icon}
      <span className={`${labelCls} ${centered ? 'w-full text-center' : ''}`}>{label}</span>
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return content;
}
