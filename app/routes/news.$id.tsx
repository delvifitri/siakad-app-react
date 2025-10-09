import { useParams } from "react-router-dom";
import SimpleLayout from "../layouts/SimpleLayout";

export default function NewsDetail() {
  const { id } = useParams();

  const newsData = {
    1: {
      title: "Pengumuman Sistem Maintenance",
      date: "10 Oktober 2025",
      img: "/favicon.ico",
      content: "Sistem SIAKAD akan menjalankan maintenance pada pukul 02:00 hingga 04:00 WIB. Selama maintenance, sistem tidak dapat diakses. Mohon maaf atas ketidaknyamanannya."
    },
    2: {
      title: "Jadwal Kuliah Diperbarui",
      date: "9 Oktober 2025",
      img: "/favicon.ico",
      content: "Perubahan jadwal kuliah untuk Mata Kuliah Pemrograman Web. Jadwal baru: Senin, 08:00 - 10:00 di Ruang 101. Silakan periksa jadwal terbaru di portal."
    }
  };

  const news = newsData[Number(id) as keyof typeof newsData] || { title: "Berita Tidak Ditemukan", date: "", img: "", content: "Konten tidak tersedia." };

  return (
    <SimpleLayout title="Berita Kampus">
      <div className="space-y-4">
        {news.img && <img src={news.img} alt={news.title} className="w-full h-48 rounded-lg object-cover" />}
        <h2 className="text-xl font-bold">{news.title}</h2>
        <p className="text-sm text-gray-500">{news.date}</p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{news.content}</p>
      </div>
    </SimpleLayout>
  );
}