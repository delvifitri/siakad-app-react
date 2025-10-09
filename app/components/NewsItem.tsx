import { Link } from "react-router-dom";

export default function NewsItem({
  img,
  title,
  excerpt,
  to,
}: {
  img: string;
  title: string;
  excerpt: string;
  to: string;
}) {
  return (
    <Link to={to} className="block">
      <article className="flex items-start gap-3 bg-white/50 backdrop-blur-md rounded-xl p-3 ring-1 ring-white/30 hover:bg-white/70 transition-colors">
        <img src={img} alt={title} className="w-20 h-16 rounded-md object-cover flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 leading-tight">{title}</h3>
          <p className="text-xs text-gray-700 mt-1 leading-snug">{excerpt}</p>
        </div>
      </article>
    </Link>
  );
}
