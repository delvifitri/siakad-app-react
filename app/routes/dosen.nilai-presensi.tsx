import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import DosenLayout from "../layouts/DosenLayout";
import { AcademicCapIcon, ClipboardDocumentCheckIcon, MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export function meta() {
  return [{ title: "Nilai & Presensi (Dosen) - Siakad" }];
}

// sample offerings per academic year and semester (ganjil/genap)
const offerings: Record<string, Record<string, Array<any>>> = {
  "2024/2025": {
    Ganjil: [
      { code: "IF301", name: "Pemrograman Web", cls: "A", mahasiswa: 32, time: "08:00–09:40", room: "R-301", students: [
        { nim: "23063116482010012", name: "Jamilah Hamidi Yanti" },
        { nim: "23063116482010016", name: "Nurus Shubuh" },
        { nim: "23063116482010009", name: "Andrianus Bilhot" },
      ] },
      { code: "IF205", name: "Basis Data", cls: "B", mahasiswa: 28, time: "10:00–11:40", room: "R-205", students: [
        { nim: "23063116482010013", name: "Shohihunnatiq Z" },
        { nim: "23063116482010010", name: "Pratiwi May" },
      ] },
      { code: "IF210", name: "Jaringan Komputer", cls: "A", mahasiswa: 30, time: "13:30–15:10", room: "Lab-2", students: [
        { nim: "23063116482010015", name: "Tri Wahyuni" },
        { nim: "23063116482010011", name: "Budi Santoso" },
      ] },
    ],
    Genap: [
      { code: "IF210", name: "Jaringan Komputer", cls: "A", mahasiswa: 30, time: "13:30–15:10", room: "Lab-2", students: [
        { nim: "23063116482010015", name: "Tri Wahyuni" },
        { nim: "23063116482010011", name: "Budi Santoso" },
      ] },
    ],
  },
  "2023/2024": {
    Ganjil: [
      { code: "IF101", name: "Algoritma", cls: "A", mahasiswa: 40, time: "08:00–09:40", room: "R-101", students: [
        { nim: "22063116482010001", name: "Siti Aminah" },
      ] },
    ],
    Genap: [
      { code: "IF102", name: "Matematika Diskret", cls: "B", mahasiswa: 35, time: "10:00–11:40", room: "R-102", students: [
        { nim: "22063116482010002", name: "Agus Salim" },
      ] },
    ],
  },
};

// fallback in case an offering isn't found
const defaultCourses = [
  { code: "IF301", name: "Pemrograman Web", cls: "A", mahasiswa: 32, time: "08:00–09:40", room: "R-301", students: [] },
];

export default function DosenNilaiPresensi() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const years = Object.keys(offerings);
  const offeringOptions: Array<{ value: string; label: string; year: string; semester: string }> = [];
  for (const y of years) {
    const sems = Object.keys(offerings[y] || {});
    for (const s of sems) {
      offeringOptions.push({ value: `${y}|${s}`, label: `${y} — ${s}`, year: y, semester: s });
    }
  }
  const [selectedOffering, setSelectedOffering] = useState<string>(offeringOptions[0]?.value ?? "");
  const [offeringDropdownOpen, setOfferingDropdownOpen] = useState(false);
  const [offeringSearch, setOfferingSearch] = useState('');

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const [selectedYear, selectedSemester] = (selectedOffering || "").split("|");
  const currentCourses: Array<any> = (offerings[selectedYear] && offerings[selectedYear][selectedSemester]) || defaultCourses;

  const filteredOfferingOptions = offeringOptions.filter(option =>
    option.label.toLowerCase().includes(offeringSearch.toLowerCase())
  );
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
      const dropdown = document.querySelector('[data-dropdown="offering"]');
      if (offeringDropdownOpen && dropdown && !dropdown.contains(target)) {
        setOfferingDropdownOpen(false);
        setOfferingSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [offeringDropdownOpen]);

  const OfferingSelect = () => {
    const selectedOption = offeringOptions.find(o => o.value === selectedOffering);
    return (
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Ajaran & Semester</label>
        <div className="relative">
          <button
            onClick={() => setOfferingDropdownOpen(!offeringDropdownOpen)}
            className="w-full px-3 py-2 border rounded-full bg-white shadow-sm text-sm text-left flex items-center justify-between hover:bg-gray-50"
          >
            <span>{selectedOption?.label || "Pilih tahun ajaran"}</span>
            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
          </button>
          {offeringDropdownOpen && (
            <div data-dropdown="offering" className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Cari tahun ajaran & semester..."
                  value={offeringSearch}
                  onChange={(e) => setOfferingSearch(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div className="max-h-48 overflow-y-auto">
                {filteredOfferingOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedOffering(option.value);
                      setOfferingDropdownOpen(false);
                      setOfferingSearch('');
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <DosenLayout bgImage="/bg simple.png">
      <section className="px-4 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Nilai & Presensi</h1>
            <p className="text-sm text-gray-600 mt-1">Kelola nilai dan presensi untuk mata kuliah yang Anda ampu.</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <OfferingSelect />
          <div className="max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={handleSearchChange}
                placeholder="Cari mata kuliah atau kode MK"
                className="pl-10 pr-3 py-2 border rounded-full w-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
          {currentCourses.filter((c: any) => {
            const q = search.trim().toLowerCase();
            if (!q) return true;
            return String(c.name).toLowerCase().includes(q) || String(c.code).toLowerCase().includes(q);
          }).map((c: any) => {
            const slug = `${c.code}-${c.cls}`.toLowerCase().replace(/\s+/g, '-');
            return (
            <div key={c.code+"-"+c.cls} className="bg-white/60 rounded-xl border border-gray-200 p-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">{c.name} ({c.cls})</div>
                  <div className="text-xs text-gray-600">Kode: {c.code} • {c.mahasiswa} mhs</div>
                </div>
                <div className="w-full sm:w-[20rem]">
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => navigate(`/dosen/lihat-nilai/${c.code}`, { state: { course: c.name, cls: c.cls, code: c.code, mahasiswa: c.mahasiswa, time: c.time, room: c.room } })} className="inline-flex items-center justify-center gap-1 px-3 h-10 rounded-full text-xs text-white bg-blue-600 hover:bg-blue-700 w-full">
                      <AcademicCapIcon className="w-4 h-4"/> Lihat Nilai
                    </button>
                    <button onClick={() => navigate(`/dosen/list-presensi/${slug}`, { state: { course: c.name, cls: c.cls, code: c.code, mahasiswa: c.mahasiswa, time: c.time, room: c.room } })} className="inline-flex items-center justify-center gap-1 px-3 h-10 rounded-full text-xs text-white bg-orange-500 hover:bg-orange-600 w-full">
                      <ClipboardDocumentCheckIcon className="w-4 h-4"/> Lihat Presensi
                    </button>
                  </div>
                  {/* per-course student list removed as requested */}
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </section>
    </DosenLayout>
  );
}
