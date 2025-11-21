import { useState, useRef, useEffect } from "react";
import SimpleLayout from "../layouts/SimpleLayout";
import { CameraIcon } from "@heroicons/react/24/outline";

export default function EditProfile() {
  const [name, setName] = useState("Budi Santoso");
  const [nim, setNim] = useState("123456789");
  const [major, setMajor] = useState("Informatika");
  const [semester, setSemester] = useState("6");
  const [email, setEmail] = useState("budi.santoso@example.com");
  const [phone, setPhone] = useState("081234567890");
  const [address, setAddress] = useState("Jl. Contoh No. 123, Jakarta");
  const [isSaved, setIsSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string>("/profile.jpg");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const prevObjectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (prevObjectUrlRef.current) URL.revokeObjectURL(prevObjectUrlRef.current);
    };
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem('profileName', name);
      localStorage.setItem('profileEmail', email);
      localStorage.setItem('profileNIM', nim);
      localStorage.setItem('profileMajor', major);
      localStorage.setItem('profileSemester', semester);
      localStorage.setItem('profilePhone', phone);
      localStorage.setItem('profileAddress', address);
    } catch {}
    setIsSaved(true);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (prevObjectUrlRef.current) URL.revokeObjectURL(prevObjectUrlRef.current);
    prevObjectUrlRef.current = url;
    setProfilePhoto(url);
  };

  return (
    <SimpleLayout title="Edit Profil">
      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <button
              type="button"
              onClick={handlePhotoClick}
              className="w-24 h-24 rounded-full overflow-hidden p-0 border-0 bg-transparent cursor-pointer"
              aria-label="Ubah foto profil"
            >
              <img src={profilePhoto} alt="profile" className="w-24 h-24 rounded-full object-cover" />
            </button>
            <button
              type="button"
              onClick={handlePhotoClick}
              className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full"
              aria-label="Ubah foto"
            >
              <CameraIcon className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
          <p className="text-sm text-gray-600  mt-2">Ketuk untuk mengubah foto</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700  mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-orange-500 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  mb-1">NIM</label>
            <input
              type="text"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              className="w-full px-3 py-2 border border-orange-500 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  mb-1">Jurusan</label>
            <input
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full px-3 py-2 border border-orange-500 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  mb-1">Semester</label>
            <input
              type="number"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-3 py-2 border border-orange-500 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-orange-500 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  mb-1">Nomor Telepon</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-orange-500 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  mb-1">Alamat</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-orange-500 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-orange-500 text-white py-3 px-4 rounded-full font-medium hover:bg-orange-600 transition-colors"
        >
          Simpan Perubahan
        </button>

        {showToast && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300">
            Profil berhasil disimpan!
          </div>
        )}
      </div>
    </SimpleLayout>
  );
}