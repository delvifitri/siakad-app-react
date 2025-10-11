import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SimpleLayout from "../layouts/SimpleLayout";

export default function Notifications() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'notifications' | 'announcements'>(() => {
    const q = new URLSearchParams(location.search).get('tab');
    return q === 'announcements' ? 'announcements' : 'notifications';
  });

  const notifications = [
    {
      title: "Pengumuman Sistem",
      description: "Sistem akan menjalankan maintenance pada pukul 02:00.",
    },
    {
      title: "Jadwal Kuliah",
      description: "Perubahan jadwal untuk Mata Kuliah Pemrograman Web.",
    },
    {
      title: "Pembayaran",
      description: "Pembayaran Anda diterima pada 10 Oktober 2025.",
    },
  ];

  const announcements = [
    {
      id: 1,
      title: "Pengumuman Wisuda Campus 2025",
      description: "Wisuda akan dilaksanakan 25 Okt 2025 di Aula Utama. Cek portal untuk info lengkap.",
    },
    {
      id: 2,
      title: "Perubahan Jadwal Kuliah",
      description: "Perubahan jadwal untuk Mata Kuliah Pemrograman Web.",
    },
    {
      id: 3,
      title: "Pembayaran SPP",
      description: "Pembayaran SPP semester ini telah dibuka.",
    },
  ];

  return (
    <SimpleLayout title="Pemberitahuan">
      <div className="mb-4">
        <div className="flex bg-gray-100  rounded-lg p-1">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'bg-white  text-gray-900  shadow-sm'
                : 'text-gray-600 '
            }`}
          >
            Notifikasi
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'announcements'
                ? 'bg-white  text-gray-900  shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Pengumuman
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {activeTab === 'notifications' ? (
          notifications.map((item, index) => (
            <div key={index} className="p-4 rounded-lg bg-white  shadow-sm">
              <h2 className="font-bold">{item.title}</h2>
              <p className="text-sm text-gray-600 ">{item.description}</p>
            </div>
          ))
        ) : (
          announcements.map((item) => (
            <Link
              key={item.id}
              to={`/announcements/${item.id}`}
              className="block p-4 rounded-lg bg-white  shadow-sm hover:bg-gray-50  transition-colors"
            >
              <h2 className="font-bold">{item.title}</h2>
              <p className="text-sm text-gray-600 ">{item.description}</p>
            </Link>
          ))
        )}
      </div>
    </SimpleLayout>
  );
}
