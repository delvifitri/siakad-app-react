import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import DosenLayout from "../layouts/DosenLayout";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export function meta() {
  return [{ title: "Input Presensi - Siakad" }];
}

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
    batas: '',
    photoMasuk: '',
    photoKeluar: ''
  });

  const [photoMasukPreview, setPhotoMasukPreview] = useState<string | null>(null);
  const [photoKeluarPreview, setPhotoKeluarPreview] = useState<string | null>(null);

  const course = (location as any).state?.course || "Mata Kuliah";
  const cls = (location as any).state?.cls || "Kelas";
  const code = (location as any).state?.code || "Kode";
  const time = (location as any).state?.time || "";

  useEffect(() => {
    try {
      const role = localStorage.getItem("userRole");
      if (role !== "dosen") navigate("/", { replace: true });
    } catch {}
  }, [navigate]);

  useEffect(() => {
    // load saved session or derive sensible defaults
    const saved = localStorage.getItem(`presensi-${slug}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const profileName = localStorage.getItem("profileName") || "Dosen";
        const [mulaiVal, selesaiVal] = String(time).split(/[–-]/).map((t) => (t || "").trim());
        let pertemuanVal = "1";
        if (data && data.session && data.session.pertemuan) {
          const n = Number(data.session.pertemuan);
          pertemuanVal = Number.isFinite(n) ? String(n + 1) : "1";
        } else if (data && Array.isArray(data.history)) {
          pertemuanVal = String(data.history.length + 1);
        }
        setSession((prev) => ({ ...(data.session || prev), dosen: profileName, mulai: mulaiVal || prev.mulai, selesai: selesaiVal || prev.selesai, pertemuan: pertemuanVal, batas: (data.session && data.session.batas) || prev.batas }));
      } catch (e) {
        // ignore parse errors
      }
    } else {
      const profileName = localStorage.getItem("profileName") || "Dosen";
      const [mulai, selesai] = String(time).split(/[–-]/).map((t) => (t || "").trim());
      setSession((prev) => ({ ...prev, dosen: profileName, mulai: mulai || prev.mulai, selesai: selesai || prev.selesai, pertemuan: prev.pertemuan || "1" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, time]);

  const photoMasukRef = useRef<HTMLInputElement | null>(null);
  const photoKeluarRef = useRef<HTMLInputElement | null>(null);

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

  const handlePhotoKeluarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (!f) {
      setPhotoKeluarPreview(null);
      setSession((prev: any) => ({ ...prev, photoKeluar: "" }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const data = typeof reader.result === "string" ? reader.result : null;
      setPhotoKeluarPreview(data);
      setSession((prev: any) => ({ ...prev, photoKeluar: data || "" }));
    };
    reader.readAsDataURL(f);
  };

  const proceedToDetail = () => {
    if (!session.photoMasuk || !session.photoKeluar) {
      setToast("Foto bukti masuk dan keluar harus diisi sebelum memulai sesi");
      setTimeout(() => setToast(null), 3000);
      return;
    }
    try {
      const savedRaw = localStorage.getItem(`presensi-${slug}`);
      const saved = savedRaw ? JSON.parse(savedRaw) : {};
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
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
            <ArrowLeftIcon className="w-5 h-5" />
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
                value={session.topik}
                onChange={(e) => setSession(prev => ({ ...prev, topik: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pertemuan Ke-</label>
              <input
                type="number"
                value={session.pertemuan}
                disabled
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batas Presensi (menit)</label>
              <input
                type="number"
                value={session.batas}
                onChange={(e) => setSession(prev => ({ ...prev, batas: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mulai</label>
              <input value={session.mulai} disabled className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selesai</label>
              <input value={session.selesai} disabled className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100" />
            </div>

            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Foto Bukti Masuk</label>
                  <div className="flex flex-col items-start gap-2">
                    <button
                      type="button"
                      onClick={() => (photoMasukRef.current as HTMLInputElement | null)?.click()}
                      className="px-4 py-2 rounded-full bg-orange-500 text-white text-sm shadow-md hover:bg-orange-600 transition"
                    >
                      Ambil Foto Masuk
                    </button>
                    <input ref={photoMasukRef} id="photo-masuk-input" type="file" accept="image/*" capture="environment" onChange={(e) => handlePhotoMasukChange(e as any)} style={{ display: 'none' }} />
                    {photoMasukPreview && (
                      <div className="mt-2">
                        <img src={photoMasukPreview} alt="Masuk" className="w-32 h-20 object-cover rounded-md border" />
                        <div>
                          <button type="button" onClick={() => { setPhotoMasukPreview(null); setSession((prev: any) => ({ ...prev, photoMasuk: '' })); }} className="text-sm text-red-600 hover:underline mt-2">Hapus</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Foto Bukti Keluar</label>
                  <div className="flex flex-col items-start gap-2">
                    <button
                      type="button"
                      onClick={() => (photoKeluarRef.current as HTMLInputElement | null)?.click()}
                      className="px-4 py-2 rounded-full bg-orange-500 text-white text-sm shadow-md hover:bg-orange-600 transition"
                    >
                      Ambil Foto Keluar
                    </button>
                    <input ref={photoKeluarRef} id="photo-keluar-input" type="file" accept="image/*" capture="environment" onChange={(e) => handlePhotoKeluarChange(e as any)} style={{ display: 'none' }} />
                    {photoKeluarPreview && (
                      <div className="mt-2">
                        <img src={photoKeluarPreview} alt="Keluar" className="w-32 h-20 object-cover rounded-md border" />
                        <div>
                          <button type="button" onClick={() => { setPhotoKeluarPreview(null); setSession((prev: any) => ({ ...prev, photoKeluar: '' })); }} className="text-sm text-red-600 hover:underline mt-2">Hapus</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/60 rounded-xl border border-gray-200 p-4 mb-4">
          <button onClick={proceedToDetail} className="w-full py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700">Mulai Sesi</button>
        </div>

        {toast && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg">{toast}</div>
        )}
      </section>
    </DosenLayout>
  );
}