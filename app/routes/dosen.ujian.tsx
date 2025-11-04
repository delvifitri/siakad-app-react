import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DosenLayout from "../layouts/DosenLayout";
import { ClipboardDocumentCheckIcon, InformationCircleIcon, MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export function meta() {
  return [{ title: "Ujian (Dosen) - Siakad" }];
}

const examData: Record<string, { UTS: Array<{ course: string; date: string; room: string; role: string }>; UAS: Array<{ course: string; date: string; room: string; role: string }> }> = {
  "2023/2024 - Ganjil": {
    UTS: [
      { course: "Algoritma & Pemrograman", date: "Sen, 08:00", room: "R 201", role: "Pengawas" },
      { course: "Matematika Diskrit", date: "Sel, 10:00", room: "R 305", role: "Pengawas" },
      { course: "Sistem Digital", date: "Rab, 13:00", room: "Lab Komputer 1", role: "Pengawas" },
    ],
    UAS: [
      { course: "Struktur Data", date: "Sen, 09:00", room: "R 202", role: "Pengawas" },
      { course: "Algoritma & Pemrograman", date: "Sel, 14:00", room: "R 301", role: "Pengawas" },
      { course: "Matematika Diskrit", date: "Kam, 11:00", room: "R 405", role: "Pengawas" },
    ]
  },
  "2023/2024 - Genap": {
    UTS: [
      { course: "Basis Data", date: "Sen, 09:00", room: "R 203", role: "Pengawas" },
      { course: "Pemrograman Web", date: "Sel, 13:00", room: "Lab Multimedia", role: "Pengawas" },
      { course: "Sistem Operasi", date: "Rab, 15:00", room: "R 304", role: "Pengawas" },
    ],
    UAS: [
      { course: "Jaringan Komputer", date: "Sen, 10:00", room: "Lab Jaringan", role: "Pengawas" },
      { course: "Basis Data", date: "Sel, 08:00", room: "R 206", role: "Pengawas" },
      { course: "Pemrograman Web", date: "Kam, 16:00", room: "R 402", role: "Pengawas" },
    ]
  },
  "2024/2025 - Ganjil": {
    UTS: [
      { course: "Rekayasa Perangkat Lunak", date: "Sen, 10:00", room: "R 207", role: "Pengawas" },
      { course: "Keamanan Informasi", date: "Sel, 14:00", room: "Lab Security", role: "Pengawas" },
      { course: "Machine Learning", date: "Rab, 09:00", room: "R 308", role: "Pengawas" },
    ],
    UAS: [
      { course: "Data Mining", date: "Sen, 13:00", room: "R 209", role: "Pengawas" },
      { course: "Rekayasa Perangkat Lunak", date: "Sel, 11:00", room: "Lab RPL", role: "Pengawas" },
      { course: "Keamanan Informasi", date: "Kam, 15:00", room: "R 401", role: "Pengawas" },
    ]
  },
  "2024/2025 - Genap": {
    UTS: [
      { course: "Cloud Computing", date: "Sen, 11:00", room: "R 210", role: "Pengawas" },
      { course: "DevOps", date: "Sel, 16:00", room: "Lab Cloud", role: "Pengawas" },
      { course: "Big Data Analytics", date: "Rab, 10:00", room: "R 309", role: "Pengawas" },
    ],
    UAS: [
      { course: "Microservices", date: "Sen, 14:00", room: "R 211", role: "Pengawas" },
      { course: "Cloud Computing", date: "Sel, 09:00", room: "Lab DevOps", role: "Pengawas" },
      { course: "Big Data Analytics", date: "Kam, 13:00", room: "R 403", role: "Pengawas" },
    ]
  }
};

const utsExams = [
  { course: "Basis Data", date: "Jum, 10:00", room: "R 101", role: "Pengawas" },
  { course: "Pemrograman Web", date: "Sab, 14:00", room: "R 102", role: "Pengawas" },
  { course: "Sistem Operasi", date: "Sen, 09:00", room: "R 103", role: "Pengawas" },
];

const uasExams = [
  { course: "Jaringan Komputer", date: "Sen, 13:00", room: "R 104", role: "Pengawas" },
  { course: "Basis Data", date: "Sel, 10:00", room: "R 101", role: "Pengawas" },
  { course: "Pemrograman Web", date: "Kam, 15:00", room: "R 102", role: "Pengawas" },
];

const academicYears = [
  "2023/2024",
  "2024/2025"
];

const semesters = ["Ganjil", "Genap"];

const academicYearSemesters = academicYears.flatMap(year =>
  semesters.map(sem => `${year} - ${sem}`)
);

export default function DosenUjian() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'UTS' | 'UAS'>('UTS');
  const [utsSearch, setUtsSearch] = useState('');
  const [uasSearch, setUasSearch] = useState('');
  const [selectedAcademicYearSemester, setSelectedAcademicYearSemester] = useState('2024/2025 - Ganjil');
  const [academicDropdownOpen, setAcademicDropdownOpen] = useState(false);
  const [academicSearch, setAcademicSearch] = useState('');

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
      const dropdown = document.querySelector('[data-dropdown="academic"]');
      if (academicDropdownOpen && dropdown && !dropdown.contains(target)) {
        setAcademicDropdownOpen(false);
        setAcademicSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [academicDropdownOpen]);

  const currentExams = examData[selectedAcademicYearSemester]?.[activeTab] || utsExams;
  const search = (activeTab === 'UTS' ? utsSearch : uasSearch).toLowerCase();
  const filteredExams = currentExams.filter((e) =>
    e.course.toLowerCase().includes(search) ||
    e.room.toLowerCase().includes(search) ||
    e.role.toLowerCase().includes(search)
  );

  const filteredAcademicOptions = academicYearSemesters.filter(option =>
    option.toLowerCase().includes(academicSearch.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeTab === 'UTS') setUtsSearch(e.target.value);
    else setUasSearch(e.target.value);
  };

  return (
    <DosenLayout bgImage="/bg simple.png">
      <section className="px-4 pt-6">
        <h1 className="text-xl font-bold text-gray-900">Ujian</h1>
        <p className="text-sm text-gray-600 mt-1">Jadwal ujian yang melibatkan Anda.</p>

        {/* Tab Navigation */}
        <div className="mt-4 flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('UTS')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'UTS'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            UTS
          </button>
          <button
            onClick={() => setActiveTab('UAS')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'UAS'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            UAS
          </button>
        </div>

        {/* Academic Year and Semester Selection */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Ajaran & Semester</label>
          <div className="relative">
            <button
              onClick={() => setAcademicDropdownOpen(!academicDropdownOpen)}
              className="w-full px-3 py-2 border rounded-full bg-white shadow-sm text-sm text-left flex items-center justify-between hover:bg-gray-50"
            >
              <span>{selectedAcademicYearSemester}</span>
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            </button>
            {academicDropdownOpen && (
              <div data-dropdown="academic" className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="Cari tahun ajaran & semester..."
                    value={academicSearch}
                    onChange={(e) => setAcademicSearch(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredAcademicOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedAcademicYearSemester(option);
                        setAcademicDropdownOpen(false);
                        setAcademicSearch('');
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search input for the active tab */}
        <div className="mt-4 max-w-md">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={activeTab === 'UTS' ? utsSearch : uasSearch}
              onChange={handleSearchChange}
              placeholder={activeTab === 'UTS' ? 'Cari UTS — nama mata kuliah, ruang, atau peran' : 'Cari UAS — nama mata kuliah, ruang, atau peran'}
              className="pl-10 pr-3 py-2 border rounded-full w-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {filteredExams.map((e, idx) => (
            <div key={idx} className="bg-white/60 rounded-xl border border-gray-200 p-3">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-semibold text-gray-900">{e.course}</div>
                  <div className="text-xs text-gray-600">{e.date} • {e.room} • {e.role}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      const courseSlug = e.course.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
                      const yearSlug = selectedAcademicYearSemester.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
                      navigate(`/dosen/presensi-pengawas/${courseSlug}-${yearSlug}`, {
                        state: {
                          course: e.course,
                          time: e.date,
                          room: e.room,
                          academicYear: selectedAcademicYearSemester
                        }
                      });
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-white text-xs bg-emerald-600 hover:bg-emerald-700"
                  >
                    <ClipboardDocumentCheckIcon className="w-4 h-4"/> Presensi Pengawas
                  </button>
                  <button 
                    onClick={() => {
                      const courseSlug = e.course.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
                      const yearSlug = selectedAcademicYearSemester.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
                      navigate(`/dosen/detail-presensi-ujian/${courseSlug}-${yearSlug}`, {
                        state: {
                          course: e.course,
                          time: e.date,
                          room: e.room,
                          academicYear: selectedAcademicYearSemester
                        }
                      });
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-gray-700 text-xs bg-gray-100 hover:bg-gray-200"
                  >
                    <InformationCircleIcon className="w-4 h-4"/> Detail Presensi
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </DosenLayout>
  );
}
