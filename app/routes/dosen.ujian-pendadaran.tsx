import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DosenLayout from "../layouts/DosenLayout";
import { AcademicCapIcon, MagnifyingGlassIcon, ClockIcon, MapPinIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export function meta() {
  return [{ title: "Ujian Pendadaran (Dosen) - Siakad" }];
}

const thesisDefenseData: Record<number, Array<{
  id: string;
  studentName: string;
  nim: string;
  title: string;
  date: string;
  time: string;
  room: string;
  examiners: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
  gradingStatus: 'belum_dinilai' | 'sudah_dinilai';
}>> = {
  2020: [
    {
      id: "PD-2020-001",
      studentName: "Siti Aminah",
      nim: "202001234",
      title: "Sistem Informasi Akademik Berbasis Web",
      date: "2025-11-15",
      time: "09:00",
      room: "Ruang Sidang Utama",
      examiners: ["Dr. Ahmad Fauzi", "Dr. Siti Nurhaliza", "Dr. Budi Santoso"],
      status: "scheduled",
      gradingStatus: "belum_dinilai"
    },
    {
      id: "PD-2020-002",
      studentName: "Ahmad Rahman",
      nim: "202001235",
      title: "Aplikasi Mobile E-Learning untuk Pembelajaran Daring",
      date: "2025-11-20",
      time: "14:00",
      room: "Ruang Seminar 1",
      examiners: ["Dr. Ahmad Fauzi", "Dr. Maya Sari", "Dr. Rudi Hartono"],
      status: "scheduled",
      gradingStatus: "sudah_dinilai"
    }
  ],
  2021: [
    {
      id: "PD-2021-001",
      studentName: "Maya Sari",
      nim: "202101234",
      title: "Pengembangan Sistem Rekomendasi Buku Digital",
      date: "2025-11-10",
      time: "10:00",
      room: "Ruang Sidang Utama",
      examiners: ["Dr. Ahmad Fauzi", "Dr. Nina Kusuma", "Dr. Dedi Kurniawan"],
      status: "scheduled",
      gradingStatus: "belum_dinilai"
    },
    {
      id: "PD-2021-002",
      studentName: "Rudi Hartono",
      nim: "202101235",
      title: "Implementasi Machine Learning untuk Prediksi Harga Saham",
      date: "2025-11-25",
      time: "13:00",
      room: "Ruang Seminar 2",
      examiners: ["Dr. Ahmad Fauzi", "Dr. Citra Rahma", "Dr. Fajar Setiawan"],
      status: "scheduled",
      gradingStatus: "sudah_dinilai"
    }
  ],
  2022: [
    {
      id: "PD-2022-001",
      studentName: "Nina Kusuma",
      nim: "202201234",
      title: "Analisis Big Data untuk Sistem Pendukung Keputusan",
      date: "2025-11-18",
      time: "11:00",
      room: "Ruang Sidang Utama",
      examiners: ["Dr. Ahmad Fauzi", "Dr. Maya Sari", "Dr. Budi Santoso"],
      status: "scheduled",
      gradingStatus: "belum_dinilai"
    }
  ],
  2023: [
    {
      id: "PD-2023-001",
      studentName: "Budi Santoso",
      nim: "202301234",
      title: "Pengembangan Aplikasi IoT untuk Monitoring Lingkungan",
      date: "2025-11-12",
      time: "15:00",
      room: "Ruang Seminar 1",
      examiners: ["Dr. Ahmad Fauzi", "Dr. Nina Kusuma", "Dr. Rudi Hartono"],
      status: "scheduled",
      gradingStatus: "sudah_dinilai"
    },
    {
      id: "PD-2023-002",
      studentName: "Citra Rahma",
      nim: "202301235",
      title: "Sistem Keamanan Jaringan Berbasis AI",
      date: "2025-11-28",
      time: "09:00",
      room: "Ruang Seminar 2",
      examiners: ["Dr. Ahmad Fauzi", "Dr. Dedi Kurniawan", "Dr. Fajar Setiawan"],
      status: "scheduled",
      gradingStatus: "belum_dinilai"
    }
  ],
  2024: [
    {
      id: "PD-2024-001",
      studentName: "Ani Lestari",
      nim: "202401234",
      title: "Pengembangan Platform E-Commerce dengan Blockchain",
      date: "2025-11-08",
      time: "13:00",
      room: "Ruang Sidang Utama",
      examiners: ["Dr. Ahmad Fauzi", "Dr. Citra Rahma", "Dr. Maya Sari"],
      status: "scheduled",
      gradingStatus: "belum_dinilai"
    },
    {
      id: "PD-2024-002",
      studentName: "Dedi Kurniawan",
      nim: "202401235",
      title: "Implementasi Augmented Reality untuk Edukasi Medis",
      date: "2025-11-22",
      time: "10:00",
      room: "Ruang Seminar 1",
      examiners: ["Dr. Ahmad Fauzi", "Dr. Budi Santoso", "Dr. Nina Kusuma"],
      status: "scheduled",
      gradingStatus: "sudah_dinilai"
    }
  ],
  2025: [
    {
      id: "PD-2025-001",
      studentName: "Fajar Setiawan",
      nim: "202501234",
      title: "Sistem Monitoring Kesehatan Real-time Berbasis Wearable Device",
      date: "2025-12-01",
      time: "14:00",
      room: "Ruang Sidang Utama",
      examiners: ["Dr. Ahmad Fauzi", "Dr. Rudi Hartono", "Dr. Dedi Kurniawan"],
      status: "scheduled",
      gradingStatus: "belum_dinilai"
    }
  ],
};

export default function DosenUjianPendadaran() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      const role = localStorage.getItem("userRole");
      if (role !== "dosen") navigate("/", { replace: true });
    } catch {}
  }, [navigate]);

  // Combine all thesis defenses from all angkatan and sort by grading status (graded first) then by date (earliest first)
  const allThesisDefenses = Object.values(thesisDefenseData).flat().sort((a, b) => {
    // First sort by grading status: 'sudah_dinilai' comes before 'belum_dinilai'
    if (a.gradingStatus === 'sudah_dinilai' && b.gradingStatus === 'belum_dinilai') return -1;
    if (a.gradingStatus === 'belum_dinilai' && b.gradingStatus === 'sudah_dinilai') return 1;
    
    // If grading status is the same, sort by date (earliest first)
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  const filteredThesisDefenses = allThesisDefenses.filter((exam) =>
    exam.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exam.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exam.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getGradingStatusColor = (gradingStatus: string) => {
    switch (gradingStatus) {
      case 'sudah_dinilai': return 'bg-green-100 text-green-700';
      case 'belum_dinilai': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getGradingStatusText = (gradingStatus: string) => {
    switch (gradingStatus) {
      case 'sudah_dinilai': return 'Sudah Dinilai';
      case 'belum_dinilai': return 'Belum Dinilai';
      default: return gradingStatus;
    }
  };

  return (
    <DosenLayout bgImage="/bg simple.png">
      <section className="px-4 pt-6 pb-24">
        <h1 className="text-xl font-bold text-gray-900">Ujian Pendadaran</h1>
        <p className="text-sm text-gray-600 mt-1">Kelola jadwal ujian pendadaran mahasiswa.</p>

        {/* Search input */}
        <div className="mt-4 max-w-md">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari mahasiswa, NIM, atau judul"
              className="pl-10 pr-3 py-2 border rounded-full w-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {filteredThesisDefenses.map((exam) => (
            <div key={exam.id} className="bg-white/60 rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AcademicCapIcon className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">{exam.studentName}</span>
                    <span className="text-sm text-gray-500">({exam.nim})</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradingStatusColor(exam.gradingStatus)}`}>
                      {getGradingStatusText(exam.gradingStatus)}
                    </span>
                  </div>

                  <h3 className="font-medium text-gray-900 mb-3">{exam.title}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      <span>{new Date(exam.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {exam.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{exam.room}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <UserGroupIcon className="w-4 h-4" />
                      <span className="font-medium">Penguji:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {exam.examiners.map((examiner, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                          {examiner}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredThesisDefenses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <AcademicCapIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Tidak ada jadwal ujian pendadaran yang ditemukan</p>
            </div>
          )}
        </div>
      </section>
    </DosenLayout>
  );
}