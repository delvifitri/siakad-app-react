import { useParams } from "react-router-dom";
import { ShareIcon } from "@heroicons/react/24/outline";
import SimpleLayout from "../layouts/SimpleLayout";
import { newsData } from "../data/newsData";

export default function NewsDetail() {
  const { id } = useParams();

  const news = newsData[Number(id) as keyof typeof newsData] || { title: "Berita Tidak Ditemukan", date: "", img: "", content: "Konten tidak tersedia." };

  return (
    <SimpleLayout title="Berita Kampus">
      <div className="space-y-4">
        <div className="w-full rounded-md overflow-hidden bg-white shadow-sm border-t-4 border-orange-500">
          <div className="p-6">
            <h2 className="text-xl font-bold">{news.title}</h2>
            <p className="text-sm text-gray-500">{news.date}</p>
            <p className="text-gray-700  leading-relaxed mt-4">{news.content}</p>

            <div className="mt-6">
              <a
                href={`https://web.whatsapp.com/send?text=${encodeURIComponent(`${news.title}\n${news.date}\n\n${news.content}`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full font-medium hover:bg-orange-600"
              >
                <ShareIcon className="h-5 w-5 text-white" />
                Bagikan ke WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
}