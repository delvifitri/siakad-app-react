import { useEffect, useRef, useState } from "react";
import SimpleLayout from "../layouts/SimpleLayout";
import { CameraIcon } from "@heroicons/react/24/outline";

export default function DosenEditProfile() {
  const [name, setName] = useState("Dr. Ahmad Fauzi");
  const [major, setMajor] = useState("Teknik Informatika");
  const [email, setEmail] = useState("");
  const [nidn, setNidn] = useState("199001012020031234");
  const [nuptk, setNuptk] = useState("00987654321");
  const [profilePhoto, setProfilePhoto] = useState<string>("/profile.jpg");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const prevObjectUrlRef = useRef<string | null>(null);

  // Signature related
  const signatureRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [signatureMode, setSignatureMode] = useState<'digital' | 'image'>('digital');
  const signatureImageInputRef = useRef<HTMLInputElement | null>(null);
  const [signatureImageDataUrl, setSignatureImageDataUrl] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('profileName');
      if (stored && stored.trim()) setName(stored);
      const sig = localStorage.getItem('profileSignature');
      if (sig) setSignatureDataUrl(sig);
      const sigImg = localStorage.getItem('profileSignatureImage');
      if (sigImg) setSignatureImageDataUrl(sigImg);
      const m = localStorage.getItem('profileMajor');
      if (m) setMajor(m);
      const e = localStorage.getItem('profileEmail');
      if (e) setEmail(e);
      const p = localStorage.getItem('profilePhoto');
      if (p) setProfilePhoto(p);
    } catch {}
  }, []);

  const toEmailFromName = (fullName: string, domain = "kampus.ac.id") => {
    try {
      const cleaned = fullName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\./g, " ")
        .replace(/[^a-zA-Z\s'-]/g, "")
        .trim()
        .toLowerCase();
      const titles = new Set(["dr", "prof", "ir", "h", "hj"]);
      const parts = cleaned
        .split(/\s+/)
        .filter(Boolean)
        .filter((p) => !titles.has(p));
      if (parts.length === 0) return `dosen@${domain}`;
      const first = parts[0].replace(/[^a-z]/g, "");
      const last = (parts.length > 1 ? parts[parts.length - 1] : "").replace(/[^a-z]/g, "");
      const user = last ? `${first}.${last}` : first;
      return `${user}@${domain}`;
    } catch {
      return "dosen@kampus.ac.id";
    }
  };

  useEffect(() => {
    setEmail((prev) => {
      if (!prev || prev.includes("@kampus") || prev.includes("@kampus.ac.id")) {
        return toEmailFromName(name);
      }
      return prev;
    });
  }, [name]);

  useEffect(() => {
    return () => {
      if (prevObjectUrlRef.current) URL.revokeObjectURL(prevObjectUrlRef.current);
    };
  }, []);

  // photo
  const handlePhotoClick = () => fileInputRef.current?.click();
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (prevObjectUrlRef.current) URL.revokeObjectURL(prevObjectUrlRef.current);
    prevObjectUrlRef.current = url;
    setProfilePhoto(url);
    try {
      localStorage.setItem('profilePhoto', url);
    } catch {}
  };

  // signature image handlers
  const handleSignatureImageClick = () => signatureImageInputRef.current?.click();
  const handleSignatureImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string | null;
      if (result) {
        setSignatureImageDataUrl(result);
        try { localStorage.setItem('profileSignatureImage', result); } catch {}
      }
    };
    reader.readAsDataURL(file);
  };

  // Setup canvas context SEKALI saja
  const setupCanvas = () => {
    const c = signatureRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    
    const ratio = window.devicePixelRatio || 1;
    const w = c.clientWidth;
    const h = c.clientHeight;
    
    c.width = Math.floor(w * ratio);
    c.height = Math.floor(h * ratio);
    ctx.scale(ratio, ratio);
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    
    // White background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    
    ctxRef.current = ctx;
  };

  const startDraw = (clientX: number, clientY: number) => {
    const c = signatureRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    lastPosRef.current = { x: clientX - rect.left, y: clientY - rect.top };
    drawingRef.current = true;
  };

  const drawMove = (clientX: number, clientY: number) => {
    if (!drawingRef.current) return;
    const ctx = ctxRef.current;
    const c = signatureRef.current;
    if (!ctx || !c) return;
    const rect = c.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastPosRef.current = { x, y };
  };

  const endDraw = () => {
    drawingRef.current = false;
  };

  const clearSignature = () => {
    // clear both digital and image signatures
    setupCanvas();
    setSignatureDataUrl(null);
    setSignatureImageDataUrl(null);
    try {
      localStorage.removeItem('profileSignature');
      localStorage.removeItem('profileSignatureImage');
    } catch {}
  };

  const saveSignature = () => {
    if (signatureMode === 'digital') {
      const c = signatureRef.current;
      if (!c) return;
      const dataUrl = c.toDataURL('image/png');
      setSignatureDataUrl(dataUrl);
      try { localStorage.setItem('profileSignature', dataUrl); } catch {}
    } else {
      // image mode: image is already saved on selection, but ensure stored
      if (signatureImageDataUrl) {
        try { localStorage.setItem('profileSignatureImage', signatureImageDataUrl); } catch {}
      }
    }
  };

  useEffect(() => {
    setupCanvas();
    const c = signatureRef.current;
    const ctx = ctxRef.current;
    if (!c || !ctx) return;
    
    if (signatureDataUrl) {
      const img = new Image();
      img.onload = () => {
        try {
          ctx.drawImage(img, 0, 0, c.clientWidth, c.clientHeight);
        } catch {}
      };
      img.src = signatureDataUrl;
    }
  }, [signatureDataUrl]);

  useEffect(() => {
    // if switched to digital, ensure canvas is ready
    if (signatureMode === 'digital') setupCanvas();
  }, [signatureMode]);

  const handleSave = () => {
    try {
      localStorage.setItem('profileName', name);
      localStorage.setItem('profileMajor', major);
      localStorage.setItem('profileEmail', email);
      localStorage.setItem('profileNidn', nidn);
      localStorage.setItem('profileNuptk', nuptk);
    } catch {}
  };

  return (
    <SimpleLayout title="Edit Profil Dosen">
      <div className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <button type="button" onClick={handlePhotoClick} className="w-24 h-24 rounded-full overflow-hidden p-0 border-0 bg-transparent cursor-pointer" aria-label="Ubah foto profil">
              <img src={profilePhoto} alt="profile" className="w-24 h-24 rounded-full object-cover" />
            </button>
            <button type="button" onClick={handlePhotoClick} className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full" aria-label="Ubah foto">
              <CameraIcon className="w-4 h-4" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </div>
          <p className="text-sm text-gray-600 mt-2">Ketuk untuk mengubah foto</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled aria-disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program Studi</label>
            <input type="text" value={major} onChange={(e) => setMajor(e.target.value)} disabled aria-disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-orange-500 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIDN</label>
            <input type="text" value={nidn} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NUPTK</label>
            <input type="text" value={nuptk} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">Tanda Tangan (TTD)</label>
            <div className="bg-white border rounded-lg p-3">
              <div className="mb-2">
                <div className="flex gap-2 mb-2">
                  <button type="button" onClick={() => setSignatureMode('digital')} className={`px-3 py-1 rounded-full text-sm ${signatureMode === 'digital' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>Digital</button>
                  <button type="button" onClick={() => setSignatureMode('image')} className={`px-3 py-1 rounded-full text-sm ${signatureMode === 'image' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>Foto/Gambar</button>
                </div>

                {signatureMode === 'digital' ? (
                  <div className="w-full h-36 border border-dashed rounded-md overflow-hidden">
                    <canvas
                      ref={signatureRef}
                      className="w-full h-full touch-none"
                      style={{ touchAction: 'none' }}
                      onMouseDown={(e) => startDraw(e.clientX, e.clientY)}
                      onMouseMove={(e) => drawMove(e.clientX, e.clientY)}
                      onMouseUp={endDraw}
                      onMouseLeave={endDraw}
                      onTouchStart={(e) => { e.preventDefault(); const t = e.touches[0]; if (t) startDraw(t.clientX, t.clientY); }}
                      onTouchMove={(e) => { e.preventDefault(); const t = e.touches[0]; if (t) drawMove(t.clientX, t.clientY); }}
                      onTouchEnd={(e) => { e.preventDefault(); endDraw(); }}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-4">Pilih gambar tanda tangan dari galeri</p>
                      
                      {signatureImageDataUrl ? (
                        <div className="flex items-center justify-center gap-4">
                          <img src={signatureImageDataUrl} alt="ttd-img-preview" className="h-16 w-16 object-contain border rounded" />
                          <button type="button" onClick={handleSignatureImageClick} className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm">Pilih Gambar</button>
                          <input ref={signatureImageInputRef} type="file" accept="image/*" className="hidden" onChange={handleSignatureImageChange} />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <button type="button" onClick={handleSignatureImageClick} className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm">Pilih Gambar</button>
                          <input ref={signatureImageInputRef} type="file" accept="image/*" className="hidden" onChange={handleSignatureImageChange} />
                        </div>
                      )}
                      
                      {signatureImageDataUrl && (
                        <div className="flex items-center justify-center gap-2 mt-4">
                          <button onClick={() => { try { localStorage.setItem('profileSignatureImage', signatureImageDataUrl); } catch {} }} type="button" className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">Simpan</button>
                          <button onClick={() => { setSignatureImageDataUrl(null); try { localStorage.removeItem('profileSignatureImage'); } catch {} }} type="button" className="px-3 py-1 bg-red-600 text-white rounded-full text-sm">Hapus</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {signatureMode === 'digital' && (
                <div className="flex items-center gap-2">
                  <button onClick={saveSignature} type="button" className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">Simpan TTD</button>
                  <button onClick={clearSignature} type="button" className="px-3 py-1 bg-gray-200 rounded-full text-sm">Bersihkan</button>
                  {signatureDataUrl && (<img src={signatureDataUrl} alt="ttd-preview" className="h-16 ml-3 object-contain border rounded" />)}
                </div>
              )}
              {/* {signatureMode === 'image' && signatureImageDataUrl && (
                <div className="flex items-center justify-center mt-2">
                  <img src={signatureImageDataUrl} alt="ttd-preview-img" className="h-16 object-contain border rounded" />
                </div>
              )} */}
            </div>
          </div>
        </div>

        <div className="grid">
          <button onClick={handleSave} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white bg-orange-500 hover:bg-orange-600 text-sm">Simpan</button>
        </div>
      </div>
    </SimpleLayout>
  );
}