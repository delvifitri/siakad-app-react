import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import DosenLayout from "../layouts/DosenLayout";
import { AcademicCapIcon, ClipboardDocumentCheckIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

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

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const [selectedYear, selectedSemester] = (selectedOffering || "").split("|");
  const currentCourses: Array<any> = (offerings[selectedYear] && offerings[selectedYear][selectedSemester]) || defaultCourses;
  useEffect(() => {
    try {
      const role = localStorage.getItem("userRole");
      if (role !== "dosen") navigate("/", { replace: true });
    } catch {}
  }, [navigate]);

  const OfferingSelect = () => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState(
      offeringOptions.find((o) => o.value === selectedOffering)?.label ?? ""
    );
    const [highlight, setHighlight] = useState(0);
    const rootRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      setQuery(offeringOptions.find((o) => o.value === selectedOffering)?.label ?? "");
    }, [selectedOffering, offeringOptions]);

    useEffect(() => {
      function onDoc(e: MouseEvent) {
        if (!rootRef.current) return;
        if (!rootRef.current.contains(e.target as Node)) setOpen(false);
      }
      document.addEventListener("mousedown", onDoc);
      return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    const options = offeringOptions.filter((o) =>
      o.label.toLowerCase().includes(query.toLowerCase())
    );

    return (
      <div className="relative w-full sm:w-auto" ref={rootRef}>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlight(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
              setOpen(true);
              return;
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlight((h) => Math.min(h + 1, Math.max(0, options.length - 1)));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlight((h) => Math.max(0, h - 1));
            } else if (e.key === "Enter") {
              e.preventDefault();
              const sel = options[highlight];
              if (sel) {
                setSelectedOffering(sel.value);
                setQuery(sel.label);
                setOpen(false);
              }
            }
          }}
          className="px-3 py-2 rounded-full border text-sm bg-white/80 w-full"
          placeholder="Pilih tahun ajaran"
        />
        {open && options.length > 0 && (
          <div className="absolute top-full mt-1 w-full bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            {options.map((o, i) => (
              <div
                key={o.value}
                className={`px-3 py-2 cursor-pointer ${
                  i === highlight ? "bg-blue-100" : "hover:bg-gray-100"
                }`}
                onMouseDown={() => {
                  setSelectedOffering(o.value);
                  setQuery(o.label);
                  setOpen(false);
                }}
              >
                {o.label}
              </div>
            ))}
          </div>
        )}
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
          <div className="justify-end flex">
            <OfferingSelect />
          </div>
          <div className="mb-4 flex flex-col-reverse">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Cari mata kuliah atau kode MK"
                  className="w-full pl-10 pr-3 py-2 border rounded-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
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
