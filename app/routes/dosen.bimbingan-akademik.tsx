import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DosenLayout from "../layouts/DosenLayout";
import { UserIcon, CheckCircleIcon, ClockIcon, ChatBubbleLeftRightIcon, EyeIcon, MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export function meta() {
  return [{ title: "Bimbingan Akademik (Dosen) - Siakad" }];
}

const academicYears = [
  "2023/2024",
  "2024/2025"
];

const semesters = ["Ganjil", "Genap"];

const academicYearSemesters = academicYears.flatMap(year =>
  semesters.map(sem => `${year} - ${sem}`)
);

const adviseesByAcademic: Record<string, Array<{ name: string; nim: string; semester: number; status: string; chatId: number }>> = {
  "2023/2024 - Ganjil": [
    { name: "Ani Lestari", nim: "202101234", semester: 3, status: "aktif", chatId: 9 },
    { name: "Citra Rahma", nim: "202101236", semester: 7, status: "aktif", chatId: 11 },
  ],
  "2023/2024 - Genap": [
    { name: "Citra Rahma", nim: "202101236", semester: 7, status: "aktif", chatId: 11 },
  ],
  "2024/2025 - Ganjil": [
    { name: "Budi Santoso", nim: "202101235", semester: 5, status: "butuh konsultasi", chatId: 10 },
    { name: "Ani Lestari", nim: "202101234", semester: 3, status: "aktif", chatId: 9 },
  ],
  "2024/2025 - Genap": [
    { name: "Budi Santoso", nim: "202101235", semester: 5, status: "butuh konsultasi", chatId: 10 },
  ],
};

export default function DosenBimbinganAkademik() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredAcademicOptions = academicYearSemesters.filter(option =>
    option.toLowerCase().includes(academicSearch.toLowerCase())
  );

  const adviseesForSelected = adviseesByAcademic[selectedAcademicYearSemester] ?? [];
  const filteredAdvisees = adviseesForSelected.filter((mhs) =>
    mhs.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mhs.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(mhs.semester).includes(searchQuery)
  );

  return (
    <DosenLayout bgImage="/bg simple.png">
      <section className="px-4 pt-6 pb-24">
        <h1 className="text-xl font-bold text-gray-900">Bimbingan Akademik</h1>
        <p className="text-sm text-gray-600 mt-1">Kelola pembimbingan akademik mahasiswa bimbingan Anda.</p>

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

        {/* Search input */}
        <div className="mt-4 max-w-md">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari mahasiswa — nama atau NIM"
              className="pl-10 pr-3 py-2 border rounded-full w-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {filteredAdvisees.map((mhs, idx) => (
            <div key={idx} className="bg-white/60 rounded-xl border border-gray-200 p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0"><UserIcon className="w-5 h-5"/></div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-gray-900">{mhs.name} <span className="text-xs text-gray-500">({mhs.nim})</span></div>
                    <div className="text-xs text-gray-600">Semester {mhs.semester}</div>
                    <div className="mt-2">
                      {mhs.status === "aktif" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-emerald-100 text-emerald-700"><CheckCircleIcon className="w-4 h-4"/> Baik</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-amber-100 text-amber-700"><ClockIcon className="w-4 h-4"/> Butuh Konsultasi</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-3 flex-shrink-0">
                  <button
                    onClick={() => navigate(`/chat/${mhs.chatId}`)}
                    className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-xs bg-blue-600 text-white hover:bg-blue-700 whitespace-nowrap"
                    aria-label={`Chat dengan ${mhs.name}`}
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    Chat
                  </button>
                  <button
                    onClick={() => navigate(`/krs-khs?nim=${mhs.nim}&from=dosen&disableKrs=true&tab=ipk`)}
                    className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-xs bg-orange-600 text-white hover:bg-orange-700 whitespace-nowrap"
                    aria-label={`Lihat detail akademik ${mhs.name}`}
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
    </DosenLayout>
  );
}
