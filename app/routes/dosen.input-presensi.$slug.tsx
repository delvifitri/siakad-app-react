import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import DosenLayout from "../layouts/DosenLayout";
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, ClockIcon } from "@heroicons/react/24/outline";

export function meta() {
  return [{ title: "Input Presensi - Siakad" }];
}

const statuses = [
  { key: "hadir", label: "Hadir", color: "bg-green-500", icon: CheckCircleIcon },
  { key: "izin", label: "Izin", color: "bg-yellow-500", icon: ExclamationTriangleIcon },
  { key: "sakit", label: "Sakit", color: "bg-red-500", icon: XCircleIcon },
  { key: "alfa", label: "Alfa", color: "bg-gray-500", icon: ClockIcon },
];

const dummyStudents = [
  { nim: "12345678", name: "Ahmad Fauzi" },
  { nim: "12345679", name: "Budi Santoso" },
  { nim: "12345680", name: "Citra Dewi" },
  { nim: "12345681", name: "Dedi Rahman" },
  { nim: "12345682", name: "Eka Putri" },
];

export default function DosenInputPresensi() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [toast, setToast] = useState<string | null>(null);
  const [session, setSession] = useState({
    topik: '',
    pertemuan: '',
    dosen: '',
    mulai: '',
    selesai: '',
    batas: '15'
  });

  const course = location.state?.course || "Mata Kuliah";
  const cls = location.state?.cls || "Kelas";
  const code = location.state?.code || "Kode";
  const time = location.state?.time || "";
  const room = location.state?.room || "";
  const mahasiswa = location.state?.mahasiswa || 0;

  useEffect(() => {
    try {
      const role = localStorage.getItem("userRole");
      if (role !== "dosen") navigate("/", { replace: true });
    } catch {}
  }, [navigate]);

  useEffect(() => {
    const saved = localStorage.getItem(`presensi-${slug}`);
    if (saved) {
      const data = JSON.parse(saved);
      setSession(data.session || session);
    } else {
      // Set defaults
      const profileName = localStorage.getItem("profileName") || "Dosen";
      const [mulai, selesai] = time.split(/[–-]/).map((t: string) => t.trim() || "");
      setSession(prev => ({ ...prev, dosen: profileName, mulai, selesai }));
    }
  }, [slug, time]);

  // When the instructor completes the session form, proceed to the presensi detail page.
  const proceedToDetail = () => {
    try {
      const savedRaw = localStorage.getItem(`presensi-${slug}`);
      const saved = savedRaw ? JSON.parse(savedRaw) : {};
      // merge session into saved object and persist
      const payload = { ...saved, session };
      localStorage.setItem(`presensi-${slug}`, JSON.stringify(payload));
    } catch (e) {
      // ignore
    }
    navigate(`/dosen/presensi/${slug}`);
  };

  return (
    <DosenLayout bgImage="/bg simple.png">
      <section className="px-4 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/60 hover:bg-white/80">
            ←
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Input Presensi</h1>
            <p className="text-sm text-gray-600">{course} ({cls}) - {code}</p>
          </div>
        </div>

        <div className="bg-white/60 rounded-xl border border-gray-200 p-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Detail Sesi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topik Pembelajaran</label>
              <input
                type="text"
                onChange={(e) => setSession(prev => ({ ...prev, topik: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pertemuan Ke-</label>
              <input
                type="number"
                onChange={(e) => setSession(prev => ({ ...prev, pertemuan: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Dosen</label>
              <input
                type="text"
                onChange={(e) => setSession(prev => ({ ...prev, dosen: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batas Keterlambatan (menit)</label>
              <input
                type="number"
                onChange={(e) => setSession(prev => ({ ...prev, batas: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mulai Mengajar</label>
              <input
                type="time"
                onChange={(e) => setSession(prev => ({ ...prev, mulai: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selesai Mengajar</label>
              <input
                type="time"
                onChange={(e) => setSession(prev => ({ ...prev, selesai: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/60 rounded-xl border border-gray-200 p-4 mb-4">
          <button onClick={proceedToDetail} className="w-full py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700">
            Lanjutkan ke Detail Presensi
          </button>
        </div>

        {toast && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg">
            {toast}
          </div>
        )}
      </section>
    </DosenLayout>
  );
}