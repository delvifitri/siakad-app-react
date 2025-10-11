import { useParams } from "react-router-dom";
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
        <div className="p-4 rounded-lg bg-white  shadow-sm">
          <img
            src={announcement.img}
            alt={announcement.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h1 className="text-xl font-bold mb-2">{announcement.title}</h1>
          <p className="text-sm text-gray-500  mb-4">{announcement.date}</p>
          <p className="text-gray-700 ">{announcement.description}</p>
        </div>
      </div>
    </SimpleLayout>
  );
}
