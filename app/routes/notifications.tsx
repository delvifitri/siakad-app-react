import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SimpleLayout from "../layouts/SimpleLayout";
import notificationsData from "../data/notificationData";

export default function Notifications() {
  // Single list page: only Notifikasi (announcements tab removed)

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

  // Announcements tab removed per request

  const markAsRead = (id: string) => {
    if (readIds.includes(id)) return;
    setReadIds((s) => [...s, id]);
  };

  return (
    <SimpleLayout title="Pemberitahuan">
      {/* Tabs removed: only Notifikasi is shown */}

      <div className="space-y-4">
        {notifications.map((item) => {
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
        })}
      </div>
    </SimpleLayout>
  );
}
