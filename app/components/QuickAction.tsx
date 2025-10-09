export default function QuickAction({
  icon,
  label,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-2xl h-28 shadow-md ${className}`}>
      {icon}
      <span className="text-sm font-medium mt-1">{label}</span>
    </div>
  );
}
