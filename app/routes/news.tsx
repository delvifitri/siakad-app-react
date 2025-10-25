import SimpleLayout from "../layouts/SimpleLayout";
import NewsItem from "../components/NewsItem";
import { newsData } from "../data/newsData";
import { useMemo, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export function meta() {
  return [{ title: "Semua Berita - Siakad" }];
}

function parseDayMonth(dateStr: string): { day: string; month: string } {
  // Expect format like "10 Oktober 2025"
  const parts = dateStr.split(" ");
  const day = parts[0] || "";
  const monthFull = parts[1] || "";
  const month = monthFull.slice(0, 3);
  return { day, month };
}

export default function NewsList() {
  const [q, setQ] = useState("");
  const entries = useMemo(() => {
    const arr = Object.entries(newsData)
      .map(([id, item]) => ({ id: Number(id), ...item }))
      .filter((n) => (n as any).role === 'student' || (n as any).role === undefined)
      .sort((a, b) => a.id - b.id);
    if (!q.trim()) return arr;
    const needle = q.trim().toLowerCase();
    return arr.filter((n) =>
      n.title.toLowerCase().includes(needle) ||
      n.content.toLowerCase().includes(needle)
    );
  }, [q]);

  return (
    <SimpleLayout title="Semua Berita">
      <div className="mb-3">
        <div className="relative rounded-full bg-white/40 backdrop-blur-md ring-1 ring-white/30 shadow-sm focus-within:ring-2 focus-within:ring-orange-300">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-600" />
          </span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari berita..."
            className="w-full bg-transparent px-10 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none"
          />
        </div>
      </div>
      <div className="space-y-3">
        {entries.map((n) => {
          const dm = parseDayMonth(n.date);
          return (
            <NewsItem
              key={n.id}
              title={n.title}
              to={`/news/${n.id}`}
              day={dm.day || '01'}
              month={dm.month || 'Jan'}
            />
          );
        })}
      </div>
    </SimpleLayout>
  );
}
