import MobileLayout from "../layouts/MobileLayout";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import jsPDF from "jspdf";

// Tipe data log bimbingan
interface LogItem {
  id: string;
  pembimbing: 1 | 2;
  tanggalBimbingan: string; // ISO date
  isi: string;
  approve: "Menunggu" | "Disetujui" | "Ditolak";
  tanggalInput: string; // ISO date
}

const STORAGE_KEY = "logBimbinganData";

export default function LogBimbingan() {
  const navigate = useNavigate();
  // Helper to create a single approved seed item (dummy)
  function createApprovedSeed(): LogItem {
    const offsetDays = 2 + Math.floor(Math.random() * 5); // 2..6 hari lalu
    const d = new Date();
    d.setDate(d.getDate() - offsetDays);
    const toDateStr = (x: Date) => x.toISOString().slice(0, 10);
    const samples = [
      "Revisi Bab 1 dan 2. Perbaiki sitasi dan tambahkan 1 referensi terbaru.",
      "Perbaiki latar belakang: fokuskan masalah dan tambahkan contoh kasus kampus.",
      "Update diagram alur sistem dan jelaskan tiap komponen secara singkat.",
      "Samakan format sitasi (APA) dan rapikan daftar pustaka.",
      "Tinjau ulang rumusan masalah agar lebih terukur dan spesifik.",
    ];
    const isi = samples[Math.floor(Math.random() * samples.length)];
    const pemb = (Math.random() < 0.5 ? 1 : 2) as 1 | 2;
    return {
      id: Math.random().toString(36).slice(2),
      pembimbing: pemb,
      tanggalBimbingan: toDateStr(d),
      isi,
      approve: "Disetujui",
      tanggalInput: d.toISOString(),
    };
  }

  function createPendingSeed(): LogItem {
    const offsetDays = 0 + Math.floor(Math.random() * 3); // 0..2 hari lalu / hari ini
    const d = new Date();
    d.setDate(d.getDate() - offsetDays);
    const toDateStr = (x: Date) => x.toISOString().slice(0, 10);
    const samples = [
      "Diskusi metodologi dan rencana eksperimen minggu depan.",
      "Konsultasi terkait pemilihan dataset dan skenario uji.",
      "Menyusun outline Bab 3 dan pembagian sub-bab.",
    ];
    const isi = samples[Math.floor(Math.random() * samples.length)];
    const pemb = (Math.random() < 0.5 ? 1 : 2) as 1 | 2;
    return {
      id: Math.random().toString(36).slice(2),
      pembimbing: pemb,
      tanggalBimbingan: toDateStr(d),
      isi,
      approve: "Menunggu",
      tanggalInput: d.toISOString(),
    };
  }
  const [pembimbing, setPembimbing] = useState<1 | 2>(1);
  const [tanggalBimbingan, setTanggalBimbingan] = useState<string>(new Date().toISOString().slice(0, 10));
  const [isi, setIsi] = useState<string>("");
  const [data, setData] = useState<LogItem[]>([]);
  const [filterPembimbing, setFilterPembimbing] = useState<0 | 1 | 2>(0); // 0=semua
  const [query, setQuery] = useState<string>("");
  const [editState, setEditState] = useState<{ open: boolean; id: string | null; isi: string; tanggal: string }>({
    open: false,
    id: null,
    isi: "",
    tanggal: new Date().toISOString().slice(0, 10),
  });
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const INITIAL_COUNT = 3;
  const LOAD_MORE_COUNT = 3;
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_COUNT);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setData(parsed as LogItem[]);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // ignore
    }
  }, [data]);

  // Seed more dummy data when empty so infinite scroll/loading is visible
  useEffect(() => {
    if (data.length === 0) {
      const items: LogItem[] = [];
      const total = 15; // tampilkan lebih banyak agar terlihat proses load
      for (let i = 0; i < total; i++) {
        items.push(i % 2 === 0 ? createApprovedSeed() : createPendingSeed());
      }
      setData(items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.length]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data
      .filter((d) => (filterPembimbing === 0 ? true : d.pembimbing === filterPembimbing))
      .filter((d) => {
        if (!q) return true;
        const hay = `${d.isi}\nPembimbing ${d.pembimbing}\n${d.approve}`.toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => (a.tanggalInput < b.tanggalInput ? 1 : -1));
  }, [data, filterPembimbing, query]);

  // (Grouping removed as per request; display a flat list instead)
  // Reset visible count whenever filter/search changes
  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [filterPembimbing, query, data.length]);

  // Infinite scroll: load more when sentinel comes into view
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !isLoadingMore && visibleCount < filtered.length) {
          setIsLoadingMore(true);
          // Defer to next tick to avoid rapid multiple increments
          // Tambah sedikit jeda agar terlihat state loading
          setTimeout(() => {
            setVisibleCount((c) => Math.min(c + LOAD_MORE_COUNT, filtered.length));
            setIsLoadingMore(false);
          }, 600);
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [filtered.length, visibleCount, isLoadingMore]);

  const visibleItems = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  function onSubmit() {
    if (!isi.trim()) return;
    const nowIso = new Date().toISOString();
    const item: LogItem = {
      id: Math.random().toString(36).slice(2),
      pembimbing,
      tanggalBimbingan,
      isi: isi.trim(),
      approve: "Menunggu",
      tanggalInput: nowIso,
    };
    setData((prev) => [item, ...prev]);
    setIsi("");
    setTanggalBimbingan(new Date().toISOString().slice(0, 10));
    setPembimbing(1);
  }

  function formatDate(iso: string) {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return iso;
    }
  }

  function exportPdf() {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const marginX = 40;
    const marginY = 48;
    let y = marginY;

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Riwayat Log Bimbingan", marginX, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const sub = `Dibuat: ${new Date().toLocaleString("id-ID")}  |  Filter: ${filterPembimbing === 0 ? "Semua Pembimbing" : `Pembimbing ${filterPembimbing}`}  |  Pencarian: ${query || "-"}`;
    y += 18;
    const subLines = doc.splitTextToSize(sub, pageWidth - marginX * 2);
    doc.text(subLines, marginX, y);
    y += subLines.length * 14 + 6;

    // Draw a line
    doc.setDrawColor(200);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 16;

    const addFooter = () => {
      const footerY = pageHeight - 20;
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text(`Halaman ${doc.getNumberOfPages()}`, pageWidth - marginX, footerY, { align: "right" });
      doc.setTextColor(0);
    };

    const ensureSpace = (needed = 40) => {
      if (y + needed > pageHeight - marginY) {
        addFooter();
        doc.addPage();
        y = marginY;
      }
    };

    if (filtered.length === 0) {
      doc.setFontSize(12);
      doc.text("Tidak ada data sesuai filter.", marginX, y);
    } else {
      // Use same grouping used in UI
      const map = new Map<string, { label: string; items: typeof filtered }>();
      for (const it of filtered) {
        const d = new Date(it.tanggalInput);
        const label = d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
        const arr = map.get(label) ?? [];
        if (!map.has(label)) map.set(label, { label, items: [] as any });
        (map.get(label)!.items as any).push(it);
      }
      const groups = Array.from(map.values());

      for (const g of groups) {
        ensureSpace(28);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(g.label, marginX, y);
        y += 14;
        doc.setFont("helvetica", "normal");

        for (const item of g.items) {
          ensureSpace(64);
          // Title line with chips-like info
          const meta = `Pembimbing ${item.pembimbing}  •  Tgl Bimbingan: ${formatDate(item.tanggalBimbingan)}  •  Tgl Input: ${formatDate(item.tanggalInput)}  •  Status: ${item.approve}`;
          doc.setFontSize(10);
          const metaLines = doc.splitTextToSize(meta, pageWidth - marginX * 2);
          doc.text(metaLines, marginX, y);
          y += metaLines.length * 13 + 4;

          // Isi Bimbingan (boxed)
          const boxWidth = pageWidth - marginX * 2;
          const isiLines = doc.splitTextToSize(item.isi, boxWidth - 16);
          const boxHeight = isiLines.length * 14 + 16;
          ensureSpace(boxHeight + 16);
          doc.setDrawColor(230);
          doc.setFillColor(255, 249, 235); // amber-50
          doc.roundedRect(marginX, y, boxWidth, boxHeight, 6, 6, "FD");
          doc.setTextColor(33);
          doc.text(isiLines, marginX + 8, y + 12);
          doc.setTextColor(0);
          y += boxHeight + 12;
        }
      }
    }

    addFooter();
    doc.save("riwayat-bimbingan.pdf");
  }

  return (
    <MobileLayout title="Log Bimbingan" bgImage="/bg simple.png">
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <button
            aria-label="Kembali"
            title="Kembali"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            onClick={() => navigate(-1)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M10.03 4.97a.75.75 0 010 1.06L5.81 10.25H20a.75.75 0 010 1.5H5.81l4.22 4.22a.75.75 0 11-1.06 1.06l-5.5-5.5a.75.75 0 010-1.06l5.5-5.5a.75.75 0 011.06 0z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Log Bimbingan</h1>
        </div>

        {/* Form input */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
          <div className="text-lg font-semibold text-gray-900">Tambah Catatan Bimbingan</div>
          <div className="mt-3 grid grid-cols-1 gap-3 text-sm">
            <div>
              <label className="block text-xs text-gray-700 mb-1">Pembimbing</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`px-3 py-1.5 rounded-full text-sm ${pembimbing === 1 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
                  onClick={() => setPembimbing(1)}
                >
                  Pembimbing 1
                </button>
                <button
                  type="button"
                  className={`px-3 py-1.5 rounded-full text-sm ${pembimbing === 2 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
                  onClick={() => setPembimbing(2)}
                >
                  Pembimbing 2
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-700 mb-1">Tanggal Bimbingan</label>
              <input
                type="date"
                value={tanggalBimbingan}
                onChange={(e) => setTanggalBimbingan(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-700 mb-1">Isi Bimbingan</label>
              <textarea
                value={isi}
                onChange={(e) => setIsi(e.target.value)}
                rows={4}
                placeholder="Tulis ringkasan bimbingan..."
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={onSubmit}
              className={`px-4 py-2 rounded-full text-white ${isi.trim() ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-400"}`}
              disabled={!isi.trim()}
            >
              Simpan
            </button>
          </div>
        </div>

        {/* Filter & List */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="text-lg font-semibold text-gray-900">Riwayat Bimbingan</div>
            <button
              type="button"
              onClick={exportPdf}
              className="inline-flex items-center gap-1 px-3 h-8 rounded-full bg-orange-500 text-white hover:bg-orange-600 shrink-0 shadow-sm"
              title="Download PDF"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v7.69l2.22-2.22a.75.75 0 111.06 1.06l-3.5 3.5a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 111.06-1.06l2.22 2.22V4.5A.75.75 0 0112 3.75zm-6 12a.75.75 0 01.75.75v1A1.5 1.5 0 008.25 19h7.5a1.5 1.5 0 001.5-1.5v-1a.75.75 0 011.5 0v1A3 3 0 0115.75 21h-7.5A3 3 0 015.25 18.5v-1a.75.75 0 01.75-.75z" clipRule="evenodd" />
              </svg>
              PDF
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm w-full sm:w-auto sm:justify-end">
            <div className="relative flex-1 min-w-0 sm:flex-none">
                <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 4.243 12.004l3.751 3.752a.75.75 0 1 0 1.06-1.06l-3.751-3.752A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari catatan..."
                  className="w-full sm:w-56 h-8 rounded-lg border border-gray-300 pl-8 pr-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
            </div>
            <span className="text-gray-600">Filter:</span>
            <select
              value={filterPembimbing}
              onChange={(e) => setFilterPembimbing(parseInt(e.target.value) as 0 | 1 | 2)}
              className="rounded-lg border border-gray-300 px-2 h-8 text-sm shrink-0"
            >
              <option value={0}>Semua</option>
              <option value={1}>Pembimbing 1</option>
              <option value={2}>Pembimbing 2</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-6 flex flex-col items-center justify-center text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 text-orange-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M9 2a1 1 0 0 0-1 1H6.5A2.5 2.5 0 0 0 4 5.5v13A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5v-13A2.5 2.5 0 0 0 17.5 3H16a1 1 0 0 0-1-1H9Zm0 2h6v1H9V4Z" />
                </svg>
              </div>
              <div className="mt-2 text-sm text-gray-600">{data.length > 0 ? "Tidak ada catatan yang cocok dengan pencarian/ filter." : "Belum ada catatan bimbingan."}</div>
              {data.length === 0 && (
                <div className="text-xs text-gray-500">Tambahkan catatan pertama Anda menggunakan formulir di atas.</div>
              )}
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {visibleItems.map((item) => {
                const badgeColor =
                  item.approve === "Disetujui"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : item.approve === "Ditolak"
                    ? "bg-red-100 text-red-700 border-red-200"
                    : "bg-yellow-100 text-yellow-700 border-yellow-200";
                return (
                  <div key={item.id} className="p-3 rounded-xl border border-gray-200 bg-white/80 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="px-2 py-0.5 rounded-full text-xs border bg-blue-50 text-blue-700 border-blue-200">Pembimbing {item.pembimbing}</span>
                        <div className="inline-flex items-center gap-1 text-xs text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                            <path d="M6.5 2A2.5 2.5 0 0 0 4 4.5V6h16V4.5A2.5 2.5 0 0 0 17.5 2h-11ZM20 8H4v9.5A2.5 2.5 0 0 0 6.5 20h11a2.5 2.5 0 0 0 2.5-2.5V8ZM8 11.75A.75.75 0 0 1 8.75 11h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 8 11.75ZM8.75 14a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Z" />
                          </svg>
                          {formatDate(item.tanggalBimbingan)}
                        </div>
                      </div>
                      <span className={`h-fit px-2 py-0.5 rounded-full text-xs border ${badgeColor}`}>{item.approve}</span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs text-gray-600">Isi Bimbingan:</div>
                        <button
                          type="button"
                          className="text-xs text-orange-600 hover:underline shrink-0"
                          onClick={() => setExpanded((s) => ({ ...s, [item.id]: !s[item.id] }))}
                        >
                          {expanded[item.id] ? "Sembunyikan" : "Detail"}
                        </button>
                      </div>
                      {!expanded[item.id] ? (
                        <div className="mt-1 text-sm text-gray-800 truncate">{item.isi}</div>
                      ) : (
                        <div className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{item.isi}</div>
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <button
                        className="px-2 py-1 rounded-full text-white bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          setEditState({ open: true, id: item.id, isi: item.isi, tanggal: item.tanggalBimbingan.slice(0, 10) });
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 py-1 rounded-full text-white bg-red-600 hover:bg-red-700"
                        onClick={() => {
                          setData((prev) => prev.filter((x) => x.id !== item.id));
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                );
              })}
              {visibleCount < filtered.length && (
                <div ref={sentinelRef} className="h-10 flex items-center justify-center text-xs text-gray-500">
                  {isLoadingMore ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      Memuat...
                    </span>
                  ) : (
                    <span>Gulir untuk memuat lagi</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Edit Modal */}
      {editState.open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditState((s) => ({ ...s, open: false }))} />
          <div className="relative bg-white rounded-2xl w-full sm:max-w-md mx-4 p-4 shadow-lg">
            <div className="font-semibold text-gray-900">Edit Bimbingan</div>
            <div className="mt-3 space-y-3 text-sm">
              <div>
                <label className="block text-xs text-gray-700 mb-1">Tanggal Bimbingan</label>
                <input
                  type="date"
                  value={editState.tanggal}
                  onChange={(e) => setEditState((s) => ({ ...s, tanggal: e.target.value }))}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">Isi Bimbingan</label>
                <textarea
                  rows={4}
                  value={editState.isi}
                  onChange={(e) => setEditState((s) => ({ ...s, isi: e.target.value }))}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                className="py-2 rounded-full border border-gray-300 text-gray-700"
                onClick={() => setEditState((s) => ({ ...s, open: false }))}
              >
                Batal
              </button>
              <button
                className={`py-2 rounded-full text-white ${editState.isi.trim() ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-400"}`}
                disabled={!editState.isi.trim()}
                onClick={() => {
                  if (!editState.id) return;
                  setData((prev) =>
                    prev.map((x) =>
                      x.id === editState.id ? { ...x, isi: editState.isi.trim(), tanggalBimbingan: editState.tanggal } : x
                    )
                  );
                  setEditState({ open: false, id: null, isi: "", tanggal: new Date().toISOString().slice(0, 10) });
                }}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </MobileLayout>
  );
}
