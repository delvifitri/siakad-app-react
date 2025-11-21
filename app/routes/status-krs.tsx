import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import MobileLayout from "../layouts/MobileLayout";
import { useKrsContext } from "../context/KrsContext";

export function meta() {
  return [
    { title: "Status KRS - Siakad" },
    { name: "description", content: "Status pengajuan KRS ke Dosen PA" },
  ];
}

export default function StatusKrs() {
  const { submission } = useKrsContext();
  const [searchParams] = useSearchParams();

  // Semester aktif dari query param (fallback ke 1)
  const semParam = searchParams.get("sem");
  const preset = useMemo(
    () => [
      { year: "2020/2021", season: "Ganjil" },
      { year: "2021/2022", season: "Genap" },
      { year: "2023/2024", season: "Ganjil" },
      { year: "2024/2025", season: "Genap" },
    ],
    []
  );
  const semIndex = useMemo(() => {
    const n = parseInt(semParam || "1", 10);
    if (!Number.isFinite(n) || n < 1) return 0;
    return Math.min(n - 1, preset.length - 1);
  }, [semParam, preset.length]);
  const semesterLabel = `Semester ${semIndex + 1}`;
  const academicYear = preset[semIndex]?.year || "";
  const season = preset[semIndex]?.season || "";

  // Dummy fallback when belum ada pengajuan
  const dummyItems = [
    { id: "IF101", name: "Algoritma dan Pemrograman", sks: 3, cls: "A" as const, status: "disetujui" as const },
    { id: "IF102", name: "Struktur Data", sks: 3, cls: "B" as const, status: "menunggu" as const },
    { id: "IF201", name: "Basis Data", sks: 3, cls: "A" as const, status: "disetujui" as const },
    { id: "IF202", name: "Sistem Operasi", sks: 3, cls: "A" as const, status: "menunggu" as const },
  ];
  const items = submission.items.length > 0 ? submission.items : dummyItems;
  const advisor = submission.advisor || "Dr. Andi Wijaya, M.Kom";

  const { approved, pending, rejected, summary } = useMemo(() => {
    const approved = items.filter((i) => i.status === "disetujui");
    const pending = items.filter((i) => i.status === "menunggu");
    const rejected = items.filter((i) => i.status === "ditolak");
    const summary = `${approved.length}/${items.length} Disetujui`;
    return { approved, pending, rejected, summary };
  }, [items]);

  return (
    <MobileLayout title="Status KRS" showNav={true} bgImage="/bg simple.png">
      <div className="p-4 space-y-4">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold text-gray-900">Status Pengajuan KRS</h1>
          <p className="text-sm text-gray-600">Dosen PA: <span className="font-medium text-gray-800">{advisor}</span></p>
          {submission.submittedAt && (
            <p className="text-xs text-gray-500">Dikirim pada: {new Date(submission.submittedAt).toLocaleString()}</p>
          )}
          {/* Semester aktif */}
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
            <span>{semesterLabel}</span>
            {(academicYear || season) && <span className="text-[11px] text-blue-600">({academicYear} {season})</span>}
          </div>
        </header>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-800">Ringkasan:</span>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
            {summary}
          </span>
        </div>

        {approved.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-2">Disetujui ({approved.length})</h2>
            <ul className="space-y-2">
              {approved.map((k) => (
                <li key={k.id} className="flex items-center justify-between bg-white/70 backdrop-blur-md rounded-xl px-3 py-2 ring-1 ring-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{k.name}</p>
                    <p className="text-xs text-gray-600">Kelas {k.cls} • {k.sks} SKS</p>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Disetujui</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {pending.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-2">Menunggu Persetujuan ({pending.length})</h2>
            <ul className="space-y-2">
              {pending.map((k) => (
                <li key={k.id} className="flex items-center justify-between bg-white/70 backdrop-blur-md rounded-xl px-3 py-2 ring-1 ring-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{k.name}</p>
                    <p className="text-xs text-gray-600">Kelas {k.cls} • {k.sks} SKS</p>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">Menunggu</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {rejected.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-2">Ditolak ({rejected.length})</h2>
            <ul className="space-y-2">
              {rejected.map((k) => (
                <li key={k.id} className="flex items-center justify-between bg-white/70 backdrop-blur-md rounded-xl px-3 py-2 ring-1 ring-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{k.name}</p>
                    <p className="text-xs text-gray-600">Kelas {k.cls} • {k.sks} SKS</p>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">Ditolak</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Message removed: we always show items (real or dummy) */}

        <div className="h-8" />
      </div>
    </MobileLayout>
  );
}
