import { Link } from "react-router-dom";

export default function NewsItem({
  title,
  excerpt,
  to,
  day = "07",
  month = "Sep",
}: {
  title: string;
  excerpt?: string;
  to: string;
  day?: string;
  month?: string;
}) {
  return (
    <Link to={to} className="block">
      <article className="flex items-start gap-3 bg-white/50 backdrop-blur-md rounded-xl p-3 ring-1 ring-white/30 hover:bg-white/70 transition-colors">
        <div className="w-24 h-20 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 flex-col shadow-lg">
          <span className="text-2xl font-bold text-white tracking-tight">{day}</span>
          <span className="text-sm font-semibold text-white uppercase tracking-wide">{month}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-gray-900 leading-tight">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed font-medium">{excerpt}</p>
        </div>
      </article>
    </Link>
  );
}
