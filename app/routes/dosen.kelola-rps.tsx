import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DosenLayout from "../layouts/DosenLayout";
import { DocumentTextIcon, PencilIcon, EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export function meta() {
  return [{ title: "Kelola RPS - Dosen" }];
}

// Sample RPS data
const sampleRpsData = [
  {
    id: "RPS001",
    courseCode: "IF301",
    courseName: "Pemrograman Web",
    classes: ["A", "B"],
    semester: "Ganjil 2025/2026",
    status: "aktif",
    lastUpdated: "2025-10-15",
    topics: [
      { pertemuan: '1', materiIndonesia: 'Pengenalan HTML5 dan CSS3 untuk membuat struktur halaman web.', materiInggris: 'Introduction to HTML5 & CSS3' },
      { pertemuan: '2', materiIndonesia: 'Dasar-dasar JavaScript untuk interaktivitas web.', materiInggris: 'Basics of JavaScript' },
      { pertemuan: '3', materiIndonesia: 'Backend dengan PHP (contoh sederhana).', materiInggris: 'Server-side with PHP' },
      { pertemuan: '4', materiIndonesia: 'Integrasi Database dengan aplikasi web.', materiInggris: 'Database Integration' }
    ]
  },
  {
    id: "RPS002",
    courseCode: "IF302",
    courseName: "Basis Data",
    classes: ["A"],
    semester: "Ganjil 2025/2026",
    status: "draft",
    lastUpdated: "2025-10-10",
    topics: [
      { pertemuan: '1', materiIndonesia: 'Pengenalan konsep database relasional.', materiInggris: 'Introduction to Relational Databases' },
      { pertemuan: '2', materiIndonesia: 'Bahasa SQL untuk manipulasi data.', materiInggris: 'SQL for Data Manipulation' },
      { pertemuan: '3', materiIndonesia: 'Normalisasi basis data.', materiInggris: 'Database Normalization' },
      { pertemuan: '4', materiIndonesia: 'Konsep transaksi dan ACID.', materiInggris: 'Transactions and ACID properties' }
    ]
  },
  {
    id: "RPS003",
    courseCode: "IF303",
    courseName: "Sistem Operasi",
    classes: ["A", "B", "C"],
    semester: "Genap 2024/2025",
    status: "aktif",
    lastUpdated: "2025-02-20",
    topics: [
      { pertemuan: '1', materiIndonesia: 'Konsep proses dan manajemen proses.', materiInggris: 'Processes and Process Management' },
      { pertemuan: '2', materiIndonesia: 'Manajemen memori.', materiInggris: 'Memory Management' },
      { pertemuan: '3', materiIndonesia: 'Sistem file dan operasi I/O.', materiInggris: 'File Systems & I/O' },
      { pertemuan: '4', materiIndonesia: 'Algoritma penjadwalan CPU.', materiInggris: 'CPU Scheduling Algorithms' }
    ]
  }
];

export default function DosenKelolaRps() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [rpsData, setRpsData] = useState(sampleRpsData);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRps, setSelectedRps] = useState<any>(null);

  // Load persisted RPS data from localStorage if available
  useEffect(() => {
    try {
      const raw = localStorage.getItem('rpsData');
      if (raw) {
        setRpsData(JSON.parse(raw));
      }
    } catch {}
  }, []);

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
      default:
        return status;
    }
  };

  // Modal handlers
  const handleView = (rps: any) => {
    setSelectedRps(rps);
    setShowViewModal(true);
  };

  // Note: creating a new RPS is handled via a separate flow/page if needed.

  const handleInputRps = (rps: any, kelas: string) => {
    // persist current rpsData so the input page can load and edit it
    try {
      localStorage.setItem('rpsData', JSON.stringify(rpsData));
    } catch {}
    // navigate to dedicated input page for this RPS and class
    navigate(`/dosen/input-rps/${rps.id}/${kelas}`);
  };

  // helper to persist rpsData when changed from this page
  useEffect(() => {
    try {
      localStorage.setItem('rpsData', JSON.stringify(rpsData));
    } catch {}
  }, [rpsData]);

  return (
  <DosenLayout title="Kelola RPS" bgImage="/bg simple.png">
      <div className="p-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Kelola RPS</h1>
          <p className="text-sm text-gray-600 mt-1">Kelola Rencana Pembelajaran Semester untuk mata kuliah yang Anda ampu.</p>
        </header>

        {/* Search */}
        <div className="mb-6">
          <div className="max-w-md">
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
        </div>

        {/* RPS List - mobile-first card layout */}
        <div className="space-y-3">
          {filteredRps.length === 0 ? (
            <div className="text-center text-sm text-gray-500 py-8">
              {search ? `Tidak ada RPS yang cocok dengan "${search}"` : "Belum ada RPS yang dibuat"}
            </div>
          ) : (
            filteredRps.map((rps) => {
              const taMatch = (rps.semester || "").match(/(\d{4}\/\d{4})/);
              const ta = taMatch ? taMatch[1] : rps.semester || "-";
              const prodi = rps.courseName.split(' ')[0] || '-';
              return (
                <div key={rps.id} className="bg-white/70 backdrop-blur-md rounded-xl p-3 ring-1 ring-gray-200 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">{rps.courseName}</div>
                        <div className="text-xs text-gray-500 mt-1">{rps.courseCode} • {prodi}</div>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <div>{ta}</div>
                        <div className="mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{getStatusText(rps.status)}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {rps.topics && rps.topics.length > 0 ? rps.topics[0].materiIndonesia : ''}
                    </div>
                  </div>
                  <div className="sm:w-40 flex flex-col gap-2">
                    {(rps.classes && rps.classes.length > 0 ? rps.classes : ["A"]).map((kelas) => (
                      <a
                        key={kelas}
                        href={`/dosen/input-rps/${rps.id}/${kelas}`}
                        onClick={(e) => {
                          // persist rpsData so the input page can read it after navigation
                          try { localStorage.setItem('rpsData', JSON.stringify(rpsData)); } catch {}
                        }}
                        className="w-full inline-block text-center px-3 py-2 bg-teal-500 text-white rounded-full text-sm hover:bg-teal-600"
                      >
                        Input RPS • Kelas {kelas}
                      </a>
                    ))}
                  </div>
                </div>
              );
            })
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

      {/* View Modal */}
      {showViewModal && selectedRps && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowViewModal(false)} />
          <div className="relative bg-white rounded-2xl w-full sm:max-w-2xl mx-4 p-6 shadow-lg max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Detail RPS</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kode Mata Kuliah</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedRps.courseCode}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama Mata Kuliah</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedRps.courseName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Semester</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedRps.semester}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRps.status)}`}>
                    {getStatusText(selectedRps.status)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topik Pembelajaran</label>
                <div className="flex flex-wrap gap-2">
                  {selectedRps.topics.map((topic: any, idx: number) => (
                    <div key={idx} className="w-full p-3 bg-blue-50 rounded-lg">
                      <div className="text-xs text-gray-600">Pertemuan ke {topic.pertemuan}</div>
                      <div className="font-medium text-blue-700 mt-1">{topic.materiIndonesia}</div>
                      {topic.materiInggris && (
                        <div className="text-sm text-gray-600 mt-1">{topic.materiInggris}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Terakhir Diupdate</label>
                <p className="mt-1 text-sm text-gray-900">{new Date(selectedRps.lastUpdated).toLocaleDateString('id-ID')}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => setShowViewModal(false)} className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input RPS is now a dedicated page; the modal was removed. */}
    </DosenLayout>
  );
}
