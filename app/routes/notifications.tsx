import SimpleLayout from "../layouts/SimpleLayout";

export default function Notifications() {
  return (
    <SimpleLayout title="Pemberitahuan">
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
          <h2 className="font-medium">Pengumuman Sistem</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Sistem akan menjalankan maintenance pada pukul 02:00.</p>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
          <h2 className="font-medium">Jadwal Kuliah</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Perubahan jadwal untuk Mata Kuliah Pemrograman Web.</p>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
          <h2 className="font-medium">Pembayaran</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Pembayaran Anda diterima pada 10 Oktober 2025.</p>
        </div>
      </div>
    </SimpleLayout>
  );
}
