import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DosenLayout from "../layouts/DosenLayout";
import { ChatBubbleLeftRightIcon, CheckCircleIcon, ClockIcon, ArrowDownTrayIcon, UserIcon, EyeIcon, MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export function meta() {
  return [{ title: "Bimbingan TA (Dosen) - Siakad" }];
}

const angkatanYears = [2020, 2021, 2022, 2023, 2024, 2025];

const requestsByAngkatan: Record<number, Array<{ name: string; nim: string; topic: string; status: string }>> = {
  2020: [
    { name: "Siti Aminah", nim: "202001234", topic: "Sistem Informasi Akademik", status: "disetujui" },
    { name: "Ahmad Rahman", nim: "202001235", topic: "Aplikasi Mobile E-Learning", status: "proses" },
  ],
  2021: [
    { name: "Maya Sari", nim: "202101234", topic: "Bab 2 Tinjauan Pustaka", status: "menunggu" },
    { name: "Rudi Hartono", nim: "202101235", topic: "Metodologi Penelitian", status: "disetujui" },
  ],
  2022: [
    { name: "Nina Kusuma", nim: "202201234", topic: "Analisis Data Big Data", status: "proses" },
  ],
  2023: [
    { name: "Budi Santoso", nim: "202301234", topic: "Machine Learning untuk Prediksi", status: "menunggu" },
    { name: "Citra Rahma", nim: "202301235", topic: "Sistem Rekomendasi", status: "disetujui" },
  ],
  2024: [
    { name: "Ani Lestari", nim: "202401234", topic: "Bab 2 Tinjauan Pustaka", status: "menunggu" },
    { name: "Dedi Kurniawan", nim: "202401235", topic: "Pengembangan Web App", status: "proses" },
  ],
  2025: [
    { name: "Fajar Setiawan", nim: "202501234", topic: "IoT untuk Monitoring", status: "menunggu" },
  ],
};

export default function DosenBimbingan() {
  const navigate = useNavigate();
  const [showLog, setShowLog] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<{ name: string; nim: string } | null>(null);
  const [logs, setLogs] = useState<Array<any>>([]);
  const [visibleCount, setVisibleCount] = useState<number>(5);
  const [showProposal, setShowProposal] = useState(false);
  const [proposal, setProposal] = useState<null | { title?: string; fileName?: string; dataUrl?: string }> (null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAngkatan, setSelectedAngkatan] = useState(2024);
  const [angkatanDropdownOpen, setAngkatanDropdownOpen] = useState(false);
  const [angkatanSearch, setAngkatanSearch] = useState('');

  useEffect(() => {
    try {
      const role = localStorage.getItem("userRole");
      if (role !== "dosen") navigate("/", { replace: true });
    } catch {}
  }, [navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const dropdown = document.querySelector('[data-dropdown="angkatan"]');
      if (angkatanDropdownOpen && dropdown && !dropdown.contains(target)) {
        setAngkatanDropdownOpen(false);
        setAngkatanSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [angkatanDropdownOpen]);

  // Load log data when modal opens
  useEffect(() => {
    if (!showLog) return;
    try {
      const raw = localStorage.getItem("logBimbinganData");
      if (raw) {
        setLogs(JSON.parse(raw));
      } else {
        // Initialize with sample data if no logs exist
        const sampleLogs = [
          {
            id: "log-001",
            pembimbing: "1",
            tanggalBimbingan: "2025-10-15",
            isi: "Mahasiswa telah menyelesaikan bab 1 dengan baik. Perlu diperbaiki bagian metodologi penelitian agar lebih detail.",
            approve: "Disetujui",
            tanggalInput: "2025-10-15T10:30:00Z"
          },
          {
            id: "log-002",
            pembimbing: "2",
            tanggalBimbingan: "2025-10-20",
            isi: "Presentasi bab 2 sudah cukup baik. Mahasiswa diminta untuk menambahkan referensi lebih banyak pada tinjauan pustaka.",
            approve: "Disetujui",
            tanggalInput: "2025-10-20T14:15:00Z"
          },
          {
            id: "log-003",
            pembimbing: "1",
            tanggalBimbingan: "2025-10-25",
            isi: "Bab 3 masih perlu diperbaiki. Diagram alur aplikasi kurang jelas dan perlu ditambahkan penjelasan lebih detail.",
            approve: "Menunggu",
            tanggalInput: "2025-10-25T09:45:00Z"
          },
          {
            id: "log-004",
            pembimbing: "2",
            tanggalBimbingan: "2025-11-01",
            isi: "Proposal sudah cukup lengkap. Mahasiswa akan segera mengumpulkan proposal final setelah revisi kecil pada bagian kesimpulan.",
            approve: "Disetujui",
            tanggalInput: "2025-11-01T16:20:00Z"
          }
        ];
        localStorage.setItem("logBimbinganData", JSON.stringify(sampleLogs));
        setLogs(sampleLogs);
      }
    } catch {
      setLogs([]);
    }
    setVisibleCount(5);
  }, [showLog]);

  function updateLogStatus(id: string, status: "Disetujui" | "Ditolak" | "Menunggu") {
    setLogs((prev) => {
      const next = prev.map((x: any) => (x.id === id ? { ...x, approve: status } : x));
      try {
        localStorage.setItem("logBimbinganData", JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  function loadProposalFor(nim: string) {
    try {
      const rawSpecific = localStorage.getItem(`proposal-${nim}`);
      if (rawSpecific) {
        const parsed = JSON.parse(rawSpecific);
        setProposal(parsed);
        return;
      }
      const raw = localStorage.getItem("proposalData");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const found = parsed.find((p: any) => p.nim === nim || p.nim === String(nim));
          if (found) { setProposal(found); return; }
        } else if (parsed && (parsed.nim === nim || parsed.nim === String(nim))) {
          setProposal(parsed); return;
        }
      }
    } catch {}
    setProposal(null);
  }

  function escapeCsv(field: any) {
    if (field === null || field === undefined) return "";
    const s = String(field);
    if (s.includes("\"") || s.includes(",") || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  }

  function downloadCsv() {
    try {
      const headers = ["id", "pembimbing", "tanggalBimbingan", "isi", "approve", "tanggalInput"];
      const rows = [headers.join(",")];
      for (const it of logs) {
        const row = [it.id, it.pembimbing, it.tanggalBimbingan, it.isi, it.approve, it.tanggalInput].map(escapeCsv).join(",");
        rows.push(row);
      }
      const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const name = `log-bimbingan-${currentStudent?.nim ?? "all"}.csv`;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      // ignore
    }
  }

  const filteredAngkatanOptions = angkatanYears.filter(year =>
    year.toString().includes(angkatanSearch)
  );

  const requestsForSelectedAngkatan = requestsByAngkatan[selectedAngkatan] ?? [];
  const filteredRequests = requestsForSelectedAngkatan.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DosenLayout bgImage="/bg simple.png">
      <section className="px-4 pt-6 pb-24">
  <h1 className="text-xl font-bold text-gray-900">Bimbingan TA</h1>
  <p className="text-sm text-gray-600 mt-1">Kelola bimbingan tugas akhir mahasiswa.</p>

        {/* Angkatan Selection */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Angkatan</label>
          <div className="relative">
            <button
              onClick={() => setAngkatanDropdownOpen(!angkatanDropdownOpen)}
              className="w-full px-3 py-2 border rounded-full bg-white shadow-sm text-sm text-left flex items-center justify-between hover:bg-gray-50"
            >
              <span>{selectedAngkatan}</span>
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            </button>
            {angkatanDropdownOpen && (
              <div data-dropdown="angkatan" className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="Cari angkatan..."
                    value={angkatanSearch}
                    onChange={(e) => setAngkatanSearch(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredAngkatanOptions.map((year) => (
                    <button
                      key={year}
                      onClick={() => {
                        setSelectedAngkatan(year);
                        setAngkatanDropdownOpen(false);
                        setAngkatanSearch('');
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search input */}
        <div className="mt-4 max-w-md">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari mahasiswa — nama, NIM, atau topik"
              className="pl-10 pr-3 py-2 border rounded-full w-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {filteredRequests.map((r, idx) => (
            <div key={idx} className="bg-white/60 rounded-xl border border-gray-200 p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0"><UserIcon className="w-5 h-5"/></div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-gray-900">{r.name} <span className="text-xs text-gray-500">({r.nim})</span></div>
                    <div className="text-xs text-gray-600">Topik: {r.topic}</div>
                    <div className="mt-2">
                      {r.status === "disetujui" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-emerald-100 text-emerald-700"><CheckCircleIcon className="w-4 h-4"/> Disetujui</span>
                      ) : r.status === "proses" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-700"><ClockIcon className="w-4 h-4"/> Proses</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-amber-100 text-amber-700"><ClockIcon className="w-4 h-4"/> Menunggu</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-3 flex-shrink-0">
                  <button
                    className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-xs bg-blue-600 text-white hover:bg-blue-700 whitespace-nowrap"
                    onClick={() => {
                      setCurrentStudent({ name: r.name, nim: r.nim });
                      setShowLog(true);
                    }}
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    Lihat Log
                  </button>
                  <button
                    className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-xs bg-green-600 text-white hover:bg-green-700 whitespace-nowrap"
                    onClick={() => {
                      setCurrentStudent({ name: r.name, nim: r.nim });
                      loadProposalFor(r.nim);
                      setShowProposal(true);
                    }}
                  >
                    <EyeIcon className="w-4 h-4" />
                    Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Log modal for selected mahasiswa */}
      {showLog && currentStudent && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowLog(false)} />
          <div className="relative bg-white rounded-2xl w-full sm:max-w-2xl mx-4 p-4 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-gray-900">Log Bimbingan — {currentStudent.name}</div>
                <div className="text-xs text-gray-600">NIM: {currentStudent.nim}</div>
                <div className="mt-2">
                  <button
                    className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                    onClick={downloadCsv}
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    <span className="sr-only">Download CSV</span>
                    <span className="ml-1">Download</span>
                  </button>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button className="text-sm text-gray-600" onClick={() => setShowLog(false)}>Tutup</button>
              </div>
            </div>
            <div className="mt-3 space-y-3">
              {logs.length === 0 ? (
                <div className="text-sm text-gray-600">Belum ada catatan bimbingan.</div>
              ) : (
                <>
                  <div
                    className="space-y-3"
                    style={{
                      maxHeight: "60vh",
                      overflow: "auto",
                      WebkitOverflowScrolling: "touch",
                      paddingRight: 6,
                    }}
                  >
                    {logs.slice(0, visibleCount).map((item: any) => (
                  <div key={item.id} className="p-3 rounded-xl border border-gray-200 bg-white/80 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="px-2 py-0.5 rounded-full text-xs border bg-blue-50 text-blue-700 border-blue-200">Pembimbing {item.pembimbing}</span>
                        <div className="inline-flex items-center gap-1 text-xs text-gray-600">{new Date(item.tanggalBimbingan).toLocaleDateString("id-ID")}</div>
                      </div>
                      <span className={`h-fit px-2 py-0.5 rounded-full text-xs border ${
                        item.approve === "Disetujui"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : item.approve === "Ditolak"
                          ? "bg-red-100 text-red-700 border-red-200"
                          : "bg-yellow-100 text-yellow-700 border-yellow-200"
                      }`}>{item.approve}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-800 whitespace-pre-wrap">{item.isi}</div>
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <button
                        className="px-2 py-1 rounded-full text-white bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => updateLogStatus(item.id, "Disetujui")}
                      >
                        Approve
                      </button>
                      <button
                        className="px-2 py-1 rounded-full text-white bg-red-600 hover:bg-red-700"
                        onClick={() => updateLogStatus(item.id, "Ditolak")}
                      >
                        Tolak
                      </button>
                      <button
                        className="px-2 py-1 rounded-full border border-gray-300 text-gray-700"
                        onClick={() => updateLogStatus(item.id, "Menunggu")}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                    ))}
                  </div>
                  {visibleCount < logs.length && (
                    <div className="mt-3 flex justify-center">
                      <button
                        className="px-3 py-1 rounded-full border border-gray-300 text-sm bg-white"
                        onClick={() => setVisibleCount((c) => Math.min(c + 5, logs.length))}
                      >
                        Muat lagi ({Math.min(visibleCount + 5, logs.length)}/{logs.length})
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Proposal modal */}
      {showProposal && currentStudent && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowProposal(false)} />
          <div className="relative bg-white rounded-2xl w-full sm:max-w-lg mx-4 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">Detail Proposal — {currentStudent.name}</div>
                <div className="text-xs text-gray-600">NIM: {currentStudent.nim}</div>
              </div>
              <button className="text-sm text-gray-600" onClick={() => setShowProposal(false)}>Tutup</button>
            </div>
            <div className="mt-3 text-sm">
              {!proposal ? (
                <div className="text-gray-600">Belum ada proposal yang diunggah oleh mahasiswa ini.</div>
              ) : (
                <div className="space-y-3">
                  {proposal.title && (<div><div className="text-xs text-gray-600">Judul</div><div className="font-medium">{proposal.title}</div></div>)}
                  {proposal.fileName && (<div><div className="text-xs text-gray-600">Berkas</div><div className="font-medium">{proposal.fileName}</div></div>)}
                  {proposal.dataUrl ? (
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Preview</div>
                      <div className="border rounded-md overflow-hidden">
                        <iframe src={proposal.dataUrl} title="proposal-preview" className="w-full h-64" />
                      </div>
                      <div className="mt-2">
                        <a href={proposal.dataUrl} download={proposal.fileName || `proposal-${currentStudent.nim}.pdf`} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600 text-white">Download</a>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DosenLayout>
  );
}
