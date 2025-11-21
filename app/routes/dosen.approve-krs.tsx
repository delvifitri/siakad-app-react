import DosenLayout from "../layouts/DosenLayout";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { MagnifyingGlassIcon, CheckIcon } from "@heroicons/react/24/outline";

export function meta() {
  return [{ title: "Approve KRS - Dosen" }];
}

export default function DosenApproveKrs() {
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [submissions, setSubmissions] = useState([
    { name: "Ani Lestari", nim: "202101234", program: "Informatika S1", semester: "6", approved: 12, total: 20, status: "pending" },
    { name: "Budi Santoso", nim: "202101235", program: "Informatika S1", semester: "6", approved: 7, total: 10, status: "pending" },
    { name: "Citra Rahma", nim: "202101236", program: "Sistem Informasi S1", semester: "5", approved: 3, total: 8, status: "pending" },
  ]);
  // dummy approval window dates (display only)
  const approvalStart = "01 Okt 2025";
  const approvalEnd = "07 Okt 2025";
  const academicYear = "2025/2026";
  const semester = "Ganjil";
  // for now KRS is open; change logic later to read real status
  const krsOpen = true;

  const filteredList = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return submissions;
    return submissions.filter((s) => s.name.toLowerCase().includes(q) || s.nim.toLowerCase().includes(q));
  }, [submissions, search]);

  const handleSelectStudent = (nim: string) => {
    setSelectedStudents(prev => 
      prev.includes(nim) 
        ? prev.filter(id => id !== nim) 
        : [...prev, nim]
    );
  };

  const handleSelectAll = () => {
    const allSelected = filteredList.every(s => selectedStudents.includes(s.nim));
    if (allSelected) {
      setSelectedStudents(prev => prev.filter(id => !filteredList.some(s => s.nim === id)));
    } else {
      const newSelections = filteredList.map(s => s.nim).filter(id => !selectedStudents.includes(id));
      setSelectedStudents(prev => [...prev, ...newSelections]);
    }
  };

  const handleApprove = () => {
    if (selectedStudents.length === 0) {
      alert("Pilih mahasiswa terlebih dahulu");
      return;
    }
    // Update status to "disetujui" for selected students
    setSubmissions(prev => prev.map(sub => 
      selectedStudents.includes(sub.nim) 
        ? { ...sub, status: "disetujui" }
        : sub
    ));
    setSelectedStudents([]);
  };

  const handleRemoveApproval = () => {
    if (selectedStudents.length === 0) {
      alert("Pilih mahasiswa terlebih dahulu");
      return;
    }
    // Update status back to "pending" for selected students
    setSubmissions(prev => prev.map(sub => 
      selectedStudents.includes(sub.nim) 
        ? { ...sub, status: "pending" }
        : sub
    ));
    setSelectedStudents([]);
  };

  return (
    <DosenLayout title="Approve KRS" bgImage="/bg white.png">
      <div className="p-4">
        <header className="mb-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Pengajuan KRS Mahasiswa</h1>
            <p className="text-sm text-gray-600">Daftar mahasiswa yang mengajukan KRS ke Dosen PA.</p>
          </div>

          {/* KRS status badge (top-right) */}
          <div>
            {krsOpen ? (
              <div className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold">KRS Dibuka</div>
            ) : (
              <div className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-800 font-semibold">KRS Ditutup</div>
            )}
          </div>
        </header>

        {/* KRS period information card */}
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-blue-900">Periode Pengajuan KRS</h3>
              <p className="text-sm text-black mt-1">
                KRS dibuka dari tanggal {approvalStart} sampai {approvalEnd}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Tahun Ajaran {academicYear} • Semester {semester}
              </p>
            </div>
          </div>
        </div>

        {/* search input */}
        <div className="mb-4 max-w-md">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau NIM"
              className="pl-12 pr-3 py-2 border rounded-full w-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Select All button - below search */}
        <div className="mb-4">
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 bg-orange-600 text-white rounded-full text-sm hover:bg-orange-700 transition-colors"
          >
            {filteredList.every(s => selectedStudents.includes(s.nim)) ? 'Batal Pilih Semua' : 'Pilih Semua'}
          </button>
        </div>

        <div className="space-y-3">
          {filteredList.map((s) => (
            <div key={s.nim} className="flex items-center justify-between bg-white/70 backdrop-blur-md rounded-xl px-3 py-3 ring-1 ring-gray-200">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(s.nim)}
                  onChange={() => handleSelectStudent(s.nim)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{s.name}</p>
                  <p className="text-xs text-gray-600">{s.nim} • {s.program} • Semester {s.semester}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold">{`${s.approved}/${s.total}`}</div>
                <div className="flex flex-col items-end gap-1">
                  <button
                    onClick={() => navigate(`/dosen/approve-krs/${s.nim}`)}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700"
                  >
                    Detail
                  </button>
                  {s.status === "disetujui" && (
                    <div className="text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                      Disetujui
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* no results */}
          {filteredList.length === 0 && (
            <div className="text-center text-sm text-gray-500 py-6">Tidak ada hasil untuk "{search}"</div>
          )}
        </div>

        {/* Action buttons */}
        {filteredList.length > 0 && (
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleApprove}
              disabled={selectedStudents.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-full text-sm hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Approve ({selectedStudents.length})
            </button>
            <button
              onClick={handleRemoveApproval}
              disabled={selectedStudents.length === 0 || !selectedStudents.some(nim => submissions.find(s => s.nim === nim)?.status === "disetujui")}
              className="px-4 py-2 bg-red-700 text-white rounded-full text-sm hover:bg-red-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Hapus Disetujui ({selectedStudents.filter(nim => submissions.find(s => s.nim === nim)?.status === "disetujui").length})
            </button>
          </div>
        )}

      </div>
    </DosenLayout>
  );
}
