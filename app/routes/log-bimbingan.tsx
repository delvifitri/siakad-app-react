import MobileLayout from "../layouts/MobileLayout";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

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
  const [pembimbing, setPembimbing] = useState<1 | 2>(1);
  const [tanggalBimbingan, setTanggalBimbingan] = useState<string>(new Date().toISOString().slice(0, 10));
  const [isi, setIsi] = useState<string>("");
  const [data, setData] = useState<LogItem[]>([]);
  const [filterPembimbing, setFilterPembimbing] = useState<0 | 1 | 2>(0); // 0=semua

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw));
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

  const filtered = useMemo(() => {
    return data
      .filter((d) => (filterPembimbing === 0 ? true : d.pembimbing === filterPembimbing))
      .sort((a, b) => (a.tanggalInput < b.tanggalInput ? 1 : -1));
  }, [data, filterPembimbing]);

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
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-900">Riwayat Bimbingan</div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Filter:</span>
              <select
                value={filterPembimbing}
                onChange={(e) => setFilterPembimbing(parseInt(e.target.value) as 0 | 1 | 2)}
                className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
              >
                <option value={0}>Semua</option>
                <option value={1}>Pembimbing 1</option>
                <option value={2}>Pembimbing 2</option>
              </select>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2">
            {filtered.length === 0 ? (
              <div className="text-sm text-gray-500">Belum ada catatan bimbingan.</div>
            ) : (
              filtered.map((item) => (
                <div key={item.id} className="p-3 rounded-xl border border-gray-200 bg-white/80">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Pembimbing {item.pembimbing}</div>
                      <div className="text-xs text-gray-600">Tgl Bimbingan: {formatDate(item.tanggalBimbingan)}</div>
                      <div className="text-xs text-gray-600">Tgl Input: {formatDate(item.tanggalInput)}</div>
                    </div>
                    <span
                      className={`h-fit px-2 py-0.5 rounded-full text-xs border ${
                        item.approve === "Disetujui"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : item.approve === "Ditolak"
                          ? "bg-red-100 text-red-700 border-red-200"
                          : "bg-yellow-100 text-yellow-700 border-yellow-200"
                      }`}
                    >
                      {item.approve}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-800 whitespace-pre-wrap">{item.isi}</div>
                  {/* Baris aksi dihilangkan untuk mahasiswa (hapus/approve tidak tersedia) */}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
