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
    if (pertemuan.trim()) {
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
    }
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

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="aktif">Aktif</option>
          </select>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={addTopic}
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Tambah Materi
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {formData.topics.length === 0 ? (
            <div className="text-sm text-gray-500">Belum ada materi yang ditambahkan.</div>
          ) : (
            formData.topics.map((topic, idx) => (
              <div key={idx} className="p-3 bg-white/80 rounded-lg ring-1 ring-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Pertemuan ke {topic.pertemuan}</div>
                    <div className="font-medium text-gray-900">{topic.materiIndonesia}</div>
                    {topic.materiInggris && <div className="text-sm text-gray-600 mt-1">{topic.materiInggris}</div>}
                  </div>
                  <div className="ml-3 flex items-start gap-2">
                    <button onClick={() => removeTopic(idx)} className="text-red-500 hover:text-red-700">Hapus</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* status moved to the top card */}

        <div className="flex justify-end gap-2">
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700">Batal</button>
          <button onClick={handleSave} className="px-4 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700">Simpan Perubahan</button>
        </div>
      </div>
    </DosenLayout>
  );
}
