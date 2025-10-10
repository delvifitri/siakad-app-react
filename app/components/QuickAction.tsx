import { Link } from "react-router-dom";

export default function QuickAction({
  icon,
  label,
  className,
  to,
}: {
  icon: React.ReactNode;
  label: string;
  className?: string;
  to?: string;
}) {
  const content = (
    <div className={`flex flex-col items-center justify-center p-3 rounded-2xl h-28 shadow-md ${className}`}>
      {icon}
      <span className="text-sm font-medium mt-1">{label}</span>
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return content;
}
