import MobileLayout from "../layouts/MobileLayout";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Pengajuan() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"ta" | "cuti">("ta");
  // State untuk data Tugas Akhir sederhana
  const [ta, setTa] = useState<{
    judul: string;
    status: "Belum Diajukan" | "Diajukan" | "Disetujui" | "Ditolak" | "Diajukan Seminar";
    progress: number;
    fileName?: string;
  }>({
    judul: "Sistem Rekomendasi Berbasis AI untuk Penjadwalan KRS",
    status: "Diajukan Seminar",
    progress: 80,
  });

  // Dummy Pembimbing & Penguji
  const [pembimbing] = useState<Array<{ nama: string; ke: number }>>([
    { nama: "Dr. Ahmad Satful", ke: 1 },
    { nama: "Ir. Dewa Mahendra, M.Kom", ke: 2 },
  ]);
  const [penguji] = useState<Array<{ nama: string; ke: number }>>([
    { nama: "Dr. Rina Putri", ke: 1 },
    { nama: "Dr. Bukit Santoso", ke: 2 },
  ]);

  // Modal Ajukan Proposal
  const [showAjukan, setShowAjukan] = useState(false);
  const [form, setForm] = useState<{ title: string; fileName: string }>({ title: "", fileName: "" });
  // Status perkuliahan sederhana untuk logika cuti (dummy)
  const [isPerkuliahanAktif] = useState<boolean>(false);
  // Modal Log Bimbingan (global untuk semua pembimbing)
  const [showLogPembimbing, setShowLogPembimbing] = useState<boolean>(false);

  return (
    <MobileLayout title="Pengajuan" bgImage="/bg simple.png">
      <div className="p-4 space-y-4">
  <div className="text-2xl font-bold text-gray-900">Pengajuan</div>
        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/20 rounded-full p-1 w-fit">
          <button
            onClick={() => setTab("ta")}
            className={`px-4 py-1.5 text-sm rounded-full transition ${tab === "ta" ? "bg-blue-600 text-white" : "text-gray-700"}`}
          >
            Tugas Akhir
          </button>
          <button
            onClick={() => setTab("cuti")}
            className={`px-4 py-1.5 text-sm rounded-full transition ${tab === "cuti" ? "bg-blue-600 text-white" : "text-gray-700"}`}
          >
            Cuti
          </button>
        </div>

        {tab === "ta" ? (
          <div className="space-y-3">
            {/* Data Tugas Akhir */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
              <div className="text-lg font-semibold text-gray-900">Data Tugas Akhir</div>
              <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Nama MK</span>
                  <span className="font-medium text-gray-900">Tugas Akhir</span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-gray-600">Judul Proposal</span>
                  <span className="font-medium text-gray-900 text-right flex-1 break-words">{ta.judul || "-"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs border ${
                      ta.status === "Disetujui"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : ta.status === "Ditolak"
                        ? "bg-red-100 text-red-700 border-red-200"
                        : "bg-yellow-100 text-yellow-700 border-yellow-200"
                    }`}
                  >
                    {ta.status}
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Status Progress</span>
                    <span className="font-medium text-gray-900">{ta.progress}%</span>
                  </div>
                  <div className="mt-1 h-2 rounded bg-gray-100">
                    <div
                      className="h-2 rounded bg-orange-500"
                      style={{ width: `${Math.max(0, Math.min(100, ta.progress))}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  className="py-2 rounded-full text-white bg-orange-500 hover:bg-orange-600"
                  onClick={() => setShowAjukan(true)}
                >
                  Ajukan Proposal
                </button>
                <button className="py-2 rounded-full text-white bg-blue-600 hover:bg-blue-700">Lihat Pesan</button>
              </div>
            </div>

            {/* Data Pembimbing */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-gray-900">Data Pembimbing</div>
                <button
                  type="button"
                  onClick={() => navigate("/log-bimbingan")}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-white bg-orange-500 hover:bg-orange-600 text-[12px]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M9 2a1 1 0 0 0-1 1H6.5A2.5 2.5 0 0 0 4 5.5v13A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5v-13A2.5 2.5 0 0 0 17.5 3H16a1 1 0 0 0-1-1H9Zm0 2h6v1H9V4ZM8 9.75A.75.75 0 0 1 8.75 9h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 8 9.75ZM8.75 12a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5ZM8 15.75a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75Z" />
                  </svg>
                  <span>Log Bimbingan</span>
                </button>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
                {pembimbing.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 p-2 rounded-lg bg-gray-50 border border-gray-200">
                    <div>
                      <div className="font-medium text-gray-900">{p.nama}</div>
                      <div className="text-[11px] text-gray-600">Pembimbing ke {p.ke}</div>
                    </div>
                    <button type="button" className="px-2 py-1 rounded-full text-white bg-blue-600 hover:bg-blue-700 text-[11px]">
                      Lihat Pesan
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Penguji */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
              <div className="text-lg font-semibold text-gray-900">Data Penguji</div>
              <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
                {penguji.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 p-2 rounded-lg bg-gray-50 border border-gray-200">
                    <div>
                      <div className="font-medium text-gray-900">{p.nama}</div>
                      <div className="text-[11px] text-gray-600">Penguji ke {p.ke}</div>
                    </div>
                    <button type="button" className="px-2 py-1 rounded-full text-white bg-blue-600 hover:bg-blue-700 text-[11px]">
                      Lihat Pesan
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
              <div className="text-lg font-semibold text-gray-900">Pengajuan Cuti</div>
              <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status Perkuliahan</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs border ${
                    isPerkuliahanAktif
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-gray-100 text-gray-700 border-gray-200"
                  }`}>
                    {isPerkuliahanAktif ? "Aktif" : "Tidak Aktif"}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  {isPerkuliahanAktif
                    ? "Tidak dapat mengajukan cuti saat status perkuliahan aktif."
                    : "Anda dapat mengajukan cuti karena tidak sedang aktif perkuliahan."}
                </div>
              </div>
              <div className="mt-3">
                <button
                  className={`w-full py-2 rounded-full font-medium ${
                    isPerkuliahanAktif
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "text-white bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={isPerkuliahanAktif}
                >
                  Ajukan Cuti
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showAjukan && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAjukan(false)} />
          <div className="relative bg-white rounded-2xl w-full sm:max-w-md mx-4 p-4 shadow-lg">
            <div className="font-semibold text-gray-900">Ajukan Proposal Tugas Akhir</div>
            <div className="mt-2 text-xs text-gray-600">Isi judul proposal Anda dan (opsional) unggah berkas pendukung.</div>
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-xs text-gray-700 mb-1">Judul Proposal</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Contoh: Sistem Rekomendasi Berbasis AI untuk …"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">Unggah Berkas (opsional)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    setForm((prev) => ({ ...prev, fileName: file ? file.name : "" }));
                  }}
                  className="w-full text-sm"
                />
                {form.fileName ? (
                  <div className="mt-1 text-xs text-gray-600">Dipilih: {form.fileName}</div>
                ) : null}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                className="py-2 rounded-full border border-gray-300 text-gray-700"
                onClick={() => setShowAjukan(false)}
              >
                Batal
              </button>
              <button
                className={`py-2 rounded-full text-white ${form.title.trim() ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-400"}`}
                disabled={!form.title.trim()}
                onClick={() => {
                  if (!form.title.trim()) return;
                  setTa({
                    judul: form.title.trim(),
                    status: "Diajukan",
                    progress: 10,
                    fileName: form.fileName || undefined,
                  });
                  setShowAjukan(false);
                  setForm({ title: "", fileName: "" });
                }}
              >
                Ajukan
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogPembimbing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowLogPembimbing(false)} />
          <div className="relative bg-white rounded-2xl w-full sm:max-w-md mx-4 p-4 shadow-lg">
            <div className="font-semibold text-gray-900">Log Bimbingan</div>
            <div className="mt-1 text-xs text-gray-600">Daftar catatan bimbingan terbaru</div>
            <div className="mt-3 space-y-2 text-sm">
              {/* Dummy logs */}
              <div className="p-2 rounded-lg border border-gray-200 bg-gray-50">
                <div className="text-[11px] text-gray-500">12 Sep 2025, 10:30</div>
                <div className="text-gray-800">Revisi Bab 2, perbaiki referensi dan tambahkan 2 jurnal terbaru.</div>
              </div>
              <div className="p-2 rounded-lg border border-gray-200 bg-gray-50">
                <div className="text-[11px] text-gray-500">20 Sep 2025, 14:00</div>
                <div className="text-gray-800">Metodologi ok. Lanjutkan eksperimen dan siapkan ringkasan hasil.</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1">
              <button
                className="py-2 rounded-full border border-gray-300 text-gray-700"
                onClick={() => setShowLogPembimbing(false)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </MobileLayout>
  );
}
