import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DosenLayout from "../layouts/DosenLayout";
import { DocumentTextIcon, PlusIcon, PencilIcon, EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export function meta() {
  return [{ title: "Kelola RPS - Dosen" }];
}

// Sample RPS data
const sampleRpsData = [
  {
    id: "RPS001",
    courseCode: "IF301",
    courseName: "Pemrograman Web",
    semester: "Ganjil 2025/2026",
    status: "aktif",
    lastUpdated: "2025-10-15",
    topics: ["HTML & CSS", "JavaScript", "PHP", "Database Integration"]
  },
  {
    id: "RPS002",
    courseCode: "IF302",
    courseName: "Basis Data",
    semester: "Ganjil 2025/2026",
    status: "draft",
    lastUpdated: "2025-10-10",
    topics: ["Konsep Database", "SQL", "Normalisasi", "Transaksi"]
  },
  {
    id: "RPS003",
    courseCode: "IF303",
    courseName: "Sistem Operasi",
    semester: "Genap 2024/2025",
    status: "aktif",
    lastUpdated: "2025-02-20",
    topics: ["Proses", "Memory Management", "File System", "Scheduling"]
  }
];

export default function DosenKelolaRps() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [rpsData, setRpsData] = useState(sampleRpsData);

  useEffect(() => {
    try {
      const role = localStorage.getItem("userRole");
      if (role !== "dosen") navigate("/", { replace: true });
    } catch {}
  }, [navigate]);

  const filteredRps = rpsData.filter(rps =>
    rps.courseName.toLowerCase().includes(search.toLowerCase()) ||
    rps.courseCode.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aktif":
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-yellow-100 text-yellow-700";
      case "arsip":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "aktif":
        return "Aktif";
      case "draft":
        return "Draft";
      case "arsip":
        return "Arsip";
      default:
        return status;
    }
  };

  return (
    <DosenLayout title="Kelola RPS" bgImage="/bg white.png">
      <div className="p-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Kelola RPS</h1>
          <p className="text-sm text-gray-600 mt-1">Kelola Rencana Pembelajaran Semester untuk mata kuliah yang Anda ampu.</p>
        </header>

        {/* Search and Add Button */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex-1 max-w-md">
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
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-full text-sm hover:bg-orange-700 transition-colors">
            <PlusIcon className="w-4 h-4" />
            Buat RPS Baru
          </button>
        </div>

        {/* RPS List */}
        <div className="space-y-4">
          {filteredRps.map((rps) => (
            <div key={rps.id} className="bg-white/70 backdrop-blur-md rounded-xl p-4 ring-1 ring-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{rps.courseName}</h3>
                      <p className="text-sm text-gray-600">{rps.courseCode} • {rps.semester}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-700 mb-1">Topik Pembelajaran:</p>
                    <div className="flex flex-wrap gap-2">
                      {rps.topics.slice(0, 3).map((topic, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                          {topic}
                        </span>
                      ))}
                      {rps.topics.length > 3 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs">
                          +{rps.topics.length - 3} lainnya
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Terakhir diupdate: {new Date(rps.lastUpdated).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rps.status)}`}>
                    {getStatusText(rps.status)}
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700">
                      <EyeIcon className="w-4 h-4" />
                      Lihat
                    </button>
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-600 text-white rounded-full text-sm hover:bg-gray-700">
                      <PencilIcon className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredRps.length === 0 && (
            <div className="text-center text-sm text-gray-500 py-8">
              {search ? `Tidak ada RPS yang cocok dengan "${search}"` : "Belum ada RPS yang dibuat"}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/70 backdrop-blur-md rounded-xl p-4 ring-1 ring-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-600">{rpsData.filter(r => r.status === 'aktif').length}</div>
            <div className="text-sm text-gray-600">RPS Aktif</div>
          </div>
          <div className="bg-white/70 backdrop-blur-md rounded-xl p-4 ring-1 ring-gray-200 text-center">
            <div className="text-2xl font-bold text-yellow-600">{rpsData.filter(r => r.status === 'draft').length}</div>
            <div className="text-sm text-gray-600">RPS Draft</div>
          </div>
          <div className="bg-white/70 backdrop-blur-md rounded-xl p-4 ring-1 ring-gray-200 text-center">
            <div className="text-2xl font-bold text-green-600">{rpsData.length}</div>
            <div className="text-sm text-gray-600">Total RPS</div>
          </div>
        </div>
      </div>
    </DosenLayout>
  );
}
