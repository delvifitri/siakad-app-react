import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import DosenLayout from "../layouts/DosenLayout";

export function meta() {
  return [{ title: "Input RPS - Dosen" }];
}
export default function DosenInputRpsPage() {
  const { id, kelas } = useParams();
  const navigate = useNavigate();

  // Don't show a global "Memuat..." screen when navigating into this page —
  // render the form immediately and populate from localStorage when ready.
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  
  // Infinite scroll controls
  const INITIAL_COUNT = 3;
  const LOAD_MORE_COUNT = 3;
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_COUNT);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

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
  const [detailIndex, setDetailIndex] = useState<number | null>(null);
  const [detailDemoIndex, setDetailDemoIndex] = useState<number | null>(null);

  const demoTopics = [
    {
      pertemuan: '1',
      materiIndonesia: `Diskusi metodologi dan rencana eksperimen: Mahasiswa diminta untuk menyusun ulang bagian metodologi agar mencakup desain eksperimen, variabel yang diukur, dan langkah-langkah pengolahan data. Selain itu, tambahkan referensi utama untuk metode statistik yang digunakan serta penjelasan lebih rinci mengenai sampling dan validasi. Pastikan penjelasan cukup detail untuk memungkinkan replikasi oleh pembaca lain. Tambahkan juga tabel ringkasan variabel, contoh skrip preprocessing, dan catatan mengenai batasan eksperimen sehingga pembimbing dan penguji mendapatkan konteks yang lengkap.`,
      materiInggris: `Discussion on methodology and experimental plan: The student is requested to revise the methodology section to include experimental design, measured variables, and data processing steps. Also add major references for the statistical methods and a more detailed description of sampling and validation. Ensure the explanation is detailed enough for reproducibility.`
    },
    {
      pertemuan: '2',
      materiIndonesia: `Konsultasi terkait pemilihan dataset dan preprocessing: Pilih dataset yang representatif, jelaskan alasan pemilihan fitur, dan berikan langkah-langkah preprocessing termasuk cleaning, normalisasi, serta teknik augmentasi jika diperlukan. Sertakan juga rencana evaluasi dan metrik yang akan digunakan. Jelaskan juga cara membagi data (train/val/test), rasio yang digunakan, serta pertimbangan handling missing values dan outlier.`,
      materiInggris: `Consultation on dataset selection and preprocessing: Choose a representative dataset, explain feature selection rationale, and provide preprocessing steps including cleaning, normalization, and augmentation techniques if needed. Also include evaluation plans and metrics.`
    },
    {
      pertemuan: '3',
      materiIndonesia: `Pembahasan hasil awal dan evaluasi: Mahasiswa menunjukkan hasil eksperimen awal dengan metrik akurasi, presisi, recall, dan F1. Diskusikan langkah perbaikan seperti tuning hyperparameter, melakukan cross-validation yang lebih ketat, dan memperbaiki pipeline evaluasi agar metrik tidak over-optimistic. Sertakan contoh tabel hasil eksperimen dan langkah lanjutan.`,
      materiInggris: `Discussion on initial results and evaluation: The student presented initial experimental results with accuracy, precision, recall, and F1 metrics. Discuss improvements like hyperparameter tuning, stricter cross-validation, and refining the evaluation pipeline to avoid optimistic metrics. Include sample result tables and next steps.`
    },
    {
      pertemuan: '4',
      materiIndonesia: `Review implementasi dan dokumentasi kode: Evaluasi struktur proyek, penggunaan design patterns, dan kualitas dokumentasi. Pastikan kode mengikuti best practices, termasuk error handling, logging, dan unit testing. Bahas juga performa dan optimisasi yang sudah diterapkan atau yang masih bisa ditingkatkan.`,
      materiInggris: `Code implementation and documentation review: Evaluate project structure, design patterns usage, and documentation quality. Ensure code follows best practices, including error handling, logging, and unit testing. Discuss performance and optimization measures implemented or potential improvements.`
    },
    {
      pertemuan: '5',
      materiIndonesia: `Persiapan dan simulasi presentasi: Latihan presentasi dengan fokus pada penyampaian latar belakang, metodologi, dan hasil penelitian. Siapkan slide yang efektif dengan visualisasi data yang informatif. Antisipasi pertanyaan-pertanyaan kritis dari penguji terkait validitas hasil dan batasan penelitian.`,
      materiInggris: `Presentation preparation and simulation: Practice presentation focusing on background, methodology, and research results delivery. Prepare effective slides with informative data visualization. Anticipate critical questions from examiners regarding result validity and research limitations.`
    },
    {
      pertemuan: '6',
      materiIndonesia: `Finalisasi laporan dan dokumentasi: Review menyeluruh terhadap format penulisan, konsistensi referensi, dan kelengkapan lampiran. Pastikan semua feedback dari pembimbing sudah diintegrasikan. Persiapkan juga paket deployment dan panduan penggunaan sistem untuk keperluan demo.`,
      materiInggris: `Report and documentation finalization: Comprehensive review of writing format, reference consistency, and appendix completeness. Ensure all feedback from supervisors has been integrated. Also prepare deployment package and system usage guide for demo purposes.`
    }
  ];
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

  // Reset visible count when search changes
  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [search]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          setIsLoadingMore(true);
          // Simulate network delay
          setTimeout(() => {
            setVisibleCount(count => count + LOAD_MORE_COUNT);
            setIsLoadingMore(false);
          }, 500);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [sentinelRef.current]);

  const listContent = (() => {
    if (formData.topics.length === 0) {
      // Apply pagination to demo topics
      const visibleDemoTopics = demoTopics.slice(0, visibleCount);
      return visibleDemoTopics.map((topic, dIdx) => (
        <div key={`demo-${dIdx}`} className="p-3 bg-white/80 rounded-lg ring-1 ring-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="text-xs text-gray-500">Pertemuan ke {topic.pertemuan}</div>
                <div
                  className="font-medium text-gray-900 mt-1 text-sm"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {topic.materiIndonesia}
                </div>
              </div>
            </div>
            <div className="ml-3 flex items-start gap-2">
              <button onClick={() => setDetailDemoIndex(dIdx)} className="text-orange-500 hover:underline">Detail</button>
            </div>
          </div>
          {detailDemoIndex === dIdx && (
            <div className="mt-3 p-3 bg-white rounded-md border border-gray-200">
              <div className="text-xs text-gray-500">Isi RPS:</div>
              <div className="text-xs text-gray-500 mt-2">Materi (Indonesia)</div>
              <div className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{topic.materiIndonesia}</div>
              {topic.materiInggris && (
                <div className="mt-4 text-sm text-gray-600">
                  <div className="text-xs text-gray-500">Materi (English)</div>
                  <div className="mt-1 whitespace-pre-wrap">{topic.materiInggris}</div>
                </div>
              )}
              <div className="mt-3 flex justify-end">
                <button onClick={() => setDetailDemoIndex(null)} className="text-sm text-gray-700">Sembunyikan</button>
              </div>
            </div>
          )}
          <div className="mt-3">
            <button disabled className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm opacity-70">Edit</button>
          </div>
        </div>
      ));
    }
    if (visibleIndices.length === 0) {
      return <div className="text-sm text-gray-500">Tidak ada materi yang cocok dengan pencarian.</div>;
    }
    return visibleIndices.slice(0, visibleCount).map((idx) => {
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
                <div
                  className="font-medium text-gray-900 mt-1 text-sm"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {topic.materiIndonesia || '-'}
                </div>
              </div>
            </div>
            <div className="ml-3 flex items-start gap-2">
              <button onClick={() => setDetailIndex(idx)} className="text-orange-500 hover:underline">Detail</button>
            </div>
          </div>
          {detailIndex === idx && (
            <div className="mt-3 p-3 bg-white rounded-md border border-gray-200">
              <div className="text-xs text-gray-500">Isi RPS:</div>
              <div className="text-xs text-gray-500 mt-2">Materi (Indonesia)</div>
              <div className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{topic.materiIndonesia || '-'}</div>
              {topic.materiInggris && (
                <div className="mt-4 text-sm text-gray-600">
                  <div className="text-xs text-gray-500">Materi (English)</div>
                  <div className="mt-1 whitespace-pre-wrap">{topic.materiInggris}</div>
                </div>
              )}
              <div className="mt-3 flex justify-end">
                <button onClick={() => setDetailIndex(null)} className="text-sm text-gray-700">Sembunyikan</button>
              </div>
            </div>
          )}
          <div className="mt-3">
            <button onClick={() => startEditTopic(idx)} className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">Edit</button>
          </div>
        </div>
      );
    });
  })();

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
          {listContent}
          {((formData.topics.length === 0 && visibleCount < demoTopics.length) || 
            (formData.topics.length > 0 && visibleCount < visibleIndices.length)) && (
            <div ref={sentinelRef} className="py-4 flex justify-center">
              {isLoadingMore ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Memuat data...</span>
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Scroll untuk melihat lebih banyak
                </div>
              )}
            </div>
          )}
        </div>        {/* bulk delete action + Edit modal */}

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
        {/* detail now rendered inline per-card; full-screen modal removed */}
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
