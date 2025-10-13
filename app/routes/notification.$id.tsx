import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SimpleLayout from '../layouts/SimpleLayout';
import notifications from '../data/notificationData';
import { BellIcon as BellOutline } from '@heroicons/react/24/outline';
import { BellIcon as BellSolid } from '@heroicons/react/24/solid';

export default function NotificationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = notifications.find((n) => n.id === id);

  const [showPresensiForm, setShowPresensiForm] = useState(false);
  const [status, setStatus] = useState<'hadir' | 'izin' | 'sakit' | ''>('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!id) return;
    try {
      const raw = localStorage.getItem('notificationsReadIds');
      const readIds = raw ? JSON.parse(raw) : [];
      if (!readIds.includes(id)) {
        readIds.push(id);
        localStorage.setItem('notificationsReadIds', JSON.stringify(readIds));
        // notify same-tab listeners
        window.dispatchEvent(new CustomEvent('notifications-changed'));
      }
    } catch (e) {
      // ignore
    }
  }, [id]);

  if (!item) {
    return (
      <SimpleLayout title="Notifikasi">
        <div className="p-4">Notifikasi tidak ditemukan.</div>
        <div className="p-4">
          <Link to="/notifications" className="text-orange-500">Kembali</Link>
        </div>
      </SimpleLayout>
    );
  }

  const handleSubmitPresensi = () => {
    if (!status) return;
    if ((status === 'izin' || status === 'sakit') && !file) {
      setFileError('Silakan unggah bukti untuk status izin atau sakit.');
      return;
    }
    // save presensi locally for demo purposes
    try {
      const raw = localStorage.getItem('presensiRecords');
      const records = raw ? JSON.parse(raw) : [];
      records.push({ id: item.id, status, fileName: file?.name ?? null, timestamp: new Date().toISOString() });
      localStorage.setItem('presensiRecords', JSON.stringify(records));
    } catch (e) {}
    setSubmitted(true);
    // also mark notification read (already done on mount, but ensure)
    try {
      const raw = localStorage.getItem('notificationsReadIds');
      const readIds = raw ? JSON.parse(raw) : [];
      if (!readIds.includes(item.id)) {
        readIds.push(item.id);
        localStorage.setItem('notificationsReadIds', JSON.stringify(readIds));
        window.dispatchEvent(new CustomEvent('notifications-changed'));
      }
    } catch (e) {}
  };

  return (
    <SimpleLayout title="Notifikasi">
      <div className="p-4">
        <div className="max-w-md mx-auto bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <BellSolid className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <h1 className="text-xl font-bold mb-2">{item.title}</h1>
          {item.course && <div className="text-sm text-orange-600 font-medium">{item.course}{item.className ? ` - ${item.className}` : ''}</div>}
          <p className="text-sm text-gray-700 mt-3">{item.description}</p>
          {item.instructor && <p className="text-xs text-gray-500 mt-2">{item.instructor} • {item.time}</p>}

          {/* Presensi action */}
          {item.type === 'presensi' && (
            <div className="mt-6">
              {!showPresensiForm ? (
                <button onClick={() => setShowPresensiForm(true)} className="w-full py-3 rounded-full bg-gradient-to-br from-orange-500 to-orange-400 text-white">Isi Presensi</button>
              ) : (
                <div className="mt-4 space-y-3">
                  {submitted ? (
                    <div className="p-3 rounded-lg bg-green-50 text-green-700">Presensi berhasil dikirim.</div>
                  ) : (
                    <>
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => setStatus('hadir')} className={`px-4 py-2 rounded-full ${status==='hadir' ? 'bg-green-500 text-white' : 'bg-gray-100'}`}>Hadir</button>
                        <button onClick={() => setStatus('izin')} className={`px-4 py-2 rounded-full ${status==='izin' ? 'bg-yellow-400 text-white' : 'bg-gray-100'}`}>Izin</button>
                        <button onClick={() => setStatus('sakit')} className={`px-4 py-2 rounded-full ${status==='sakit' ? 'bg-red-500 text-white' : 'bg-gray-100'}`}>Sakit</button>
                      </div>

                      {(status === 'izin' || status === 'sakit') && (
                        <div className="mt-2">
                          <label className="text-sm text-gray-600 block mb-1">Unggah bukti (surat izin / surat sakit)</label>
                          <div className="mt-1">
                            <input
                              ref={(el) => (fileInputRef.current = el)}
                              id="notif-file-input"
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0] ?? null;
                                if (!f) return setFile(null);
                                const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
                                const max = 5 * 1024 * 1024; // 5MB
                                if (!allowed.includes(f.type)) {
                                  setFile(null);
                                  setFileError('Tipe file tidak didukung. Gunakan pdf, jpg, atau png.');
                                  return;
                                }
                                if (f.size > max) {
                                  setFile(null);
                                  setFileError('Ukuran file melebihi 5MB.');
                                  return;
                                }
                                setFileError(null);
                                setFile(f);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setFileError(null);
                                fileInputRef.current?.click();
                              }}
                              className="w-full border-2 border-dashed border-gray-200 rounded-lg py-6 flex flex-col items-center justify-center text-sm text-gray-500 hover:border-orange-300 transition"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16v-4a4 4 0 014-4h1" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 16l-4-4-4 4" />
                              </svg>
                              <span className="mt-2">Klik atau tarik file untuk mengunggah</span>
                              <span className="text-xs text-gray-400">pdf/jpg/png, maks 5MB</span>
                            </button>

                            {fileError && <div className="text-xs text-red-500 mt-2">{fileError}</div>}

                            {file && (
                              <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                                <div className="truncate">{file.name}</div>
                                <button type="button" onClick={() => setFile(null)} className="text-xs text-red-500 ml-4">Hapus</button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-3 flex gap-2">
                        <button onClick={handleSubmitPresensi} className="flex-1 py-2 rounded-full bg-orange-500 text-white">Kirim</button>
                        <button onClick={() => setShowPresensiForm(false)} className="flex-1 py-2 rounded-full bg-gray-100">Batal</button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* back button intentionally removed per UX request */}
        </div>
      </div>
    </SimpleLayout>
  );
}
