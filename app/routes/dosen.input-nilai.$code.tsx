import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import DosenLayout from "../layouts/DosenLayout";
import { ArrowDownTrayIcon, Cog6ToothIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

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

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showExcelMenu, setShowExcelMenu] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  const onFileSelect = (e: any) => {
    const f = e.target.files?.[0] ?? null;
    setSelectedFile(f);
    setSelectedFileName(f ? f.name : "");
  };

  const processSelectedFile = async () => {
    if (!selectedFile) {
      setToast("Pilih file CSV terlebih dahulu");
      setTimeout(() => setToast(null), 1600);
      return;
    }
    const text = await selectedFile.text();
    const parsed = parseCsv(text);
    if (!parsed.headers.length) {
      setToast("File tidak valid");
      setTimeout(() => setToast(null), 1800);
      return;
    }

    // Expect header to contain at least nim
    const hLower = parsed.headers.map((h) => h.toLowerCase());
    const nimIdx = hLower.indexOf("nim");
    if (nimIdx === -1) {
      setToast("Header harus mengandung kolom 'nim'");
      setTimeout(() => setToast(null), 2200);
      return;
    }

    // update data state for matching nims
    setData((prev) => {
      const next = { ...prev };
      for (const r of parsed.rows) {
        const nim = r[parsed.headers[nimIdx]]?.trim();
        if (!nim) continue;
        const existing = { ...(next[nim] || {}) };
        // for each komponen key, try to read by key or by label
        komponen.forEach((k) => {
          const valStr = r[k.key] ?? r[k.label] ?? "";
          if (valStr !== undefined && valStr !== "") {
            const v = Number(String(valStr).replace(/[^0-9.\-]/g, ""));
            if (!Number.isNaN(v)) existing[k.key] = v;
          }
        });
        existing.akhir = computeFinalFromValues(existing, komponen);
        next[nim] = existing;
      }
      return next;
    });

    setToast("Data nilai diimpor dari CSV");
    setTimeout(() => setToast(null), 1800);
    // reset selection and close menu
    setSelectedFile(null);
    setSelectedFileName("");
    setShowExcelMenu(false);
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
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Input Nilai</h1>
              <p className="text-sm text-gray-600">{course} — {code}</p>

              {/* komponen pills removed — percentages shown per-column / per-input instead */}
          </div>
          {/* save button moved below the student data */}
        </div>

        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 relative">
            <div className="relative">
              <button
                onClick={() => setShowExcelMenu((v) => !v)}
                className="inline-flex items-center gap-2 p-2 rounded-full bg-blue-600 text-white text-xs hover:bg-blue-700"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Input Nilai dengan Excel
              </button>

              {showExcelMenu && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  {/* overlay */}
                  <div className="absolute inset-0 bg-black/30" onClick={() => setShowExcelMenu(false)} />

                  <div className="relative bg-white w-[min(96%,720px)] max-w-xl rounded shadow p-4 z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-sm text-gray-700">Silahkan Download File Form Excel dibawah ini</div>
                      <button onClick={() => setShowExcelMenu(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                    </div>

                    <div className="mb-3">
                      <button
                        onClick={() => {
                          downloadCsv();
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white text-sm hover:bg-green-600"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        Download Form Nilai Excel
                      </button>
                    </div>

                    <div className="text-xs text-gray-600 mb-2">Setelah file form excel berhasil anda download, Silahkan isi nilainya di kolom komponen nilai di excel tersebut. Setelah selesai mengisi, lalu upload kembali file excel tersebut ke form dibawah ini :</div>

                    <div className="grid grid-cols-3 gap-2 items-center mt-2">
                      <div className="col-span-2 flex items-center gap-2">
                        {/* hidden file input; opened by the Choose File button */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".csv,text/csv"
                          onChange={onFileSelect}
                          className="hidden"
                        />

                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-2 bg-white border rounded text-sm hover:bg-gray-50"
                        >
                          Choose File
                        </button>

                        <div className="text-xs text-gray-500">{selectedFileName || "No file chosen"}</div>
                      </div>

                      <div className="col-span-1">
                        <button onClick={processSelectedFile} className="px-3 py-2 bg-blue-600 text-white rounded border text-sm hover:bg-blue-700">Upload</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => navigate(`/dosen/set-komponen-nilai/${code}`)} className="inline-flex items-center gap-2 p-2 rounded-full bg-red-600 text-white text-xs hover:bg-red-700">
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
                  {komponen.map((k) => (
                    <th key={k.key} className="p-3 w-28">
                      <div className="flex items-center justify-between">
                        <span>{k.label}</span>
                        <span className="text-xs text-gray-500">{k.bobot}%</span>
                      </div>
                    </th>
                  ))}
                  <th className="p-3 w-32">Nilai Akhir</th>
                  <th className="p-3 w-28">Nilai Index</th>
                  <th className="p-3 w-28">Nilai Huruf</th>
                </tr>
              </thead>
              <tbody>
                {dummyStudents.map((s, i) => {
                  const row = data[s.nim] || { uas: 0, presensi: 0, akhir: 0, keterangan: "" };
                  const g = gradeFromScore(row.akhir ?? 0);
                  return (
                    <tr key={s.nim} className="border-t">
                      <td className="p-3 align-top">{i + 1}</td>
                      <td className="p-3 align-top">
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-gray-600">{s.nim}</div>
                      </td>
                      {komponen.map((k) => (
                        <td key={k.key} className="p-3 align-top">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={row[k.key] ?? 0}
                            onChange={(e) => update(s.nim, k.key, e.target.value)}
                            className="w-full px-2 py-1 border rounded-md"
                          />
                        </td>
                      ))}
                      <td className="p-3 align-top">{(row.akhir ?? 0).toFixed(2)}</td>
                      <td className="p-3 align-top">{(g?.index ?? 0).toFixed(2)}</td>
                      <td className="p-3 align-top">{g?.letter ?? "-"}</td>
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
              const g = gradeFromScore(row.akhir ?? 0);
              return (
                <div key={s.nim} className="bg-white rounded-xl p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-gray-600">{s.nim}</div>
                    </div>
                    {/* overall score display removed from card header per request */}
                  </div>

                  <div className="space-y-2">
                    {komponen.map((k) => (
                      <div key={k.key} className="grid grid-cols-3 gap-2 items-center">
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-600 mb-1">
                            {k.label} <span className="text-xs text-gray-500">({k.bobot}%)</span>
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={row[k.key] ?? 0}
                            onChange={(e) => update(s.nim, k.key, e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        </div>
                        <div className="col-span-1 text-right">
                          <div className="text-sm font-semibold">{(g?.index ?? 0).toFixed(2)}</div>
                          <div className="text-xs text-gray-600">{g?.letter ?? "-"}</div>
                        </div>
                      </div>
                    ))}
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
