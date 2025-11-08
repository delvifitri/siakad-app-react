import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DosenLayout from "../layouts/DosenLayout";
import { ArrowDownTrayIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ArrowLeftIcon from "../components/ArrowLeftIcon";

export function meta() {
  return [{ title: "Log Bimbingan - Siakad" }];
}

interface LogItem {
  id: string;
  pembimbing: 1 | 2;
  tanggalBimbingan: string;
  isi: string;
  approve: "Menunggu" | "Disetujui" | "Ditolak";
  tanggalInput: string;
}

const requestsByAngkatan: Record<number, Array<{ name: string; nim: string; topic: string; status: string; examType: 'sempro' | 'semhas' | 'pendadaran'; gradingStatus: 'belum_dinilai' | 'sudah_dinilai'; title?: string; examDate?: string; room?: string }>> = {
  2020: [
    { name: "Siti Aminah", nim: "202001234", topic: "Sistem Informasi Akademik", status: "disetujui", examType: "pendadaran", gradingStatus: "sudah_dinilai" },
    { name: "Ahmad Rahman", nim: "202001235", topic: "Implementasi Algoritma Machine Learning", status: "disetujui", examType: "semhas", gradingStatus: "belum_dinilai", title: "Aplikasi Mobile untuk Pembelajaran Daring", examDate: "2025-10-20", room: "Ruang B" },
    { name: "Dewi Sari", nim: "202001236", topic: "Pengujian Performa Aplikasi", status: "disetujui", examType: "semhas", gradingStatus: "belum_dinilai", title: "Sistem Manajemen Database Terintegrasi", examDate: "2025-10-25", room: "Ruang B" },
  ],
  2021: [
    { name: "Maya Sari", nim: "202101234", topic: "Bab 2 Tinjauan Pustaka", status: "proses", examType: "sempro", gradingStatus: "belum_dinilai", title: "Analisis Sentimen pada Media Sosial", examDate: "2025-11-10", room: "Ruang B" },
    { name: "Rudi Hartono", nim: "202101235", topic: "Metodologi Penelitian", status: "disetujui", examType: "pendadaran", gradingStatus: "sudah_dinilai" },
    { name: "Lina Putri", nim: "202101236", topic: "Optimasi Kode dan Algoritma", status: "disetujui", examType: "semhas", gradingStatus: "belum_dinilai", title: "Aplikasi E-Commerce dengan AI Recommendation", examDate: "2025-11-03", room: "Ruang B" },
  ],
  2022: [
    { name: "Nina Kusuma", nim: "202201234", topic: "Evaluasi dan Testing Sistem", status: "disetujui", examType: "semhas", gradingStatus: "belum_dinilai", title: "Sistem Prediksi Harga Saham dengan Big Data", examDate: "2025-11-05", room: "Ruang B" },
  ],
  2023: [
    { name: "Budi Santoso", nim: "202301234", topic: "Machine Learning untuk Prediksi", status: "proses", examType: "sempro", gradingStatus: "belum_dinilai", title: "Prediksi Penjualan Retail Menggunakan Machine Learning", examDate: "2025-11-08", room: "Ruang B" },
    { name: "Citra Rahma", nim: "202301235", topic: "Sistem Rekomendasi", status: "disetujui", examType: "pendadaran", gradingStatus: "sudah_dinilai" },
    { name: "Andi Wijaya", nim: "202301236", topic: "Integrasi API dan Testing", status: "disetujui", examType: "semhas", gradingStatus: "belum_dinilai", title: "Platform Learning Management System", examDate: "2025-11-18", room: "Ruang B" },
  ],
  2024: [
    { name: "Ani Lestari", nim: "202401234", topic: "Bab 2 Tinjauan Pustaka", status: "proses", examType: "sempro", gradingStatus: "belum_dinilai", title: "Sistem Rekomendasi Musik Berbasis Machine Learning", examDate: "2025-11-15", room: "Ruang B" },
    { name: "Dedi Kurniawan", nim: "202401235", topic: "Pengembangan Web App", status: "menunggu", examType: "pendadaran", gradingStatus: "sudah_dinilai" },
    { name: "Rina Amelia", nim: "202401236", topic: "Deployment dan Maintenance", status: "disetujui", examType: "semhas", gradingStatus: "belum_dinilai", title: "Aplikasi Monitoring Kesehatan Pasien", examDate: "2025-11-20", room: "Ruang B" },
  ],
  2025: [
    { name: "Fajar Setiawan", nim: "202501234", topic: "IoT untuk Monitoring", status: "proses", examType: "sempro", gradingStatus: "belum_dinilai", title: "Sistem Monitoring Lingkungan Berbasis IoT", examDate: "2025-11-12", room: "Ruang B" },
    { name: "Sari Indah", nim: "202501235", topic: "Debugging dan Error Handling", status: "disetujui", examType: "semhas", gradingStatus: "belum_dinilai", title: "Sistem Informasi Geografis untuk Pariwisata", examDate: "2025-11-22", room: "Ruang B" },
  ],
};

export default function DosenLogBimbingan() {
  const { nim } = useParams();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(4);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [detailLogId, setDetailLogId] = useState<string | null>(null);
  const [student, setStudent] = useState<{ name: string; nim: string } | null>(null);
  const [selectedLogs, setSelectedLogs] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter logs based on search query
  const filteredLogs = logs.filter((log) =>
    log.isi.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.approve.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `pembimbing ${log.pembimbing}`.includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!nim) return;

    // Find student data
    const allStudents = Object.values(requestsByAngkatan).flat();
    const foundStudent = allStudents.find(s => s.nim === nim);
    if (foundStudent) {
      setStudent({ name: foundStudent.name, nim: foundStudent.nim });
    }

    // Load log data
    try {
      const raw = localStorage.getItem("logBimbinganData");
      if (raw) {
        setLogs(JSON.parse(raw));
      } else {
        // Initialize with sample data if no logs exist
        const sampleLogs: LogItem[] = [
          {
            id: "log-001",
            pembimbing: 1,
            tanggalBimbingan: "2025-10-15",
            isi: "Mahasiswa telah menyelesaikan bab 1 dengan baik. Perlu diperbaiki bagian metodologi penelitian agar lebih detail. Selain itu, bagian latar belakang masih kurang fokus pada gap penelitian yang ingin ditangani — mohon tambahkan minimal tiga referensi terbaru dan jelaskan bagaimana kontribusi penelitian ini berbeda dari studi sebelumnya. Juga sarankan agar mahasiswa menyusun ulang tujuan penelitian menjadi tujuan umum dan tiga tujuan khusus agar lebih terukur.",
            approve: "Disetujui",
            tanggalInput: "2025-10-15T10:30:00Z"
          },
          {
            id: "log-002",
            pembimbing: 2,
            tanggalBimbingan: "2025-10-20",
            isi: "Presentasi bab 2 sudah cukup baik. Mahasiswa diminta untuk menambahkan referensi lebih banyak pada tinjauan pustaka. Perlu juga memperjelas alur argumentasi: setiap subbab harus diakhiri dengan rangkuman singkat yang menghubungkan teori dengan hipotesis yang diajukan. Selain itu, periksa kembali kutipan dan format referensi agar konsisten dengan gaya sitasi yang dipilih.",
            approve: "Disetujui",
            tanggalInput: "2025-10-20T14:15:00Z"
          },
          {
            id: "log-003",
            pembimbing: 1,
            tanggalBimbingan: "2025-10-25",
            isi: "Bab 3 masih perlu diperbaiki. Diagram alur aplikasi kurang jelas dan perlu ditambahkan penjelasan lebih detail. Tolong sertakan diagram konteks, diagram alur data, dan penjelasan singkat untuk setiap komponen sistem. Selain itu jelaskan asumsi yang digunakan dalam perancangan, batasan sistem, dan skenario pengujian yang direncanakan sehingga implementasi dan evaluasi dapat berjalan sesuai rencana.",
            approve: "Menunggu",
            tanggalInput: "2025-10-25T09:45:00Z"
          },
          {
            id: "log-004",
            pembimbing: 2,
            tanggalBimbingan: "2025-11-01",
            isi: "Proposal sudah cukup lengkap. Mahasiswa akan segera mengumpulkan proposal final setelah revisi kecil pada bagian kesimpulan. Mohon perhatikan penyusunan ringkasan hasil yang realistis sesuai metodologi yang diusulkan, dan tambahkan rencana timeline yang lebih rinci untuk 3 bulan ke depan. Jika memungkinkan, siapkan pula lampiran berisi daftar dataset dan contoh format pengumpulan data.",
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
  }, [nim]);

  function updateLogStatus(id: string, status: "Disetujui" | "Ditolak" | "Menunggu") {
    setLogs((prev) => {
      const next = prev.map((x) => (x.id === id ? { ...x, approve: status } : x));
      try {
        localStorage.setItem("logBimbinganData", JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  function handleLogSelection(id: string, checked: boolean) {
    setSelectedLogs((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }

  function handleSelectAll() {
    const visibleLogIds = filteredLogs.slice(0, visibleCount).map(log => log.id);
    const allSelected = visibleLogIds.every(id => selectedLogs.has(id));
    
    if (allSelected) {
      // Unselect all visible logs
      setSelectedLogs((prev) => {
        const newSet = new Set(prev);
        visibleLogIds.forEach(id => newSet.delete(id));
        return newSet;
      });
    } else {
      // Select all visible logs
      setSelectedLogs((prev) => {
        const newSet = new Set(prev);
        visibleLogIds.forEach(id => newSet.add(id));
        return newSet;
      });
    }
  }

  function updateSelectedLogsStatus(status: "Disetujui" | "Ditolak" | "Menunggu") {
    setLogs((prev) => {
      const next = prev.map((x) => 
        selectedLogs.has(x.id) ? { ...x, approve: status } : x
      );
      try {
        localStorage.setItem("logBimbinganData", JSON.stringify(next));
      } catch {}
      return next;
    });
    setSelectedLogs(new Set()); // Clear selection after action
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
      const name = `log-bimbingan-${student?.nim ?? "all"}.csv`;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      // ignore
    }
  }

  // IntersectionObserver to auto-load more when sentinel is visible
  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setVisibleCount((c) => {
            if (c >= filteredLogs.length) return c;
            return Math.min(c + 4, filteredLogs.length);
          });
        }
      });
    }, { root: null, rootMargin: '200px', threshold: 0.1 });
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [sentinelRef, filteredLogs.length]);

  if (!student) {
    return (
      <DosenLayout bgImage="/bg simple.png">
        <section className="px-4 pt-6">
          <div className="text-center text-gray-600">Mahasiswa tidak ditemukan</div>
        </section>
      </DosenLayout>
    );
  }

  return (
    <DosenLayout bgImage="/bg simple.png">
      <section className="px-4 pt-6 pb-24">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Log Bimbingan</h1>
            <p className="text-sm text-gray-600">{student.name} • {student.nim}</p>
          </div>
        </div>

        {logs.length > 0 && (
          <div className="mb-4">
            <div className="relative bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari log bimbingan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-transparent focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>
        )}

        {/* Buttons (Pilih Semua, Download CSV) moved here */}
        <div className="mb-4 flex items-center gap-4">
          {logs.length > 0 && (
            <>
              <button
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm bg-gray-600 text-white hover:bg-gray-700 shadow-sm"
                onClick={handleSelectAll}
              >
                {filteredLogs.slice(0, visibleCount).every(log => selectedLogs.has(log.id)) ? 'Batal Pilih Semua' : 'Pilih Semua'}
              </button>
              
              <button
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                onClick={downloadCsv}
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Download CSV
              </button>
            </>
          )}
        </div>

        <div className="space-y-3">
          {logs.length === 0 ? (
            <div className="text-sm text-gray-600 bg-white/60 rounded-xl border border-gray-200 p-4">Belum ada catatan bimbingan.</div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-sm text-gray-600 bg-white/60 rounded-xl border border-gray-200 p-4">
              Tidak ada log yang cocok dengan pencarian "{searchQuery}"
            </div>
          ) : (
            <>
              {filteredLogs.slice(0, visibleCount).map((item) => {
                const isExpanded = detailLogId === item.id;
                const preview = isExpanded ? item.isi : (item.isi.length > 120 ? item.isi.slice(0, 120) + '…' : item.isi);
                return (
                <div key={item.id} className="p-4 rounded-xl border border-gray-200 bg-white/60 shadow-sm">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedLogs.has(item.id)}
                      onChange={(e) => handleLogSelection(item.id, e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                          <span className="px-2 py-0.5 rounded-full text-xs border bg-blue-50 text-blue-700 border-blue-200">Pembimbing {item.pembimbing}</span>
                          <div className="inline-flex items-center gap-1 text-xs text-gray-600">{new Date(item.tanggalBimbingan).toLocaleDateString("id-ID")}</div>
                        </div>
                        {/* Move status badge to the top-right (swapped) */}
                        <div className="flex flex-col items-end gap-2">
                          <span className={`h-fit px-2 py-0.5 rounded-full text-xs border ${
                            item.approve === "Disetujui"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : item.approve === "Ditolak"
                              ? "bg-red-100 text-red-700 border-red-200"
                              : "bg-yellow-100 text-yellow-700 border-yellow-200"
                          }`}>{item.approve}</span>
                        </div>
                      </div>
                      <div
                        id={`log-content-${item.id}`}
                        className="mt-2 text-sm text-gray-800 whitespace-pre-wrap"
                        style={{
                          maxHeight: isExpanded ? '1000px' : '4.5rem',
                          overflow: 'hidden',
                          transition: 'max-height 220ms ease'
                        }}
                      >
                        {preview}
                      </div>
                      <div className="mt-2">
                        <button
                          onClick={() => setDetailLogId(isExpanded ? null : item.id)}
                          className="text-orange-500 text-sm hover:underline"
                          aria-expanded={isExpanded}
                          aria-controls={`log-content-${item.id}`}
                        >
                          {isExpanded ? 'Sembunyikan' : 'Detail'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )})}
              
              {/* Button bulk action dipindah ke bawah */}
              <div className="mt-4 flex justify-start">
                <div className="flex items-center gap-2">
                  {/** Buttons always visible; no background card. Show selected count (no slash). */}
                  <button
                    className={`px-3 py-2 rounded-full text-white text-sm ${selectedLogs.size === 0 ? 'bg-emerald-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                    onClick={() => updateSelectedLogsStatus("Disetujui")}
                    disabled={selectedLogs.size === 0}
                    aria-disabled={selectedLogs.size === 0}
                  >
                    Approve{selectedLogs.size > 0 ? ` (${selectedLogs.size})` : ''}
                  </button>
                  <button
                    className={`px-3 py-2 rounded-full text-white text-sm ${selectedLogs.size === 0 ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                    onClick={() => updateSelectedLogsStatus("Ditolak")}
                    disabled={selectedLogs.size === 0}
                    aria-disabled={selectedLogs.size === 0}
                  >
                    Tolak{selectedLogs.size > 0 ? ` (${selectedLogs.size})` : ''}
                  </button>
                  <button
                    className={`px-3 py-2 rounded-full text-white text-sm ${selectedLogs.size === 0 ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    onClick={() => updateSelectedLogsStatus("Menunggu")}
                    disabled={selectedLogs.size === 0}
                    aria-disabled={selectedLogs.size === 0}
                  >
                    Reset{selectedLogs.size > 0 ? ` (${selectedLogs.size})` : ''}
                  </button>
                </div>
              </div>
              
              {visibleCount < filteredLogs.length && (
                <div className="mt-3 flex justify-center">
                  <button
                    className="px-3 py-2 rounded-full border border-gray-300 text-sm bg-white hover:bg-gray-50"
                    onClick={() => setVisibleCount((c) => Math.min(c + 4, filteredLogs.length))}
                  >
                    Muat lagi ({Math.min(visibleCount + 4, filteredLogs.length)}/{filteredLogs.length})
                  </button>
                </div>
              )}
              {/* sentinel for infinite scroll */}
              <div ref={sentinelRef} />
            </>
          )}
        </div>
      </section>
      {/* Details are rendered inline on each card; modal removed. */}
    </DosenLayout>
  );
}