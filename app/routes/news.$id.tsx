import { useParams } from "react-router-dom";
import SimpleLayout from "../layouts/SimpleLayout";
import { newsData } from "../data/newsData";

export default function NewsDetail() {
  const { id } = useParams();

  const news = newsData[Number(id) as keyof typeof newsData] || { title: "Berita Tidak Ditemukan", date: "", img: "", content: "Konten tidak tersedia." };

  return (
    <SimpleLayout title="Berita Kampus">
      <div className="space-y-4">
        {news.img && <img src={news.img} alt={news.title} className="w-full h-48 rounded-lg object-cover" />}
        <h2 className="text-xl font-bold">{news.title}</h2>
        <p className="text-sm text-gray-500">{news.date}</p>
        <p className="text-gray-700  leading-relaxed">{news.content}</p>
      </div>
    </SimpleLayout>
  );
}