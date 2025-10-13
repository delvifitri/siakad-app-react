import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SimpleLayout from "../layouts/SimpleLayout";
import notificationsData from "../data/notificationData";

export default function Notifications() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'notifications' | 'announcements'>(() => {
    const q = new URLSearchParams(location.search).get('tab');
    return q === 'announcements' ? 'announcements' : 'notifications';
  });

  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('notificationsReadIds');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  // Keep localStorage in sync when readIds change
  useEffect(() => {
    try {
      localStorage.setItem('notificationsReadIds', JSON.stringify(readIds));
      // notify other listeners in the same tab
      window.dispatchEvent(new CustomEvent('notifications-changed'));
    } catch (e) {
      // ignore
    }
  }, [readIds]);

  const notifications = notificationsData;

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

  const markAsRead = (id: string) => {
    if (readIds.includes(id)) return;
    setReadIds((s) => [...s, id]);
  };

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
          notifications.map((item) => {
            const isRead = readIds.includes(item.id);
            const baseClass = `p-4 rounded-lg shadow-sm ${isRead ? 'bg-white/30 backdrop-blur-sm border border-white/20' : 'bg-white'}`;

            return (
              <Link
                key={item.id}
                to={`/notification/${item.id}`}
                onClick={() => markAsRead(item.id)}
                className={baseClass + ' block'}
              >
                <h2 className="font-bold">{item.title}</h2>
                <p className="text-sm text-gray-600 ">{item.description}</p>
                {item.course || item.time ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.course ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-100">{item.course}{item.className ? ` - ${item.className}` : ''}</span>
                    ) : null}
                    {item.time ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-50 text-gray-800 border border-gray-100">{item.time}</span>
                    ) : null}
                  </div>
                ) : null}
              </Link>
            );
          })
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
