import { Link } from "react-router-dom";

function parseDate(dateStr?: string) {
  if (!dateStr) return { day: "", month: "" };
  const parts = dateStr.split(" ").filter(Boolean);
  const day = parts[0] ?? "";
  const month = parts[1] ?? "";
  return { day, month };
}

export default function NewsItem({
  date,
  title,
  excerpt,
  to,
}: {
  date?: string;
  title: string;
  excerpt: string;
  to: string;
}) {
  const { day, month } = parseDate(date);

  return (
    <Link to={to} className="block">
      <article className="flex items-start gap-3 bg-white/50 backdrop-blur-md rounded-xl p-3 ring-1 ring-white/30 hover:bg-white/70 transition-colors">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-md overflow-hidden flex flex-col items-center justify-center bg-blue-500 text-white">
            <div className="text-lg font-extrabold leading-none">{day || "-"}</div>
            <div className="text-[11px] font-medium mt-1 uppercase">{month ? month.slice(0, 3) : ""}</div>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 leading-tight">{title}</h3>
          <p className="text-xs text-gray-700 mt-1 leading-snug">{excerpt}</p>
        </div>
      </article>
    </Link>
  );
}
