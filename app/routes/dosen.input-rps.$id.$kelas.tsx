import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import DosenLayout from "../layouts/DosenLayout";

export function meta() {
  return [{ title: "Input RPS - Dosen" }];
}

export default function DosenInputRpsPage() {
  const { id, kelas } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [formData, setFormData] = useState({
    id: id || "",
    courseCode: "",
    courseName: "",
    semester: "",
    status: "draft",
    topics: [] as Array<{ pertemuan: string; materiIndonesia: string; materiInggris: string }>,
    classes: [] as string[]
  });

  const [pertemuan, setPertemuan] = useState("");
  const [materiIndonesia, setMateriIndonesia] = useState("");
  const [materiInggris, setMateriInggris] = useState("");

  // modal edit state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editPertemuan, setEditPertemuan] = useState("");
  const [editMateriIndonesia, setEditMateriIndonesia] = useState("");
  const [editMateriInggris, setEditMateriInggris] = useState("");
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");

  // compute visible indices according to search query so rendering and
  // selection operate on the same original-topic indexes
  const visibleIndices = formData.topics.map((t, i) => i).filter(i => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const topic = formData.topics[i];
    return (
      String(topic.pertemuan || '').toLowerCase().includes(q) ||
      String(topic.materiIndonesia || '').toLowerCase().includes(q) ||
      String(topic.materiInggris || '').toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem('rpsData');
      if (!raw) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const arr = JSON.parse(raw) as any[];
      const found = arr.find(r => r.id === id);
      if (!found) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setFormData({
        id: found.id,
        courseCode: found.courseCode || "",
        courseName: found.courseName || "",
        semester: found.semester || "",
        status: found.status || "draft",
        topics: Array.isArray(found.topics) ? [...found.topics] : [],
        classes: found.classes ? [...found.classes] : []
      });
    } catch (e) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const addTopic = () => {
    if (!pertemuan.trim()) return;
    setFormData(prev => ({
      ...prev,
      topics: [...prev.topics, {
        pertemuan: pertemuan.trim(),
        materiIndonesia: materiIndonesia.trim(),
        materiInggris: materiInggris.trim()
      }]
    }));
    setPertemuan("");
    setMateriIndonesia("");
    setMateriInggris("");
  };

  const startEditTopic = (idx: number) => {
    const t = formData.topics[idx];
    if (!t) return;
    setEditPertemuan(t.pertemuan || "");
    setEditMateriIndonesia(t.materiIndonesia || "");
    setEditMateriInggris(t.materiInggris || "");
    setEditIndex(idx);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditIndex(null);
    setEditPertemuan("");
    setEditMateriIndonesia("");
    setEditMateriInggris("");
  };

  const saveEditedTopic = () => {
    if (editIndex === null) return;
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.map((t, i) => i === editIndex ? {
        pertemuan: editPertemuan.trim(),
        materiIndonesia: editMateriIndonesia.trim(),
        materiInggris: editMateriInggris.trim()
      } : t)
    }));
    closeEditModal();
  };

  const removeTopic = (idx: number) => {
    setFormData(prev => ({ ...prev, topics: prev.topics.filter((_, i) => i !== idx) }));
  };

  const handleSave = () => {
    try {
      const raw = localStorage.getItem('rpsData');
      const arr = raw ? JSON.parse(raw) : [];
      let found = false;
      const updated = arr.map((r: any) => {
        if (r.id === formData.id) {
          found = true;
          return { ...r, ...formData, lastUpdated: new Date().toISOString().split('T')[0] };
        }
        return r;
      });
      if (!found) {
        // append if not found
        updated.push({ ...formData, lastUpdated: new Date().toISOString().split('T')[0] });
      }
      localStorage.setItem('rpsData', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
    // navigate back to the kelola list so it reloads rpsData from localStorage
    navigate('/dosen/kelola-rps');
  };

  // Auto-persist formData to localStorage whenever it changes so there's
  // no need for an explicit "Simpan Perubahan" button.
  useEffect(() => {
    try {
      const raw = localStorage.getItem('rpsData');
      const arr = raw ? JSON.parse(raw) : [];
      let found = false;
      const updated = arr.map((r: any) => {
        if (r.id === formData.id) {
          found = true;
          return { ...r, ...formData, lastUpdated: new Date().toISOString().split('T')[0] };
        }
        return r;
      });
      if (!found) {
        updated.push({ ...formData, lastUpdated: new Date().toISOString().split('T')[0] });
      }
      localStorage.setItem('rpsData', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  }, [formData]);

  if (loading) return (
    <DosenLayout title="Input RPS" bgImage="/bg simple.png">
      <div className="p-4">Memuat...</div>
    </DosenLayout>
  );

  if (notFound) return (
    <DosenLayout title="Input RPS" bgImage="/bg simple.png">
      <div className="p-4">
        <div className="text-sm text-gray-600">RPS tidak ditemukan. Kembali ke daftar untuk memuat ulang.</div>
        <div className="mt-4">
          <button onClick={() => navigate('/dosen/kelola-rps')} className="px-4 py-2 bg-gray-600 text-white rounded-full">Kembali</button>
        </div>
      </div>
    </DosenLayout>
  );

  return (
  <DosenLayout title={`Input RPS — Kelas ${kelas || '-'}`} bgImage="/bg simple.png">
      <div className="p-4 max-w-3xl mx-auto">
        <div className="mb-4 flex items-center gap-3">
          <button onClick={() => navigate('/dosen/kelola-rps')} className="p-2 rounded-full hover:bg-gray-100 text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-bold text-gray-900">Tambah RPS</h2>
        </div>

        <div className="mb-4 p-3 bg-yellow-50 rounded-md ring-1 ring-yellow-100">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="text-sm text-gray-700">Nama Dosen : {typeof window !== 'undefined' ? (localStorage.getItem('userName') || 'Goweb Dosen') : 'Goweb Dosen'}</div>
              <div className="text-sm text-gray-700">Nama Makul : {formData.courseName || '-'} {formData.courseCode ? `(${formData.courseCode})` : ''} {kelas ? `• Kelas ${kelas}` : ''}</div>
            </div>
          </div>
        </div>

  <label className="block text-sm font-bold text-gray-900 mb-2">Input RPS Disini :</label>
        <div className="mb-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            value={pertemuan}
            onChange={(e) => setPertemuan(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Pertemuan ke"
          />
          <input
            type="text"
            value={materiIndonesia}
            onChange={(e) => setMateriIndonesia(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Materi (Indonesia)"
          />
          <input
            type="text"
            value={materiInggris}
            onChange={(e) => setMateriInggris(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Materi (English)"
          />
        </div>

        {/* Status selector removed per request */}

        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={addTopic}
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Tambah Materi
          </button>
        </div>

        {/* Title for the list of already-input RPS topics */}
        <div className="mb-3">
          <h3 className="text-sm font-bold text-gray-700">List data RPS yang sudah diinputkan</h3>
        </div>

        {/* search + pilih semua: search first, then Pilih Semua below it */}
        <div className="mb-3">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1 0 6.65 6.65a7.5 7.5 0 0 0 10 10z" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari materi atau pertemuan..."
              aria-label="Cari materi atau pertemuan"
              className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mt-2">
            <button
              onClick={() => {
                if (visibleIndices.length === 0) return;
                const allVisibleSelected = visibleIndices.every(i => selectedIndexes.has(i));
                if (allVisibleSelected) {
                  // clear visible selections
                  setSelectedIndexes(prev => {
                    const copy = new Set(prev);
                    visibleIndices.forEach(i => copy.delete(i));
                    return copy;
                  });
                } else {
                  // select visible only
                  setSelectedIndexes(new Set(visibleIndices));
                }
              }}
              disabled={visibleIndices.length === 0}
              className={`px-3 py-2 rounded-full text-sm ${visibleIndices.length === 0 ? 'bg-gray-200 text-gray-500' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {visibleIndices.length > 0 && visibleIndices.every(i => selectedIndexes.has(i)) ? 'Batal Pilih Semua' : 'Pilih Semua'}
            </button>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {formData.topics.length === 0 ? (
            <div className="text-sm text-gray-500">Belum ada materi yang ditambahkan.</div>
          ) : visibleIndices.length === 0 ? (
            <div className="text-sm text-gray-500">Tidak ada materi yang cocok dengan pencarian.</div>
          ) : (
            visibleIndices.map((idx) => {
              const topic = formData.topics[idx];
              return (
                <div key={idx} className="p-3 bg-white/80 rounded-lg ring-1 ring-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedIndexes.has(idx)}
                        onChange={() => {
                          setSelectedIndexes(prev => {
                            const copy = new Set(prev);
                            if (copy.has(idx)) copy.delete(idx);
                            else copy.add(idx);
                            return copy;
                          });
                        }}
                        className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <div className="text-xs text-gray-500">Pertemuan ke {topic.pertemuan}</div>
                        <div className="font-medium text-gray-900">{topic.materiIndonesia}</div>
                        {topic.materiInggris && <div className="text-sm text-gray-600 mt-1">{topic.materiInggris}</div>}
                      </div>
                    </div>
                    <div className="ml-3 flex items-start gap-2">
                      <button onClick={() => startEditTopic(idx)} className="text-blue-600 hover:text-blue-800">Edit</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* bulk delete action + Edit modal */}

        <div className="flex items-center justify-end mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                // delete selected
                if (selectedIndexes.size === 0) return;
                setFormData(prev => ({ ...prev, topics: prev.topics.filter((_, i) => !selectedIndexes.has(i)) }));
                setSelectedIndexes(new Set());
              }}
              disabled={selectedIndexes.size === 0}
              className={`px-3 py-2 rounded-full text-sm ${selectedIndexes.size === 0 ? 'bg-gray-200 text-gray-500' : 'bg-red-600 text-white hover:bg-red-700'}`}
            >
              Hapus Terpilih
            </button>
          </div>
        </div>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="relative w-full max-w-xl mx-4">
                <div className="bg-white rounded-lg shadow-lg ring-1 ring-gray-200 overflow-hidden">
                  <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 8a5 5 0 1110 0v1h1a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6a1 1 0 011-1h1V8z" />
                    </svg>
                    <span className="font-semibold">Edit RPS Disini</span>
                  </div>
                    <button onClick={closeEditModal} aria-label="Tutup" className="bg-transparent text-white rounded-full w-8 h-8 flex items-center justify-center">✕</button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Pertemuan Ke</label>
                      <input
                        type="text"
                        value={editPertemuan}
                        onChange={(e) => setEditPertemuan(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Pertemuan ke"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Materi Indonesia</label>
                      <input
                        type="text"
                        value={editMateriIndonesia}
                        onChange={(e) => setEditMateriIndonesia(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Materi (Indonesia)"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Materi Inggris</label>
                      <input
                        type="text"
                        value={editMateriInggris}
                        onChange={(e) => setEditMateriInggris(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Materi (English)"
                      />
                    </div>
                  </div>
                    <div className="mt-6 flex justify-end gap-3">
                      <button onClick={saveEditedTopic} className="px-4 py-2 bg-blue-600 text-white rounded-full">Edit RPS</button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* status moved to the top card */}
      </div>
    </DosenLayout>
  );
}
