import { useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import SimpleLayout from '../layouts/SimpleLayout';
import notifications from '../data/notificationData';

export function meta() {
  return [{ title: 'Detail Presensi Hadir' }];
}

export default function PresensiDetail() {
  const { id } = useParams();
  const [sp] = useSearchParams();
  const hinted = sp.get('status') || undefined;
  const item = notifications.find((n) => n.id === id);
  // Read record info from query params (passed from list page)
  const qpStatus = sp.get('status') || undefined;
  const qpFileName = sp.get('fileName') || undefined;
  const qpTs = sp.get('ts') || undefined;
  const status = useMemo(() => qpStatus || hinted, [qpStatus, hinted]);

  if (!item) {
    return (
      <SimpleLayout title="Presensi">
        <div className="p-4">Data presensi tidak ditemukan.</div>
        <div className="p-4"><Link to="/presensi" className="text-orange-500">Kembali</Link></div>
      </SimpleLayout>
    );
  }

  return (
    <SimpleLayout title="Presensi">
      <div className="p-4">
        <div className="max-w-md mx-auto bg-white rounded-xl p-6 shadow-sm">
          <h1 className="text-lg font-bold mb-2">{item.course}{item.className ? ` - ${item.className}` : ''}</h1>
          {item.instructor && item.time && (
            <div className="text-xs text-gray-500 mb-3">{item.instructor} • {item.time}</div>
          )}

          {status === 'hadir' ? (
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="text-green-800 font-semibold">✓ Presensi Hadir Tercatat</div>
              <div className="text-sm text-green-700 mt-1">Anda telah melakukan presensi hadir untuk mata kuliah ini.</div>
              {qpTs && (
                <div className="text-xs text-green-700 mt-2">Waktu: {new Date(qpTs).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</div>
              )}
            </div>
          ) : status === 'izin' || status === 'sakit' ? (
            <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="text-yellow-800 font-semibold">Presensi Tidak Hadir</div>
              <div className="text-sm text-yellow-700 mt-1">Status: <strong className="capitalize">{status}</strong></div>
              <div className="mt-3">
                <div className="text-xs text-gray-500 mb-1">Surat yang terlampir:</div>
                {qpFileName ? (
                  <div className="p-2 bg-white rounded border text-sm text-gray-700">{qpFileName}</div>
                ) : (
                  <div className="text-sm text-gray-500 italic">Tidak ada file terlampir</div>
                )}
              </div>
              {qpTs && (
                <div className="text-xs text-yellow-700 mt-2">Waktu: {new Date(qpTs).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-gray-700">Belum ada data presensi untuk mata kuliah ini.</div>
            </div>
          )}

          <div className="mt-6">
            <Link to="/presensi" className="inline-block px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">Kembali ke Daftar Presensi</Link>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
}
