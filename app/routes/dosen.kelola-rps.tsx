import { useEffect, useState, useRef } from "react";
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
    topics: [
      { name: "HTML & CSS", content: "Pengenalan HTML5 dan CSS3 untuk membuat struktur dan styling halaman web.", fileName: null },
      { name: "JavaScript", content: "Dasar-dasar JavaScript untuk interaktivitas web.", fileName: null },
      { name: "PHP", content: "Backend development dengan PHP untuk server-side processing.", fileName: "php_guide.pdf" },
      { name: "Database Integration", content: "Mengintegrasikan database dengan aplikasi web.", fileName: null }
    ]
  },
  {
    id: "RPS002",
    courseCode: "IF302",
    courseName: "Basis Data",
    semester: "Ganjil 2025/2026",
    status: "draft",
    lastUpdated: "2025-10-10",
    topics: [
      { name: "Konsep Database", content: "Pengenalan konsep database relasional.", fileName: null },
      { name: "SQL", content: "Bahasa query untuk manipulasi data.", fileName: "sql_cheatsheet.pdf" },
      { name: "Normalisasi", content: "Teknik normalisasi untuk mengoptimalkan struktur database.", fileName: null },
      { name: "Transaksi", content: "Konsep transaksi dan ACID properties.", fileName: null }
    ]
  },
  {
    id: "RPS003",
    courseCode: "IF303",
    courseName: "Sistem Operasi",
    semester: "Genap 2024/2025",
    status: "aktif",
    lastUpdated: "2025-02-20",
    topics: [
      { name: "Proses", content: "Konsep proses dan manajemen proses dalam sistem operasi.", fileName: null },
      { name: "Memory Management", content: "Teknik manajemen memori.", fileName: "memory_management.pdf" },
      { name: "File System", content: "Sistem file dan operasi I/O.", fileName: null },
      { name: "Scheduling", content: "Algoritma penjadwalan CPU.", fileName: null }
    ]
  }
];

export default function DosenKelolaRps() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [rpsData, setRpsData] = useState(sampleRpsData);

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRps, setSelectedRps] = useState<any>(null);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    semester: "",
    status: "draft",
    topics: [] as Array<{name: string, content: string, fileName: string | null}>
  });
  const [topicInput, setTopicInput] = useState("");
  const [topicContent, setTopicContent] = useState("");
  const [topicFile, setTopicFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Modal handlers
  const handleView = (rps: any) => {
    setSelectedRps(rps);
    setShowViewModal(true);
  };

  const handleAdd = () => {
    setFormData({
      courseCode: "",
      courseName: "",
      semester: "",
      status: "draft",
      topics: []
    });
    setTopicInput("");
    setTopicContent("");
    setTopicFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setShowAddModal(true);
  };

  const handleEdit = (rps: any) => {
    setSelectedRps(rps);
    setFormData({
      courseCode: rps.courseCode,
      courseName: rps.courseName,
      semester: rps.semester,
      status: rps.status,
      topics: [...rps.topics]
    });
    setTopicInput("");
    setTopicContent("");
    setTopicFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setShowEditModal(true);
  };

  const handleSave = () => {
    if (showAddModal) {
      const newRps = {
        id: `RPS${String(rpsData.length + 1).padStart(3, '0')}`,
        ...formData,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setRpsData(prev => [...prev, newRps]);
      setShowAddModal(false);
    } else if (showEditModal && selectedRps) {
      setRpsData(prev => prev.map(rps =>
        rps.id === selectedRps.id
          ? { ...rps, ...formData, lastUpdated: new Date().toISOString().split('T')[0] }
          : rps
      ));
      setShowEditModal(false);
    }
  };

  const addTopic = () => {
    if (topicInput.trim()) {
      setFormData(prev => ({
        ...prev,
        topics: [...prev.topics, {
          name: topicInput.trim(),
          content: topicContent.trim(),
          fileName: topicFile ? topicFile.name : null
        }]
      }));
      setTopicInput("");
      setTopicContent("");
      setTopicFile(null);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeTopic = (index: number) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index)
    }));
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
          <button onClick={handleAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-full text-sm hover:bg-orange-700 transition-colors">
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
                          {topic.name}
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
                    <button onClick={() => handleView(rps)} className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700">
                      <EyeIcon className="w-4 h-4" />
                      Lihat
                    </button>
                    <button onClick={() => handleEdit(rps)} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-600 text-white rounded-full text-sm hover:bg-gray-700">
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
                      <div className="font-medium text-blue-700">{topic.name}</div>
                      {topic.content && (
                        <div className="text-sm text-gray-600 mt-1">{topic.content}</div>
                      )}
                      {topic.fileName && (
                        <div className="text-sm text-blue-600 mt-1">📎 {topic.fileName}</div>
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

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setShowAddModal(false); setShowEditModal(false); }} />
          <div className="relative bg-white rounded-2xl w-full sm:max-w-2xl mx-4 p-6 shadow-lg max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{showAddModal ? 'Buat RPS Baru' : 'Edit RPS'}</h2>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kode Mata Kuliah</label>
                  <input
                    type="text"
                    value={formData.courseCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, courseCode: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: IF301"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Mata Kuliah</label>
                  <input
                    type="text"
                    value={formData.courseName}
                    onChange={(e) => setFormData(prev => ({ ...prev, courseName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: Pemrograman Web"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <input
                    type="text"
                    value={formData.semester}
                    onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: Ganjil 2025/2026"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="aktif">Aktif</option>
                    <option value="arsip">Arsip</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topik Pembelajaran</label>
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nama topik..."
                  />
                  <textarea
                    value={topicContent}
                    onChange={(e) => setTopicContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Deskripsi konten topik (opsional)..."
                    rows={3}
                  />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <input
                          ref={fileInputRef}
                          type="file"
                          onChange={(e) => setTopicFile(e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept=".pdf,.doc,.docx,.ppt,.pptx"
                        />
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white hover:border-blue-400 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 truncate">
                              {topicFile ? (topicFile.name.length > 25 ? topicFile.name.substring(0, 25) + '...' : topicFile.name) : "Pilih file..."}
                            </span>
                            <span className="text-blue-600 text-sm ml-2">📎</span>
                          </div>
                        </div>
                      </div>
                      {topicFile && (
                        <button
                          onClick={() => {
                            setTopicFile(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                          className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors shrink-0"
                          title="Hapus file terpilih"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <button
                      onClick={addTopic}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Tambah Topik
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {formData.topics.map((topic, idx) => (
                    <div key={idx} className="flex items-start justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-blue-700">{topic.name}</div>
                        {topic.content && (
                          <div className="text-sm text-gray-600 mt-1">{topic.content}</div>
                        )}
                        {topic.fileName && (
                          <div className="text-sm text-blue-600 mt-1">📎 {topic.fileName}</div>
                        )}
                      </div>
                      <button
                        onClick={() => removeTopic(idx)}
                        className="ml-2 text-red-500 hover:text-red-700 text-lg"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700">
                Batal
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700">
                {showAddModal ? 'Buat RPS' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DosenLayout>
  );
}
