import { useParams, Link } from "react-router-dom";
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
        {/* Merged header + content container */}
        <div className="w-full rounded-md overflow-hidden bg-white shadow-sm">
          <div className="flex items-center gap-3 bg-orange-500 text-white px-4 py-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V7a2 2 0 012-2h3l2 2h6a2 2 0 012 2v9a2 2 0 01-2 2z" />
            </svg>
            <div className="text-sm font-medium">Pengumuman</div>
          </div>

          <div className="p-6 min-h-[220px] flex flex-col justify-between">
            <div>
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.52 3.48A11.9 11.9 0 0012 0C5.373 0 .01 5.373 0 12c0 2.112.554 4.176 1.605 5.998L0 24l6.285-1.607A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12 0-3.194-1.247-6.183-3.48-8.52zM12 22.09c-1.64 0-3.263-.39-4.72-1.14l-.337-.173-3.726.953.994-3.63-.215-.362A9.01 9.01 0 013 12c0-4.97 4.03-9 9-9 2.408 0 4.666.94 6.364 2.635A8.996 8.996 0 0121 12c0 4.97-4.03 9-9 9z" />
                </svg>
                Bagikan ke WhatsApp
              </a>

              {/* Back to list (full width, orange) */}
              <Link
                to="/notifications"
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