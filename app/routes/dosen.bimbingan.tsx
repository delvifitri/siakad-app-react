import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DosenLayout from "../layouts/DosenLayout";
import { ChatBubbleLeftRightIcon, CheckCircleIcon, ClockIcon, ArrowDownTrayIcon, UserIcon, EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export function meta() {
  return [{ title: "Bimbingan TA (Dosen) - Siakad" }];
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

export default function DosenBimbingan() {
  const navigate = useNavigate();
  const [showProposal, setShowProposal] = useState(false);
  const [proposal, setProposal] = useState<null | { title?: string; fileName?: string; dataUrl?: string }> (null);
  const [documentType, setDocumentType] = useState<'proposal' | 'proposal-revisi' | 'laporan-ta'>('proposal');
  const [currentProposalStudent, setCurrentProposalStudent] = useState<{ name: string; nim: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAngkatan, setSelectedAngkatan] = useState(2024);
  const [selectedExamType, setSelectedExamType] = useState<'semua' | 'sempro' | 'semhas'>('semua');

  useEffect(() => {
    try {
      const role = localStorage.getItem("userRole");
      if (role !== "dosen") navigate("/", { replace: true });
    } catch {}
  }, [navigate]);

  // Load selected exam type
  useEffect(() => {
    try {
      const savedExamType = localStorage.getItem("selectedExamType");
      if (savedExamType && ['semua', 'sempro', 'semhas'].includes(savedExamType)) {
        setSelectedExamType(savedExamType as 'semua' | 'sempro' | 'semhas');
      }
    } catch {}
  }, []);

  // Initialize dummy documents for all students
  useEffect(() => {
    try {
      // Create dummy documents for all students
      const allStudents = Object.values(requestsByAngkatan).flat();

      allStudents.forEach(student => {
        const baseDocument = {
          title: student.title || `Tugas Akhir ${student.name}`,
          fileName: `${student.examType === 'sempro' ? 'proposal-revisi' : student.examType === 'semhas' ? 'laporan-ta' : 'proposal'}-${student.nim}.pdf`,
          dataUrl: `data:text/html;base64,${btoa(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${student.examType === 'sempro' ? 'Proposal Revisi' : student.examType === 'semhas' ? 'Laporan TA' : 'Proposal'} - ${student.name}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                    h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
                    .info { background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0; }
                    .content { margin-top: 30px; }
                </style>
            </head>
            <body>
                <h1>${student.examType === 'sempro' ? 'Proposal Revisi' : student.examType === 'semhas' ? 'Laporan TA' : 'Proposal'}</h1>
                <div class="info">
                    <strong>Nama Mahasiswa:</strong> ${student.name}<br>
                    <strong>NIM:</strong> ${student.nim}<br>
                    <strong>Judul:</strong> ${student.title || `Tugas Akhir ${student.name}`}<br>
                    <strong>Tanggal:</strong> ${new Date().toLocaleDateString('id-ID')}
                </div>
                <div class="content">
                    <h2>Abstrak</h2>
                    <p>Dokumen ini merupakan ${student.examType === 'sempro' ? 'proposal revisi' : student.examType === 'semhas' ? 'laporan tugas akhir' : 'proposal'} yang dibuat sebagai bagian dari proses akademik mahasiswa.</p>
                    
                    <h2>Bab 1 - Pendahuluan</h2>
                    <p>Latar belakang penelitian ini berkaitan dengan topik: ${student.topic}</p>
                    
                    <h2>Bab 2 - Tinjauan Pustaka</h2>
                    <p>Kajian literatur yang relevan dengan penelitian ini...</p>
                    
                    <h2>Bab 3 - Metodologi</h2>
                    <p>Metode penelitian yang digunakan dalam penelitian ini...</p>
                    
                    <h2>Kesimpulan</h2>
                    <p>Kesimpulan dari penelitian ini akan dibahas pada bagian akhir dokumen.</p>
                    
                    <hr style="margin: 40px 0;">
                    <p style="text-align: center; color: #666; font-size: 12px;">
                        Dokumen Demo - ${new Date().toLocaleString('id-ID')}
                    </p>
                </div>
            </body>
            </html>
          `)}`
        };

        // Create proposal for pendadaran students
        if (student.examType === 'pendadaran') {
          const proposalKey = `proposal-${student.nim}`;
          if (!localStorage.getItem(proposalKey)) {
            localStorage.setItem(proposalKey, JSON.stringify({
              ...baseDocument,
              title: `Proposal ${student.title || `Tugas Akhir ${student.name}`}`,
              fileName: `proposal-${student.nim}.pdf`
            }));
          }
        }

        // Create proposal revisi for sempro students
        if (student.examType === 'sempro') {
          const proposalRevisiKey = `proposal-revisi-${student.nim}`;
          if (!localStorage.getItem(proposalRevisiKey)) {
            localStorage.setItem(proposalRevisiKey, JSON.stringify({
              ...baseDocument,
              title: `Proposal Revisi ${student.title || `Tugas Akhir ${student.name}`}`,
              fileName: `proposal-revisi-${student.nim}.pdf`
            }));
          }
        }

        // Create laporan TA for semhas students
        if (student.examType === 'semhas') {
          const laporanTaKey = `laporan-ta-${student.nim}`;
          if (!localStorage.getItem(laporanTaKey)) {
            localStorage.setItem(laporanTaKey, JSON.stringify({
              ...baseDocument,
              title: `Laporan TA ${student.title || `Tugas Akhir ${student.name}`}`,
              fileName: `laporan-ta-${student.nim}.pdf`
            }));
          }
        }
      });
    } catch (error) {
      console.log('Error initializing dummy documents:', error);
    }
  }, []);

    // Load selected exam type
  useEffect(() => {
    try {
      const savedExamType = localStorage.getItem("selectedExamType");
      if (savedExamType && ['semua', 'sempro', 'semhas'].includes(savedExamType)) {
        setSelectedExamType(savedExamType as 'semua' | 'sempro' | 'semhas');
      }
    } catch {}
  }, []);

  function loadDocumentFor(nim: string, examType: 'sempro' | 'semhas' | 'pendadaran') {
    try {
      let documentKey = '';
      let documentTypeLabel = '';

      if (examType === 'sempro') {
        documentKey = `proposal-revisi-${nim}`;
        documentTypeLabel = 'proposal-revisi';
      } else if (examType === 'semhas') {
        documentKey = `laporan-ta-${nim}`;
        documentTypeLabel = 'laporan-ta';
      } else {
        documentKey = `proposal-${nim}`;
        documentTypeLabel = 'proposal';
      }

      setDocumentType(documentTypeLabel as 'proposal' | 'proposal-revisi' | 'laporan-ta');

      // Try to load specific document first
      const rawSpecific = localStorage.getItem(documentKey);
      if (rawSpecific) {
        const parsed = JSON.parse(rawSpecific);
        setProposal(parsed);
        return;
      }

      // Fallback to general data
      const fallbackKey = examType === 'sempro' ? 'proposalRevisiData' :
                         examType === 'semhas' ? 'laporanTaData' : 'proposalData';

      const raw = localStorage.getItem(fallbackKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const found = parsed.find((p: any) => p.nim === nim || p.nim === String(nim));
          if (found) { setProposal(found); return; }
        } else if (parsed && (parsed.nim === nim || parsed.nim === String(nim))) {
          setProposal(parsed); return;
        }
      }

      // Final fallback to general proposal data
      const rawGeneral = localStorage.getItem("proposalData");
      if (rawGeneral) {
        const parsed = JSON.parse(rawGeneral);
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

  // Function to handle exam type change and save to localStorage
  const handleExamTypeChange = (examType: 'semua' | 'sempro' | 'semhas') => {
    setSelectedExamType(examType);
    try {
      localStorage.setItem("selectedExamType", examType);
    } catch {}
  };

  const requestsForSelectedAngkatan = requestsByAngkatan[selectedAngkatan] ?? [];
  const filteredRequests = requestsForSelectedAngkatan.filter((r) => {
    // Filter by exam type
    if (selectedExamType !== 'semua' && r.examType !== selectedExamType) {
      return false;
    }
    // Filter by search query
    return r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           r.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
           r.topic.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <DosenLayout bgImage="/bg simple.png">
      <section className="px-4 pt-6 pb-24">
  <h1 className="text-xl font-bold text-gray-900">Bimbingan TA</h1>
  <p className="text-sm text-gray-600 mt-1">Kelola bimbingan tugas akhir mahasiswa.</p>

        {/* Exam Type Filters */}
        <div className="mt-4">
          {/* Exam Type Tabs */}
          <div>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              {[
                { value: 'semua', label: 'Semua' },
                { value: 'sempro', label: 'Sempro' },
                { value: 'semhas', label: 'Semhas' }
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleExamTypeChange(tab.value as any)}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    selectedExamType === tab.value
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
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
                    {r.title && <div className="text-xs text-gray-600">Judul TA: {r.title}</div>}
                    {(r.examType === 'sempro' || r.examType === 'semhas') && r.examDate && (
                      <div className="text-xs text-gray-600">
                        {r.examType === 'sempro' ? 'Sempro' : 'Semhas'}: {new Date(r.examDate).toLocaleDateString('id-ID')}
                        {r.room && ` - ${r.room}`}
                      </div>
                    )}
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
                    className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-xs bg-orange-600 text-white hover:bg-orange-700 whitespace-nowrap"
                    onClick={() => {
                      navigate(`/dosen/log-bimbingan/${r.nim}`);
                    }}
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    Lihat Log
                  </button>
                  <button
                    className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-xs bg-blue-600 text-white hover:bg-blue-700 whitespace-nowrap"
                    onClick={() => {
                      // Navigate directly to chat with student
                      navigate(`/chat/5?name=${encodeURIComponent(r.name)}`);
                    }}
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    Chat
                  </button>
                  <button
                    className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-xs bg-purple-600 text-white hover:bg-purple-700 whitespace-nowrap"
                    onClick={() => {
                      setCurrentProposalStudent({ name: r.name, nim: r.nim });
                      loadDocumentFor(r.nim, r.examType);
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
      {/* Proposal modal */}
      {showProposal && currentProposalStudent && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowProposal(false)} />
          <div className="relative bg-white rounded-2xl w-full sm:max-w-lg mx-4 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">
                  {documentType === 'proposal' ? 'Detail Proposal' :
                   documentType === 'proposal-revisi' ? 'Detail Proposal Revisi' :
                   'Detail Laporan TA'} — {currentProposalStudent.name}
                </div>
                <div className="text-xs text-gray-600">NIM: {currentProposalStudent.nim}</div>
              </div>
              <button className="text-sm text-gray-600" onClick={() => setShowProposal(false)}>Tutup</button>
            </div>
            <div className="mt-3 text-sm">
              {!proposal ? (
                <div className="text-gray-600">
                  Belum ada {documentType === 'proposal' ? 'proposal' :
                             documentType === 'proposal-revisi' ? 'proposal revisi' :
                             'laporan TA'} yang diunggah oleh mahasiswa ini.
                </div>
              ) : (
                <div className="space-y-3">
                  {proposal.title && (<div><div className="text-xs text-gray-600">Judul</div><div className="font-medium">{proposal.title}</div></div>)}
                  {proposal.fileName && (<div><div className="text-xs text-gray-600">Berkas</div><div className="font-medium">{proposal.fileName}</div></div>)}
                  {proposal.dataUrl ? (
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Preview</div>
                      <div className="border rounded-md overflow-hidden">
                        <iframe src={proposal.dataUrl} title={`${documentType === 'proposal' ? 'Proposal' : documentType === 'proposal-revisi' ? 'Proposal Revisi' : 'Laporan TA'} Preview`} className="w-full h-64" />
                      </div>
                      <div className="mt-2">
                        <a href={proposal.dataUrl} download={proposal.fileName || `${documentType === 'proposal' ? 'proposal' : documentType === 'proposal-revisi' ? 'proposal-revisi' : 'laporan-ta'}-${currentProposalStudent.nim}.pdf`} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600 text-white">Download</a>
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
