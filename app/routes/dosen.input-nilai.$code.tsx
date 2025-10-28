import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import DosenLayout from "../layouts/DosenLayout";
import { ArrowDownTrayIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

export function meta() {
  return [{ title: "Input Nilai - Siakad" }];
}

const dummyStudents = [
  { nim: "23063116482010012", name: "Jamilah Hamidi Yanti" },
  { nim: "23063116482010016", name: "Nurus Shubuh" },
  { nim: "23063116482010009", name: "Andrianus Bilhot Sitanggang" },
  { nim: "23063116482010013", name: "Shohihunnatiq Zulananta" },
  { nim: "23063116482010010", name: "Pratiwi May Pamungkas" },
  { nim: "23063116482010015", name: "Tri Wahyuni Wulandari" },
];

function computeFinal(uas: number, presensi: number) {
  const u = isNaN(uas) ? 0 : uas;
  const p = isNaN(presensi) ? 0 : presensi;
  return +(u * 0.9 + p * 0.1).toFixed(2);
}

function gradeFromScore(score: number) {
  if (score >= 85) return { letter: "A", index: 4.0, jenis: "normal" };
  if (score >= 80) return { letter: "A-", index: 3.75, jenis: "normal" };
  if (score >= 75) return { letter: "B+", index: 3.5, jenis: "normal" };
  if (score >= 70) return { letter: "B", index: 3.0, jenis: "normal" };
  if (score >= 65) return { letter: "C+", index: 2.5, jenis: "normal" };
  if (score >= 60) return { letter: "C", index: 2.0, jenis: "normal" };
  if (score >= 50) return { letter: "D", index: 1.0, jenis: "normal" };
  return { letter: "E", index: 0.0, jenis: "normal" };
}

export default function DosenInputNilai() {
  const { code } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const course = (location.state as any)?.course || code || "Mata Kuliah";

  const [data, setData] = useState<Record<string, { uas: number; presensi: number; akhir: number; keterangan: string }>>({});
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const init: Record<string, any> = {};
    dummyStudents.forEach((s) => {
      init[s.nim] = { uas: 0, presensi: 0, akhir: 0, keterangan: "" };
    });
    setData(init);
  }, [code]);

  const update = (nim: string, field: "uas" | "presensi" | "keterangan", value: any) => {
    setData((prev) => {
      const next = { ...prev };
      const cur = next[nim] || { uas: 0, presensi: 0, akhir: 0, keterangan: "" };
      if (field === "keterangan") cur.keterangan = value;
      else cur[field] = Number(value);
      cur.akhir = computeFinal(cur.uas, cur.presensi);
      next[nim] = cur;
      return next;
    });
  };

  const saveAll = () => {
    // no backend: keep in-memory and show toast
    setToast("Nilai disimpan (state saja)");
    setTimeout(() => setToast(null), 2500);
  };

  const importExcel = () => {
    setToast("Fitur import Excel belum diimplementasikan");
    setTimeout(() => setToast(null), 2000);
  };

  const setKomponen = () => {
    setToast("Fitur set komponen nilai belum diimplementasikan");
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <DosenLayout bgImage="/bg simple.png">
      <section className="px-4 pt-6 pb-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
            {/* icon-only back */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Input Nilai</h1>
            <p className="text-sm text-gray-600">{course} — {code}</p>
          </div>
          {/* save button moved below the student data */}
        </div>

        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button onClick={importExcel} className="inline-flex items-center gap-2 p-2 rounded-full bg-blue-600 text-white text-xs hover:bg-blue-700">
              <ArrowDownTrayIcon className="w-4 h-4" />
              Input Nilai dengan Excel
            </button>
            <button onClick={setKomponen} className="inline-flex items-center gap-2 p-2 rounded-full bg-red-600 text-white text-xs hover:bg-red-700">
              <Cog6ToothIcon className="w-4 h-4" />
              Set Komponen Nilai
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {/* desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200">
            <table className="w-full table-fixed text-sm">
              <thead className="text-left text-xs text-gray-600">
                <tr>
                  <th className="p-3 w-12">#</th>
                  <th className="p-3">NIM / Nama</th>
                  <th className="p-3 w-28">UAS</th>
                  <th className="p-3 w-28">PRESENSI</th>
                  <th className="p-3 w-32">Nilai Akhir</th>
                  <th className="p-3 w-28">Nilai Index</th>
                  <th className="p-3 w-28">Nilai Huruf</th>
                </tr>
              </thead>
              <tbody>
                {dummyStudents.map((s, i) => {
                  const row = data[s.nim] || { uas: 0, presensi: 0, akhir: 0, keterangan: "" };
                  const g = gradeFromScore(row.akhir);
                  return (
                    <tr key={s.nim} className="border-t">
                      <td className="p-3 align-top">{i + 1}</td>
                      <td className="p-3 align-top">
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-gray-600">{s.nim}</div>
                      </td>
                      <td className="p-3 align-top">
                        <input type="number" min={0} max={100} value={row.uas} onChange={(e) => update(s.nim, "uas", e.target.value)} className="w-full px-2 py-1 border rounded-md" />
                      </td>
                      <td className="p-3 align-top">
                        <input type="number" min={0} max={100} value={row.presensi} onChange={(e) => update(s.nim, "presensi", e.target.value)} className="w-full px-2 py-1 border rounded-md" />
                      </td>
                      <td className="p-3 align-top">{row.akhir.toFixed(2)}</td>
                      <td className="p-3 align-top">{g.index.toFixed(2)}</td>
                      <td className="p-3 align-top">{g.letter}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* mobile cards */}
          <div className="md:hidden space-y-3">
            {dummyStudents.map((s, i) => {
              const row = data[s.nim] || { uas: 0, presensi: 0, akhir: 0, keterangan: "" };
              const g = gradeFromScore(row.akhir);
              return (
                <div key={s.nim} className="bg-white rounded-xl p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-gray-600">{s.nim}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{row.akhir.toFixed(2)}</div>
                      <div className="text-xs text-gray-600">{g.letter} — {g.index.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">UAS</label>
                      <input type="number" min={0} max={100} value={row.uas} onChange={(e) => update(s.nim, "uas", e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Presensi (real)</label>
                      <input type="number" min={0} max={100} value={row.presensi} onChange={(e) => update(s.nim, "presensi", e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Keterangan (opsional)</label>
                      <input type="text" value={row.keterangan} onChange={(e) => update(s.nim, "keterangan", e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* save action placed below the data list */}
        <div className="mt-4">
          <button onClick={saveAll} className="w-full md:w-auto p-4 rounded-full bg-blue-600 text-white text-xs">Simpan</button>
        </div>

        {toast && <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg">{toast}</div>}
      </section>
    </DosenLayout>
  );
}
