import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DosenLayout from "../layouts/DosenLayout";
import { ArrowDownTrayIcon, UserIcon, CalendarDaysIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import ArrowLeftIcon from "../components/ArrowLeftIcon";

export function meta() {
  return [{ title: "Detail TA - Siakad" }];
}

interface StudentData {
  name: string;
  nim: string;
  topic: string;
  status: string;
  examType: 'sempro' | 'semhas' | 'pendadaran';
  gradingStatus: 'belum_dinilai' | 'sudah_dinilai';
  title?: string;
  examDate?: string;
  room?: string;
}

interface Supervisor {
  name: string;
  role: string;
  nip: string;
}

interface Examiner {
  name: string;
  role: string;
  nip: string;
}

interface Score {
  examiner: string;
  score: number;
  notes?: string;
}

const requestsByAngkatan: Record<number, StudentData[]> = {
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

export default function DosenDetailTA() {
  const { nim } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [examiners, setExaminers] = useState<Examiner[]>([]);
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    try {
      const role = localStorage.getItem("userRole");
      if (role !== "dosen") navigate("/", { replace: true });
    } catch {}
  }, [navigate]);

  useEffect(() => {
    if (!nim) return;

    // Find student data
    const allStudents = Object.values(requestsByAngkatan).flat();
    const foundStudent = allStudents.find(s => s.nim === nim);
    if (foundStudent) {
      setStudent(foundStudent);

      // Mock supervisors data
      setSupervisors([
        { name: "Dr. Ahmad Santoso", role: "Pembimbing Utama", nip: "198001012010121001" },
        { name: "Dr. Siti Nurhaliza", role: "Pembimbing Pendamping", nip: "198501152010122002" }
      ]);

      // Mock examiners data
      setExaminers([
        { name: "Prof. Dr. Budi Prasetyo", role: "Ketua Penguji", nip: "197512201987011001" },
        { name: "Dr. Maya Sari", role: "Anggota Penguji", nip: "198203151995122001" },
        { name: "Dr. Rudi Hartono", role: "Sekretaris", nip: "197808101990011002" }
      ]);

      // Mock scores data (always available for demo)
      setScores([
        { examiner: "Prof. Dr. Budi Prasetyo", score: 85, notes: "Presentasi baik, metodologi perlu diperbaiki" },
        { examiner: "Dr. Maya Sari", score: 88, notes: "Konten bagus, implementasi sesuai" },
        { examiner: "Dr. Rudi Hartono", score: 82, notes: "Dokumentasi perlu dilengkapi" }
      ]);
    }
  }, [nim]);

  const generateDocumentUrl = (type: string, student: StudentData) => {
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>${type} - ${student.name}</title>
          <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
              .info { background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0; }
              .content { margin-top: 30px; }
          </style>
      </head>
      <body>
          <h1>${type}</h1>
          <div class="info">
              <strong>Nama Mahasiswa:</strong> ${student.name}<br>
              <strong>NIM:</strong> ${student.nim}<br>
              <strong>Judul:</strong> ${student.title || `Tugas Akhir ${student.name}`}<br>
              <strong>Tanggal:</strong> ${new Date().toLocaleDateString('id-ID')}
          </div>
          <div class="content">
              <h2>Abstrak</h2>
              <p>Dokumen ini merupakan ${type.toLowerCase()} yang dibuat sebagai bagian dari proses akademik mahasiswa.</p>

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
    `;
    return `data:text/html;base64,${btoa(content)}`;
  };

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
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Detail TA</h1>
            <p className="text-sm text-gray-600">{student.name} • {student.nim}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 1. Judul TA */}
          <div className="bg-white/60 rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Judul TA</h2>
            <p className="text-gray-700">{student.title || `Tugas Akhir ${student.name}`}</p>
          </div>

          {/* 2. Berkas Proposal */}
          <div className="bg-white/60 rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Berkas Proposal</h2>
            <button
              onClick={() => {
                const url = generateDocumentUrl("Proposal", student);
                const a = document.createElement("a");
                a.href = url;
                a.download = `proposal-${student.nim}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Download Proposal
            </button>
          </div>

          {/* 3. Berkas Skripsi Terakhir */}
          <div className="bg-white/60 rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Berkas Skripsi (Upload Terakhir)</h2>
            <button
              onClick={() => {
                const url = generateDocumentUrl("Skripsi Terakhir", student);
                const a = document.createElement("a");
                a.href = url;
                a.download = `skripsi-terakhir-${student.nim}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Download Skripsi Terakhir
            </button>
          </div>

          {/* 4. Berkas Skripsi Final */}
          <div className="bg-white/60 rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Berkas Skripsi Final</h2>
            <button
              onClick={() => {
                const url = generateDocumentUrl("Skripsi Final", student);
                const a = document.createElement("a");
                a.href = url;
                a.download = `skripsi-final-${student.nim}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Download Skripsi Final
            </button>
          </div>

          {/* 5. Pembimbing */}
          <div className="bg-white/60 rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Pembimbing</h2>
            <div className="space-y-3">
              {supervisors.map((supervisor, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <UserIcon className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{supervisor.name}</p>
                    <p className="text-sm text-gray-600">{supervisor.role}</p>
                    <p className="text-xs text-gray-500">NIP: {supervisor.nip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Penguji */}
          <div className="bg-white/60 rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Penguji</h2>
            <div className="space-y-3">
              {examiners.map((examiner, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <AcademicCapIcon className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">{examiner.name}</p>
                    <p className="text-sm text-gray-600">{examiner.role}</p>
                    <p className="text-xs text-gray-500">NIP: {examiner.nip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7-9. Jadwal Ujian */}
          <div className="bg-white/60 rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Jadwal Ujian</h2>
            <div className="space-y-3">
              {/* Sempro */}
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <CalendarDaysIcon className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Seminar Proposal (Sempro)</p>
                  <p className="text-sm text-gray-600">
                    {new Date("2025-11-15").toLocaleDateString('id-ID')} - Ruang A
                  </p>
                </div>
              </div>

              {/* Semhas */}
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CalendarDaysIcon className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Seminar Hasil (Semhas)</p>
                  <p className="text-sm text-gray-600">
                    {new Date("2025-12-01").toLocaleDateString('id-ID')} - Ruang B
                  </p>
                </div>
              </div>

              {/* Pendadaran */}
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <CalendarDaysIcon className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Pendadaran</p>
                  <p className="text-sm text-gray-600">
                    {new Date("2025-12-15").toLocaleDateString('id-ID')} - Ruang C
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 10. Nilai Penguji */}
          <div className="bg-white/60 rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Nilai Penguji</h2>
            <div className="space-y-3">
              {scores.map((score, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{score.examiner}</p>
                    <span className="text-base font-semibold text-blue-600">{score.score}/100</span>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">Nilai Rata-rata</p>
                  <span className="text-lg font-semibold text-blue-600">
                    {Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)}/100
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DosenLayout>
  );
}