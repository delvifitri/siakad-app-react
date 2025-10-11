import { useParams, Link } from "react-router-dom";
import { ShareIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import SimpleLayout from "../layouts/SimpleLayout";
import { announcements } from "../data/announcementData";

export default function AnnouncementDetail() {
  const { id } = useParams<{ id: string }>();

  

  const announcement = announcements.find((a) => a.id === parseInt(id || "0"));

  if (!announcement) {
    return (
      <SimpleLayout title="Pengumuman">
        <div className="p-4 text-center">
          <p>Pengumuman tidak ditemukan.</p>
        </div>
      </SimpleLayout>
    );
  }

  return (
    <SimpleLayout title="Detail Pengumuman">
      <div className="space-y-4">
        {/* Content container with orange top border (no icon/header) */}
        <div className="w-full rounded-xl overflow-hidden bg-white shadow-sm border-t-4 border-orange-500">

          <div className="p-6 min-h-[220px] flex flex-col justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900 mb-2">{announcement.title}</h1>
              <p className="text-sm text-gray-500 mb-4">{announcement.date}</p>
              <p className="text-gray-700 mb-6">{announcement.description}</p>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              {/* WhatsApp share button (full width) */}
              <a
                href={`https://web.whatsapp.com/send?text=${encodeURIComponent(`${announcement.title}\n${announcement.date}\n\n${announcement.description}`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex justify-center items-center gap-2 bg-orange-500 text-white px-4 py-3 rounded-full font-medium hover:bg-orange-600"
              >
                <ShareIcon className="h-5 w-5" />
                Bagikan ke WhatsApp
              </a>

              {/* Back to list (full width, gray) - open Pengumuman tab */}
              <Link
                to="/notifications?tab=announcements"
                className="w-full inline-flex justify-center items-center gap-2 bg-gray-100 text-gray-800 px-4 py-3 rounded-full font-medium hover:bg-gray-200"
              >
                Kembali ke Daftar Pengumuman
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
}