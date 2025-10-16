import { useMemo } from "react";
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

  const { approved, pending, rejected, summary } = useMemo(() => {
    const approved = submission.items.filter((i) => i.status === "disetujui");
    const pending = submission.items.filter((i) => i.status === "menunggu");
    const rejected = submission.items.filter((i) => i.status === "ditolak");
    const summary = `${approved.length}/${submission.items.length} Disetujui`;
    return { approved, pending, rejected, summary };
  }, [submission]);

  return (
    <MobileLayout title="Status KRS" showNav={false}>
      <div className="p-4 space-y-4">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold text-gray-900">Status Pengajuan KRS</h1>
          <p className="text-sm text-gray-600">Dosen PA: <span className="font-medium text-gray-800">{submission.advisor || "-"}</span></p>
          {submission.submittedAt && (
            <p className="text-xs text-gray-500">Dikirim pada: {new Date(submission.submittedAt).toLocaleString()}</p>
          )}
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

        {!submission.submitted && (
          <div className="text-sm text-gray-600 bg-white/70 p-4 rounded-xl ring-1 ring-gray-200">
            Kamu belum mengirim KRS pada semester ini.
          </div>
        )}

        <div className="h-8" />
      </div>
    </MobileLayout>
  );
}
