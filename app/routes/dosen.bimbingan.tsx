import { useEffect } from "react";
import { useNavigate } from "react-router";
import DosenLayout from "../layouts/DosenLayout";
import { ChatBubbleLeftRightIcon, CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline";

export function meta() {
  return [{ title: "Bimbingan TA (Dosen) - Siakad" }];
}

const requests = [
  { name: "Ani Lestari", nim: "202101234", topic: "Bab 2 Tinjauan Pustaka", status: "menunggu" },
  { name: "Budi Santoso", nim: "202101235", topic: "Metodologi Penelitian", status: "disetujui" },
  { name: "Citra Rahma", nim: "202101236", topic: "Analisis Data", status: "proses" },
];

export default function DosenBimbingan() {
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const role = localStorage.getItem("userRole");
      if (role !== "dosen") navigate("/", { replace: true });
    } catch {}
  }, [navigate]);

  return (
    <DosenLayout bgImage="/bg simple.png">
      <section className="px-4 pt-6">
  <h1 className="text-xl font-bold text-gray-900">Bimbingan TA</h1>
  <p className="text-sm text-gray-600 mt-1">Kelola bimbingan tugas akhir mahasiswa.</p>

        <div className="mt-4 space-y-3">
          {requests.map((r, idx) => (
            <div key={idx} className="bg-white/60 rounded-xl border border-gray-200 p-3">
              <div className="flex items-start justify-between text-sm">
                <div>
                  <div className="font-semibold text-gray-900">{r.name} <span className="text-xs text-gray-500">({r.nim})</span></div>
                  <div className="text-xs text-gray-600">Topik: {r.topic}</div>
                </div>
                <div className="flex items-center gap-2">
                  {r.status === "disetujui" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-emerald-100 text-emerald-700"><CheckCircleIcon className="w-4 h-4"/> Disetujui</span>
                  ) : r.status === "proses" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-700"><ClockIcon className="w-4 h-4"/> Proses</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-amber-100 text-amber-700"><ClockIcon className="w-4 h-4"/> Menunggu</span>
                  )}
                  <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-white text-xs bg-blue-600">
                    <ChatBubbleLeftRightIcon className="w-4 h-4"/> Lihat Log
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </DosenLayout>
  );
}
