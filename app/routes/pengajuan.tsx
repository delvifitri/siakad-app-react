import MobileLayout from "../layouts/MobileLayout";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ClockIcon, CheckCircleIcon, AcademicCapIcon } from "@heroicons/react/24/outline";

export default function Pengajuan() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"ta" | "cuti">("ta");
  const [selectedTASection, setSelectedTASection] = useState<'data-ta' | 'seminar-proposal' | 'seminar-hasil' | 'pendadaran'>('data-ta');
  // Nilai ringkasan (dummy) untuk TA dan Pendadaran
  const nilaiTaAvg = 81; // rata-rata komponen TA
  const nilaiPendadaranAvg = 80; // rata-rata nilai pendadaran
  const hasilAkhir = (nilaiTaAvg + nilaiPendadaranAvg) / 2; // gabungan TA + Pendadaran (desimal)
  // State untuk daftar pengajuan seminar
  const [pengajuanProposal, setPengajuanProposal] = useState<Array<{judul: string, tanggal: string, status: string}>>([]);
  const [pengajuanHasil, setPengajuanHasil] = useState<Array<{judul: string, tanggal: string, status: string}>>([]);
  const [pengajuanPendadaran, setPengajuanPendadaran] = useState<Array<{judul: string, tanggal: string, status: string}>>([]);
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
  const [form, setForm] = useState<{ title: string; fileName: string; fileError?: string }>({ title: "", fileName: "" });
  // Modal Detail Nilai TA/Pendadaran
  const [showDetailNilai, setShowDetailNilai] = useState<boolean>(false);
  const [detailTab, setDetailTab] = useState<'ta' | 'pendadaran'>('ta');
  // Status perkuliahan sederhana untuk logika cuti (dummy)
  const [isPerkuliahanAktif] = useState<boolean>(false);
  // Modal Log Bimbingan (global untuk semua pembimbing)
  const [showLogPembimbing, setShowLogPembimbing] = useState<boolean>(false);
  // Cuti state & modal
  const [showAjukanCuti, setShowAjukanCuti] = useState<boolean>(false);
  // Data dari sistem (contoh)
  const systemPhone = "081234567890";
  function getAcademicYears() {
    const now = new Date();
    const year = now.getFullYear();
    // simple list: current/next and previous/current
    return [
      `${year}/${year + 1}`,
      `${year - 1}/${year}`,
      `${year - 2}/${year - 1}`,
    ];
  }
  const [cutiForm, setCutiForm] = useState<{
    semester: "Ganjil" | "Genap";
    tahun: string;
    noHp: string;
    alasan: string;
    fileName?: string;
    fileError?: string;
  }>({
    semester: "Ganjil",
    tahun: getAcademicYears()[0],
    noHp: systemPhone,
    alasan: "",
  });
  const [cuti, setCuti] = useState<null | {
    semester: string;
    tahun: string;
    noHp?: string;
    alasan: string;
    fileName?: string;
    status: "Menunggu" | "Disetujui" | "Ditolak";
  }>({
    // Dummy pengajuan cuti awal (contoh)
    semester: "Ganjil",
    tahun: getAcademicYears()[0],
    noHp: systemPhone,
    alasan: "Keperluan keluarga selama beberapa bulan, mohon persetujuan cuti akademik.",
    fileName: "surat_cuti.pdf",
    status: "Menunggu",
  });

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
            {/* Dropdown Data Tugas Akhir */}
            <div className="flex items-center justify-end">
              <select
                className="px-3 py-2 rounded-full border border-gray-300 bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedTASection}
                onChange={(e) => setSelectedTASection(e.target.value as any)}
              >
                <option value="data-ta">Data Tugas Akhir</option>
                <option value="seminar-proposal">Seminar Proposal</option>
                <option value="seminar-hasil">Seminar Hasil</option>
                <option value="pendadaran">Pendadaran</option>
              </select>
            </div>

            {/* Conditional rendering based on selected TA section */}
            {selectedTASection === 'data-ta' && (
              <>
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
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Hasil Nilai</span>
                      <span className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{hasilAkhir.toFixed(1)}</span>
                        <button
                          type="button"
                          className="px-2 py-0.5 rounded-full text-white bg-blue-600 hover:bg-blue-700 text-xs"
                          onClick={() => { setDetailTab('ta'); setShowDetailNilai(true); }}
                        >
                          Detail
                        </button>
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      className="py-2 rounded-full text-white bg-orange-500 hover:bg-orange-600"
                      onClick={() => setShowAjukan(true)}
                    >
                      Ajukan Proposal
                    </button>
                    <button
                      className="py-2 rounded-full text-white bg-blue-600 hover:bg-blue-700"
                      onClick={() => navigate("/chat/4")}
                    >
                      Lihat Pesan
                    </button>
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
                        <button
                          type="button"
                          className="px-2 py-1 rounded-full text-white bg-blue-600 hover:bg-blue-700 text-[11px]"
                          onClick={() => navigate(`/chat/${p.ke === 1 ? 5 : 6}`)}
                        >
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
                        <button
                          type="button"
                          className="px-2 py-1 rounded-full text-white bg-blue-600 hover:bg-blue-700 text-[11px]"
                          onClick={() => navigate(`/chat/${p.ke === 1 ? 7 : 8}`)}
                        >
                          Lihat Pesan
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {selectedTASection === 'seminar-proposal' && (
              <div className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-semibold text-gray-900">Seminar Proposal</div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 border border-yellow-200">
                    <ClockIcon className="h-4 w-4" />
                    <span>Menunggu Persetujuan</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Judul Proposal</label>
                      <input
                        type="text"
                        value={ta.judul}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Seminar</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Penguji</label>
                    <div className="space-y-2">
                      {pembimbing.map((p, idx) => (
                        <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-md">
                          <span className="text-sm">{p.nama} (Pembimbing {p.ke})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload File Proposal</label>
                    <input
                      type="file"
                      accept=".pdf"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                      Batal
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => {
                        const newPengajuan = {
                          judul: ta.judul,
                          tanggal: new Date().toLocaleDateString(),
                          status: 'Menunggu Persetujuan'
                        };
                        setPengajuanProposal(prev => [...prev, newPengajuan]);
                      }}>
                      Ajukan Seminar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {pengajuanProposal.length > 0 && (
              <div className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
                <div className="text-lg font-semibold text-gray-900">Daftar Pengajuan Seminar Proposal</div>
                <div className="mt-2 space-y-2">
                  {pengajuanProposal.map((p, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-gray-200 bg-white/70 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-900">{p.judul}</div>
                        <span className={`px-2 py-0.5 rounded-full text-xs border ${
                          p.status === "Menunggu Persetujuan" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                          p.status === "Disetujui" ? "bg-green-100 text-green-700 border-green-200" :
                          "bg-red-100 text-red-700 border-red-200"
                        }`}>{p.status}</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-700">
                        Tanggal Pengajuan: <span className="font-medium text-gray-900">{p.tanggal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTASection === 'seminar-hasil' && (
              <div className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-semibold text-gray-900">Seminar Hasil</div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 border border-yellow-200">
                    <ClockIcon className="h-4 w-4" />
                    <span>Menunggu Persetujuan</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Judul Hasil</label>
                      <input
                        type="text"
                        value={ta.judul}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Seminar</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Penguji</label>
                    <div className="space-y-2">
                      {pembimbing.map((p, idx) => (
                        <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-md">
                          <span className="text-sm">{p.nama} (Pembimbing {p.ke})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload File Hasil</label>
                    <input
                      type="file"
                      accept=".pdf"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                      Batal
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => {
                        const newPengajuan = {
                          judul: ta.judul,
                          tanggal: new Date().toLocaleDateString(),
                          status: 'Menunggu Persetujuan'
                        };
                        setPengajuanHasil(prev => [...prev, newPengajuan]);
                      }}>
                      Ajukan Seminar Hasil
                    </button>
                  </div>
                </div>
              </div>
            )}

            {pengajuanHasil.length > 0 && (
              <div className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
                <div className="text-lg font-semibold text-gray-900">Daftar Pengajuan Seminar Hasil</div>
                <div className="mt-2 space-y-2">
                  {pengajuanHasil.map((p, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-gray-200 bg-white/70 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-900">{p.judul}</div>
                        <span className={`px-2 py-0.5 rounded-full text-xs border ${
                          p.status === "Menunggu Persetujuan" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                          p.status === "Disetujui" ? "bg-green-100 text-green-700 border-green-200" :
                          "bg-red-100 text-red-700 border-red-200"
                        }`}>{p.status}</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-700">
                        Tanggal Pengajuan: <span className="font-medium text-gray-900">{p.tanggal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTASection === 'pendadaran' && (
              <div className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-semibold text-gray-900">Pendadaran</div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 border border-yellow-200">
                    <ClockIcon className="h-4 w-4" />
                    <span>Menunggu Persetujuan</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Judul Skripsi</label>
                      <input
                        type="text"
                        value={ta.judul}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pendadaran</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Penguji</label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <span className="text-sm">Dr. Ahmad Surya, M.Kom (Ketua)</span>
                        <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Menunggu</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <span className="text-sm">Prof. Budi Santoso, Ph.D (Sekretaris)</span>
                        <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Menunggu</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <span className="text-sm">Dr. Citra Dewi, M.T (Anggota)</span>
                        <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Menunggu</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Draft Skripsi</label>
                    <input
                      type="file"
                      accept=".pdf"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                      Batal
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => {
                        const newPengajuan = {
                          judul: ta.judul,
                          tanggal: new Date().toLocaleDateString(),
                          status: 'Menunggu Persetujuan'
                        };
                        setPengajuanPendadaran(prev => [...prev, newPengajuan]);
                      }}>
                      Ajukan Pendadaran
                    </button>
                  </div>
                </div>
              </div>
            )}

            {pengajuanPendadaran.length > 0 && (
              <div className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-white/30 p-4 shadow-sm">
                <div className="text-lg font-semibold text-gray-900">Daftar Pengajuan Pendadaran</div>
                <div className="mt-2 space-y-2">
                  {pengajuanPendadaran.map((p, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-gray-200 bg-white/70 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-900">{p.judul}</div>
                        <span className={`px-2 py-0.5 rounded-full text-xs border ${
                          p.status === "Menunggu Persetujuan" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                          p.status === "Disetujui" ? "bg-green-100 text-green-700 border-green-200" :
                          "bg-red-100 text-red-700 border-red-200"
                        }`}>{p.status}</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-700">
                        Tanggal Pengajuan: <span className="font-medium text-gray-900">{p.tanggal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                  onClick={() => {
                    if (!isPerkuliahanAktif) setShowAjukanCuti(true);
                  }}
                >
                  Ajukan Cuti
                </button>
              {cuti && (
                <div className="mt-3 p-3 rounded-xl border border-gray-200 bg-white/70 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">Pengajuan Cuti Terkini</div>
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${
                      cuti.status === "Disetujui" ? "bg-green-100 text-green-700 border-green-200" :
                      cuti.status === "Ditolak" ? "bg-red-100 text-red-700 border-red-200" :
                      "bg-yellow-100 text-yellow-700 border-yellow-200"
                    }`}>{cuti.status}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-gray-700">
                    <div className="flex items-center justify-between"><span>Semester</span><span className="font-medium text-gray-900">{cuti.semester} {cuti.tahun}</span></div>
                    {cuti.noHp ? (<div className="flex items-center justify-between"><span>No. HP</span><span className="font-medium text-gray-900">{cuti.noHp}</span></div>) : null}
                  </div>
                  <div className="mt-2 text-xs text-gray-700 whitespace-pre-wrap">
                    <span className="text-gray-600">Alasan</span>
                    <span className="mx-1">:</span>
                    <span className="font-medium text-gray-900">{cuti.alasan}</span>
                  </div>
                  {cuti.fileName ? (<div className="mt-2 text-xs text-gray-700">Berkas: <span className="font-medium text-gray-900">{cuti.fileName}</span></div>) : null}
                </div>
              )}
              </div>
            </div>
          </div>
        )}
      </div>

      {showAjukan && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAjukan(false)} />
          <div className="relative bg-white rounded-2xl w-full sm:max-w-md mx-4 p-4 shadow-lg">
            <div className="font-semibold text-gray-900">Form Detail Proposal</div>
            <div className="mt-2 text-xs text-gray-600">Isi detail proposal Anda dan unggah berkas PDF (jika diperlukan).</div>
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
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-700">Status</span>
                <span className="px-2 py-0.5 rounded-full text-xs border bg-yellow-100 text-yellow-700 border-yellow-200">Diajukan</span>
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">Unggah Proposal (PDF)</label>
                <input
                  id="proposal-file"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (!file) {
                      setForm((prev) => ({ ...prev, fileName: "", fileError: undefined }));
                      return;
                    }
                    const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
                    if (!isPdf) {
                      setForm((prev) => ({ ...prev, fileName: "", fileError: "Hanya file PDF yang diizinkan." }));
                      e.currentTarget.value = "";
                      return;
                    }
                    setForm((prev) => ({ ...prev, fileName: file.name, fileError: undefined }));
                  }}
                  className="sr-only"
                />
                <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm text-gray-800 truncate">
                        {form.fileName ? `Dipilih: ${form.fileName}` : "Belum ada file yang dipilih"}
                      </div>
                      <div className="text-[11px] text-gray-500">Format yang diizinkan: PDF</div>
                    </div>
                    <label htmlFor="proposal-file" className="shrink-0 inline-flex items-center px-3 py-1.5 rounded-full text-white bg-blue-600 hover:bg-blue-700 text-xs cursor-pointer">
                      Pilih File
                    </label>
                  </div>
                  {form.fileError ? (
                    <div className="mt-2 text-xs text-red-600">{form.fileError}</div>
                  ) : null}
                </div>
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
                className={`py-2 rounded-full text-white ${form.title.trim() && !form.fileError ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-400"}`}
                disabled={!form.title.trim() || !!form.fileError}
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
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailNilai && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowDetailNilai(false)} />
          <div className="relative bg-white rounded-2xl w-full sm:max-w-md mx-4 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-gray-900">Detail Nilai</div>
              <button
                onClick={() => setShowDetailNilai(false)}
                className="text-sm px-2 py-1 rounded-md text-gray-600 hover:bg-gray-100"
              >Tutup</button>
            </div>
            <div className="mt-3">
              <div className="flex bg-gray-100 rounded-lg p-1 text-sm">
                <button
                  onClick={() => setDetailTab('ta')}
                  className={`flex-1 py-2 px-3 rounded-md font-medium transition-colors ${detailTab === 'ta' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
                >Nilai TA</button>
                <button
                  onClick={() => setDetailTab('pendadaran')}
                  className={`flex-1 py-2 px-3 rounded-md font-medium transition-colors ${detailTab === 'pendadaran' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
                >Nilai Pendadaran</button>
              </div>
            </div>
            <div className="mt-4 text-sm">
              {detailTab === 'ta' ? (
                <div className="space-y-3">
                  {/* Tampilkan langsung hasil akhir tanpa komponen detail */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800 font-semibold">Rata-rata Nilai TA</span>
                    <span className="font-semibold text-gray-900">{nilaiTaAvg.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="px-2 py-0.5 rounded-full text-xs border bg-green-100 text-green-700 border-green-200">Lulus</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Penguji 1</span>
                    <span className="font-medium text-gray-900">82</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Penguji 2</span>
                    <span className="font-medium text-gray-900">78</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Penguji 3</span>
                    <span className="font-medium text-gray-900">80</span>
                  </div>
                  <div className="pt-2 border-t mt-2 flex items-center justify-between">
                    <span className="text-gray-800 font-semibold">Rata-rata</span>
                    <span className="font-semibold text-gray-900">{nilaiPendadaranAvg.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="px-2 py-0.5 rounded-full text-xs border bg-green-100 text-green-700 border-green-200">Lulus</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showAjukanCuti && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAjukanCuti(false)} />
          <div className="relative bg-white rounded-2xl w-full sm:max-w-md mx-4 p-4 shadow-lg">
            <div className="font-semibold text-gray-900">Ajukan Cuti Akademik</div>
            <div className="mt-2 text-xs text-gray-600">Isi data berikut untuk mengajukan cuti. Pastikan alasan terisi dan (opsional) unggah surat dalam bentuk PDF.</div>
            <div className="mt-3 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-gray-700 mb-1">Semester</label>
                  <select
                    value={cutiForm.semester}
                    onChange={(e) => setCutiForm((s) => ({ ...s, semester: e.target.value as any }))}
                    disabled
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed appearance-none"
                  >
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-gray-700 mb-1">Tahun Akademik</label>
                  <select
                    value={cutiForm.tahun}
                    onChange={(e) => setCutiForm((s) => ({ ...s, tahun: e.target.value }))}
                    disabled
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed appearance-none"
                  >
                    {getAcademicYears().map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Input Durasi dan Tanggal Pengajuan dihapus sesuai permintaan */}
              <div>
                <label className="block text-[11px] text-gray-700 mb-1">No. HP Aktif</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="08xxxxxxxxxx"
                  value={cutiForm.noHp}
                  onChange={(e) => setCutiForm((s) => ({ ...s, noHp: e.target.value }))}
                  disabled
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-700 mb-1">Alasan Pengajuan</label>
                <textarea
                  rows={3}
                  placeholder="Tulis alasan Anda..."
                  value={cutiForm.alasan}
                  onChange={(e) => setCutiForm((s) => ({ ...s, alasan: e.target.value }))}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-700 mb-1">Unggah Surat Pendukung (PDF, opsional)</label>
                <input
                  id="cuti-file"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (!file) {
                      setCutiForm((s) => ({ ...s, fileName: undefined, fileError: undefined }));
                      return;
                    }
                    const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
                    if (!isPdf) {
                      setCutiForm((s) => ({ ...s, fileName: undefined, fileError: "Hanya file PDF yang diizinkan." }));
                      e.currentTarget.value = "";
                      return;
                    }
                    setCutiForm((s) => ({ ...s, fileName: file.name, fileError: undefined }));
                  }}
                  className="sr-only"
                />
                <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm text-gray-800 truncate">{cutiForm.fileName ? `Dipilih: ${cutiForm.fileName}` : "Belum ada file yang dipilih"}</div>
                      <div className="text-[11px] text-gray-500">Format yang diizinkan: PDF</div>
                    </div>
                    <label htmlFor="cuti-file" className="shrink-0 inline-flex items-center px-3 py-1.5 rounded-full text-white bg-blue-600 hover:bg-blue-700 text-xs cursor-pointer">Pilih File</label>
                  </div>
                  {cutiForm.fileError ? (<div className="mt-2 text-xs text-red-600">{cutiForm.fileError}</div>) : null}
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                className="py-2 rounded-full border border-gray-300 text-gray-700"
                onClick={() => setShowAjukanCuti(false)}
              >
                Batal
              </button>
              <button
                className={`py-2 rounded-full text-white ${cutiForm.alasan.trim() && !cutiForm.fileError ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-400"}`}
                disabled={!cutiForm.alasan.trim() || !!cutiForm.fileError}
                onClick={() => {
                  if (!cutiForm.alasan.trim()) return;
                  setCuti({
                    semester: cutiForm.semester,
                    tahun: cutiForm.tahun,
                    noHp: cutiForm.noHp || undefined,
                    alasan: cutiForm.alasan.trim(),
                    fileName: cutiForm.fileName,
                    status: "Menunggu",
                  });
                  setShowAjukanCuti(false);
                }}
              >
                Ajukan Cuti
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
