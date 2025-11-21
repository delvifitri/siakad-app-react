import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import DosenLayout from "../layouts/DosenLayout";
import { ArrowDownTrayIcon, Cog6ToothIcon, ArrowLeftIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export function meta() {
  return [{ title: "LIhat Nilai - Siakad" }];
}

const dummyStudents = [
  { nim: "23063116482010012", name: "Jamilah Hamidi Yanti" },
  { nim: "23063116482010016", name: "Nurus Shubuh" },
  { nim: "23063116482010009", name: "Andrianus Bilhot Sitanggang" },
  { nim: "23063116482010013", name: "Shohihunnatiq Zulananta" },
  { nim: "23063116482010010", name: "Pratiwi May Pamungkas" },
  { nim: "23063116482010015", name: "Tri Wahyuni Wulandari" },
];

const defaultKomponen = [
  { key: "tugas", label: "Tugas", bobot: 30 },
  { key: "uts", label: "UTS", bobot: 30 },
  { key: "uas", label: "UAS", bobot: 40 },
];

function computeFinalFromValues(values: Record<string, any>, komponen: Array<{ key: string; label: string; bobot: number }>) {
  let sum = 0;
  for (const k of komponen) {
    const v = Number(values?.[k.key]) || 0;
    sum += v * (k.bobot / 100);
  }
  return +sum.toFixed(2);
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

  // komponen: prefer data passed via navigation state (set-komponen), otherwise fallback
  const komponen: Array<{ key: string; label: string; bobot: number }> =
    (location.state as any)?.komponenList || (location.state as any)?.components || defaultKomponen;

  const [data, setData] = useState<Record<string, any>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const init: Record<string, any> = {};
    dummyStudents.forEach((s, idx) => {
      const compInit: Record<string, number> = {};
      komponen.forEach((k) => {
        // provide reasonable demo values per component + student index
        let base = 60;
        switch (k.key) {
          case "tugas":
            base = 75;
            break;
          case "uts":
            base = 70;
            break;
          case "uas":
            base = 80;
            break;
          case "kuis":
            base = 72;
            break;
          case "presensi":
            base = 90;
            break;
        }
        // vary slightly per student
        compInit[k.key] = Math.max(0, Math.min(100, base + idx * 3));
      });
      init[s.nim] = { ...compInit, akhir: computeFinalFromValues(compInit, komponen) };
    });
    setData(init);
  }, [code, komponen]);

  const update = (nim: string, field: string, value: any) => {
    setData((prev) => {
      const next = { ...prev };
      const cur = { ...(next[nim] || {}) };
      // all fields are numeric components; parse and store
      cur[field] = Number(value);
      cur.akhir = computeFinalFromValues(cur, komponen);
      next[nim] = cur;
      return next;
    });
  };

  const saveAll = () => {
    // no backend: keep in-memory and show toast
    setToast("Nilai disimpan (state saja)");
    setTimeout(() => setToast(null), 2500);
  };

  // CSV/Excel (CSV) download & upload helpers
  const downloadCsv = () => {
    // headers: nim, name, <komponen keys...>, akhir
    const headers = ["nim", "name", ...komponen.map((k) => k.key), "akhir"];
    const rows: string[][] = [];
    for (const s of dummyStudents) {
      const row = data[s.nim] || {};
      const cells = [s.nim, s.name, ...komponen.map((k) => String(row[k.key] ?? "")), String(row.akhir ?? "")];
      rows.push(cells);
    }

    const escapeCell = (v: string) => {
      if (v == null) return "";
      const s = String(v);
      if (s.includes(",") || s.includes('"') || s.includes("\n")) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    };

    const csv = [headers.map(escapeCell).join(","), ...rows.map((r) => r.map(escapeCell).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${code || "nilai"}_input_nilai.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setToast("File CSV diunduh");
    setTimeout(() => setToast(null), 1800);
  };

  // very small CSV parser that handles quoted fields and escaped quotes
  const parseCsv = (text: string) => {
    const lines = text.split(/\r\n|\n/).filter((l) => l.trim() !== "");
    if (!lines.length) return { headers: [], rows: [] };
    const splitLine = (line: string) => {
      const res: string[] = [];
      let cur = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuotes && line[i + 1] === '"') {
            cur += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (ch === "," && !inQuotes) {
          res.push(cur);
          cur = "";
        } else {
          cur += ch;
        }
      }
      res.push(cur);
      return res;
    };

    const headers = splitLine(lines[0]).map((h) => h.trim());
    const rows = lines.slice(1).map((l) => {
      const cols = splitLine(l);
      const obj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        obj[h] = cols[idx] !== undefined ? cols[idx] : "";
      });
      return obj;
    });
    return { headers, rows };
  };

  // (Removed upload flow) The page is view-only and provides CSV download only.

  const setKomponen = () => {
    setToast("Fitur set komponen nilai belum diimplementasikan");
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <DosenLayout bgImage="/bg simple.png">
      <section className="px-4 pt-6 pb-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Lihat Nilai</h1>
              <p className="text-sm text-gray-600">{course} — {code}</p>

              {/* komponen pills removed — percentages shown per-column / per-input instead */}
          </div>
          {/* save button moved below the student data */}
        </div>

        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 relative">
            <div className="relative">
              <button
                onClick={() => downloadCsv()}
                className="inline-flex items-center gap-2 p-2 rounded-full bg-blue-600 text-white text-xs hover:bg-blue-700"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Download Nilai
              </button>
            </div>

            <button onClick={() => navigate(`/dosen/set-komponen-nilai/${code}`)} className="inline-flex items-center gap-2 p-2 rounded-full bg-red-600 text-white text-xs hover:bg-red-700">
              <Cog6ToothIcon className="w-4 h-4" />
              Set Komponen Nilai
            </button>
          </div>
        </div>

        {/* search - placed directly below the Download / Set Komponen buttons */}
        <div className="mb-4">
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau NIM"
              className="pl-12 pr-4 py-2 border rounded-full w-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="space-y-3">
          {/* desktop table (horizontally scrollable on small screens) */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* no negative margins here to avoid visual bleeding outside rounded corners */}
            <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
              {/* add padding inside the scroll area so content doesn't touch the card edges */}
              <div className="min-w-max px-4 sm:px-6">
                <table className="w-full table-auto text-sm">
                  <thead className="text-left text-xs text-gray-600">
                    <tr>
                      <th className="p-3 whitespace-nowrap">#</th>
                      <th className="p-3 whitespace-nowrap">NIM / Nama</th>
                      {komponen.map((k) => (
                        <th key={k.key} className="p-3 whitespace-nowrap">
                          <div className="hidden md:block flex items-center justify-between">
                            <span>{k.label}</span>
                            <span className="text-xs text-gray-500">{k.bobot}%</span>
                          </div>
                          <div className="md:hidden">
                            <span>{k.label} ({k.bobot}%)</span>
                          </div>
                        </th>
                      ))}
                      <th className="p-3 whitespace-nowrap">Nilai Akhir</th>
                      <th className="p-3 whitespace-nowrap">Nilai Index</th>
                      <th className="p-3 whitespace-nowrap">Nilai Huruf</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dummyStudents.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.nim.includes(search)).map((s, i) => {
                      const row = data[s.nim] || { uas: 0, presensi: 0, akhir: 0, keterangan: "" };
                      const g = gradeFromScore(row.akhir ?? 0);
                      return (
                        <tr key={s.nim} className="border-t">
                          <td className="p-3 align-top whitespace-nowrap">{i + 1}</td>
                          <td className="p-3 align-top whitespace-nowrap">
                            <div className="font-medium">{s.name}</div>
                            <div className="text-xs text-gray-600">{s.nim}</div>
                          </td>
                          {komponen.map((k) => (
                            <td key={k.key} className="p-3 align-top whitespace-nowrap">
                              <div className="px-2 py-1">{row[k.key] ?? "-"}</div>
                            </td>
                          ))}
                          <td className="p-3 align-top whitespace-nowrap">{(row.akhir ?? 0).toFixed(2)}</td>
                          <td className="p-3 align-top whitespace-nowrap">{(g?.index ?? 0).toFixed(2)}</td>
                          <td className="p-3 align-top whitespace-nowrap">{g?.letter ?? "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* mobile cards */}
          <div className="hidden space-y-3">
            {dummyStudents.map((s, i) => {
              const row = data[s.nim] || { uas: 0, presensi: 0, akhir: 0, keterangan: "" };
              const g = gradeFromScore(row.akhir ?? 0);
              return (
                <div key={s.nim} className="bg-white rounded-xl p-3 border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-gray-600">{s.nim}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{(g?.index ?? 0).toFixed(2)}</div>
                      <div className="text-xs text-gray-600">{g?.letter ?? "-"}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {komponen.map((k) => (
                      <div key={k.key} className="">
                        <label className="block text-xs text-gray-600 mb-1">
                          {k.label} <span className="text-xs text-gray-500">({k.bobot}%)</span>
                        </label>
                        <div className="w-full px-3 py-2 border rounded-md bg-gray-50">{row[k.key] ?? "-"}</div>

                        {/* If this component is UAS, show final score below it on mobile */}
                        {k.key === "uas" && (
                          <div className="mt-2 p-2 bg-gray-50 border rounded text-right">
                            <div className="text-sm font-semibold">{(row.akhir ?? 0).toFixed(2)}</div>
                            <div className="text-xs text-gray-500">Nilai Akhir</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* read-only view: editing and saving disabled */}

        {toast && <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg">{toast}</div>}
      </section>
    </DosenLayout>
  );
}
