import DosenLayout from "../layouts/DosenLayout";
import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ArrowLeftIcon from "../components/ArrowLeftIcon";

export function meta() {
  return [{ title: "Detail Pengajuan KRS - Dosen" }];
}

type CourseRow = { code: string; name: string; sks: number; cls: string; status: "menunggu" | "disetujui" | "ditolak" };

export default function DosenApproveKrsDetail() {
  const { nim } = useParams();
  const navigate = useNavigate();

  // Dummy student data keyed by nim (fallback)
  const student = useMemo(() => {
    const map: Record<string, any> = {
      "202101234": { name: "Ani Lestari", nim: "202101234", program: "Informatika S1", semester: "6", advisor: "Dr. Rina Putri" },
      "202101235": { name: "Budi Santoso", nim: "202101235", program: "Informatika S1", semester: "6", advisor: "Dr. Rina Putri" },
      "202101236": { name: "Citra Rahma", nim: "202101236", program: "Sistem Informasi S1", semester: "5", advisor: "Dr. Ahmad Fauzi" },
    };
    return map[nim ?? ""] || { name: "Mahasiswa Tidak Ditemukan", nim: nim ?? "-", program: "-", semester: "-", advisor: "-" };
  }, [nim]);

  // Dummy requested courses
  const initialCourses = useMemo<CourseRow[]>(() => [
    { code: "IF301", name: "Pemrograman Web", sks: 3, cls: "A", status: "menunggu" },
    { code: "IF302", name: "Basis Data", sks: 2, cls: "B", status: "menunggu" },
    { code: "IF303", name: "Sistem Operasi", sks: 3, cls: "A", status: "disetujui" },
    { code: "IF304", name: "Jaringan Komputer", sks: 3, cls: "B", status: "menunggu" },
  ], []);

  const [courses, setCourses] = useState<CourseRow[]>(initialCourses);
  const [search, setSearch] = useState<string>("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  // dummy approval window dates (display only)
  const approvalStart = "01 Okt 2025";
  const approvalEnd = "07 Okt 2025";

  const approveCourse = (code: string) => {
    setCourses((prev) => prev.map((c) => (c.code === code ? { ...c, status: "disetujui" } : c)));
  };
  const rejectCourse = (code: string) => {
    setCourses((prev) => prev.map((c) => (c.code === code ? { ...c, status: "ditolak" } : c)));
  };

  const handleSelectCourse = (code: string) => {
    setSelectedCourses(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code) 
        : [...prev, code]
    );
  };

  const handleSelectAllCourses = () => {
    const filteredCourses = courses.filter((c) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
    });
    
    const allSelected = filteredCourses.every(c => selectedCourses.includes(c.code));
    if (allSelected) {
      setSelectedCourses(prev => prev.filter(code => !filteredCourses.some(c => c.code === code)));
    } else {
      const newSelections = filteredCourses.map(c => c.code).filter(code => !selectedCourses.includes(code));
      setSelectedCourses(prev => [...prev, ...newSelections]);
    }
  };

  const handleBulkApprove = () => {
    if (selectedCourses.length === 0) {
      alert("Pilih mata kuliah terlebih dahulu");
      return;
    }
    setCourses((prev) => prev.map((c) => 
      selectedCourses.includes(c.code) 
        ? { ...c, status: "disetujui" } 
        : c
    ));
    setSelectedCourses([]);
  };

  const handleRemoveAllApprovals = () => {
    const hasApprovedCourses = courses.some(c => c.status === "disetujui");
    if (!hasApprovedCourses) {
      alert("Tidak ada mata kuliah yang disetujui");
      return;
    }
    setCourses((prev) => prev.map((c) => 
      c.status === "disetujui" 
        ? { ...c, status: "menunggu" } 
        : c
    ));
  };

  const handleBulkReject = () => {
    if (selectedCourses.length === 0) {
      alert("Pilih mata kuliah terlebih dahulu");
      return;
    }
    setCourses((prev) => prev.map((c) => 
      selectedCourses.includes(c.code) 
        ? { ...c, status: "ditolak" } 
        : c
    ));
    setSelectedCourses([]);
  };

  const approvedCount = courses.filter((c) => c.status === "disetujui").length;
  const totalCount = courses.length;

  return (
    <DosenLayout title={`Detail KRS — ${student.name}`} bgImage="/bg white.png">
      <div className="p-4">
        <div className="flex items-start justify-between mb-4 gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Detail Pengajuan KRS</h1>
                <p className="text-sm text-gray-600">Verifikasi dan persetujuan pengajuan KRS mahasiswa.</p>
              </div>
            </div>
          </div>

          {/* top-right: approved count only (approval window moved below header) */}
          <div className="flex items-center">
            <div className="text-sm px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold">{`${approvedCount}/${totalCount}`}</div>
          </div>
        </div>

        {/* approval window alert - placed above student info as requested */}
        <div className="mb-3">
          <div className="text-sm px-3 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium inline-block">Approve KRS: {approvalStart} — {approvalEnd}</div>
        </div>

        <section className="mb-4 bg-white/70 backdrop-blur-md rounded-xl p-3 ring-1 ring-gray-200">
          <p className="text-sm font-medium text-gray-900">{student.name}</p>
          <p className="text-xs text-gray-600">NIM {student.nim} • {student.program} • Semester {student.semester}</p>
          <p className="text-xs text-gray-600">Dosen PA: {student.advisor}</p>
        </section>

        {/* search for courses */}
        <div className="mb-4 max-w-md">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari mata kuliah atau kode MK"
              className="pl-12 pr-3 py-2 border rounded-full w-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Action buttons - Select All and Remove Approvals */}
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={handleSelectAllCourses}
            className="px-4 py-2 bg-orange-600 text-white rounded-full text-sm hover:bg-orange-700 transition-colors"
          >
            {(() => {
              const filteredCourses = courses.filter((c) => {
                const q = search.trim().toLowerCase();
                if (!q) return true;
                return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
              });
              return filteredCourses.every(c => selectedCourses.includes(c.code)) ? 'Batal Pilih Semua' : 'Pilih Semua';
            })()}
          </button>
          <button
            onClick={handleRemoveAllApprovals}
            disabled={!courses.some(c => c.status === "disetujui")}
            className="px-4 py-2 bg-red-700 text-white rounded-full text-sm hover:bg-red-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Hapus Disetujui
          </button>
        </div>

        <section className="space-y-3">
          {courses.filter((c) => {
            const q = search.trim().toLowerCase();
            if (!q) return true;
            return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
          }).map((c) => (
            <div key={c.code} className="flex items-center justify-between bg-white/70 backdrop-blur-md rounded-xl px-3 py-2 ring-1 ring-gray-200">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(c.code)}
                  onChange={() => handleSelectCourse(c.code)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{c.name} <span className="text-xs text-gray-600">({c.code})</span></p>
                  <p className="text-xs text-gray-600">Kelas {c.cls} • {c.sks} SKS</p>
                </div>
              </div>
              <div className="flex items-center">
                {c.status === "disetujui" && <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Disetujui</span>}
                {c.status === "ditolak" && <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">Ditolak</span>}
                {c.status === "menunggu" && <span className="text-[11px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">Menunggu</span>}
              </div>
            </div>
          ))}

          {courses.filter((c) => {
            const q = search.trim().toLowerCase();
            if (!q) return true;
            return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
          }).length === 0 && (
            <div className="text-center text-sm text-gray-500 py-6">Tidak ada mata kuliah yang cocok untuk "{search}"</div>
          )}
        </section>

        <div className="flex items-center gap-3 mt-4">
          <button 
            onClick={handleBulkApprove}
            disabled={selectedCourses.length === 0}
            className="px-4 py-2 bg-emerald-600 text-white rounded-full text-sm hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Approve ({selectedCourses.length})
          </button>
          <button 
            onClick={handleBulkReject}
            disabled={selectedCourses.length === 0}
            className="px-4 py-2 bg-red-600 text-white rounded-full text-sm hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Reject ({selectedCourses.length})
          </button>
        </div>
      </div>
    </DosenLayout>
  );
}
