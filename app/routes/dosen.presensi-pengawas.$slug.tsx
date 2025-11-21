import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import DosenLayout from "../layouts/DosenLayout";
import { CameraIcon, PaperClipIcon } from "@heroicons/react/24/outline";
import ArrowLeftIcon from "../components/ArrowLeftIcon";

export function meta() {
  return [{ title: "Presensi Pengawas - Siakad" }];
}

export default function DosenPresensiPengawas() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [toast, setToast] = useState<string | null>(null);
  const [session, setSession] = useState({
    topik: '',
    pertemuan: '',
    mulai: '',
    selesai: '',
    photoMasuk: ''
  });

  const [photoMasukPreview, setPhotoMasukPreview] = useState<string | null>(null);

  const course = (location as any).state?.course || "Mata Kuliah";
  const time = (location as any).state?.time || "";
  const room = (location as any).state?.room || "";
  const academicYear = (location as any).state?.academicYear || "";

  useEffect(() => {
    try {
      const role = localStorage.getItem("userRole");
      if (role !== "dosen") navigate("/", { replace: true });
    } catch {}
  }, [navigate]);

  useEffect(() => {
    // Load saved session or derive sensible defaults
    const saved = localStorage.getItem(`presensi-pengawas-${slug}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const [mulaiVal, selesaiVal] = String(time).split(/[–-]/).map((t) => (t || "").trim());
        let pertemuanVal = "1";
        if (data && data.session && data.session.pertemuan) {
          const n = Number(data.session.pertemuan);
          pertemuanVal = Number.isFinite(n) ? String(n + 1) : "1";
        }
        setSession((prev) => ({ ...(data.session || prev), mulai: mulaiVal || prev.mulai, selesai: selesaiVal || prev.selesai, pertemuan: pertemuanVal }));
      } catch (e) {
        // ignore parse errors
      }
    } else {
      const [mulai, selesai] = String(time).split(/[–-]/).map((t) => (t || "").trim());
      setSession((prev) => ({ ...prev, mulai: mulai || prev.mulai, selesai: selesai || prev.selesai, pertemuan: prev.pertemuan || "1" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, time]);

  const photoMasukRef = useRef<HTMLInputElement | null>(null);

  const handlePhotoMasukChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (!f) {
      setPhotoMasukPreview(null);
      setSession((prev: any) => ({ ...prev, photoMasuk: "" }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const data = typeof reader.result === "string" ? reader.result : null;
      setPhotoMasukPreview(data);
      setSession((prev: any) => ({ ...prev, photoMasuk: data || "" }));
    };
    reader.readAsDataURL(f);
  };

  const submitPresensiPengawas = () => {
    if (!session.photoMasuk) {
      setToast("Foto bukti masuk harus diisi");
      setTimeout(() => setToast(null), 3000);
      return;
    }
    try {
      const savedRaw = localStorage.getItem(`presensi-pengawas-${slug}`);
      const saved = savedRaw ? JSON.parse(savedRaw) : {};
      const payload = { ...saved, session, timestamp: new Date().toISOString() };
      localStorage.setItem(`presensi-pengawas-${slug}`, JSON.stringify(payload));
      setToast("Presensi pengawas berhasil dicatat");
      setTimeout(() => {
        setToast(null);
        navigate(-1);
      }, 2000);
    } catch (e) {
      setToast("Terjadi kesalahan saat menyimpan");
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <DosenLayout bgImage="/bg simple.png">
      <section className="px-4 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Presensi Pengawas</h1>
            <p className="text-sm text-gray-600">{course} • {room} • {academicYear}</p>
          </div>
        </div>

        <div className="bg-white/60 rounded-xl border border-gray-200 p-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Detail Sesi Ujian</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mata Kuliah</label>
              <input
                type="text"
                value={course}
                disabled
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ruang</label>
              <input
                type="text"
                value={room}
                disabled
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Waktu</label>
              <input
                type="text"
                value={time}
                disabled
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Ajaran</label>
              <input
                type="text"
                value={academicYear}
                disabled
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (Opsional)</label>
              <textarea
                value={session.topik}
                onChange={(e) => setSession(prev => ({ ...prev, topik: e.target.value }))}
                placeholder="Tambahkan catatan jika diperlukan..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bukti Presensi</label>
              <div className="flex flex-col items-start gap-2">
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => (photoMasukRef.current as HTMLInputElement | null)?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 text-white text-sm shadow-md hover:bg-blue-600 transition"
                  >
                    <PaperClipIcon className="w-4 h-4" />
                    Pilih File
                  </button>
                  <button
                    type="button"
                    disabled
                    onClick={() => (photoMasukRef.current as HTMLInputElement | null)?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-400 text-white text-sm shadow-md cursor-not-allowed"
                  >
                    <CameraIcon className="w-4 h-4" />
                    Ambil Foto
                  </button>
                </div>
                <input
                  ref={photoMasukRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoMasukChange(e as any)}
                  style={{ display: 'none' }}
                />
                {photoMasukPreview && (
                  <div className="mt-2">
                    <img src={photoMasukPreview} alt="Bukti Presensi" className="w-32 h-20 object-cover rounded-md border" />
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoMasukPreview(null);
                          setSession((prev: any) => ({ ...prev, photoMasuk: '' }));
                        }}
                        className="text-sm text-red-600 hover:underline mt-2"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/60 rounded-xl border border-gray-200 p-4 mb-4">
          <button
            onClick={submitPresensiPengawas}
            className="w-full py-3 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
          >
          Mulai Ujian
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