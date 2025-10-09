import { useParams } from "react-router-dom";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import SimpleLayout from "../layouts/SimpleLayout";

export default function Chat() {
  const { id } = useParams();

  const chatData = {
    1: { name: "Dosen A", messages: [
      { sender: "Dosen A", text: "Halo, ada pertanyaan tentang tugas?", time: "10:30" },
      { sender: "You", text: "Ya, saya bingung dengan soal nomor 3.", time: "10:32" },
      { sender: "Dosen A", text: "Baik, saya jelaskan ya.", time: "10:35" }
    ]},
    2: { name: "Mahasiswa B", messages: [
      { sender: "Mahasiswa B", text: "Terima kasih atas bantuannya!", time: "09:15" },
      { sender: "You", text: "Sama-sama!", time: "09:16" }
    ]},
    3: { name: "Admin", messages: [
      { sender: "Admin", text: "Pemberitahuan penting tentang jadwal.", time: "Kemarin" },
      { sender: "You", text: "Baik, saya baca.", time: "Kemarin" }
    ]}
  };

  const chat = chatData[Number(id) as keyof typeof chatData] || { name: "Unknown", messages: [] };

  return (
    <SimpleLayout title={chat.name} footer={
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ketik pesan..."
          className="flex-1 p-3 rounded-3xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600">
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </div>
    }>
      <div className="space-y-4 overflow-y-auto">
        {chat.messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs p-3 rounded-2xl ${msg.sender === "You" ? "bg-blue-500 text-white" : "bg-white dark:bg-gray-800"}`}>
              <p>{msg.text}</p>
              <span className="text-xs opacity-70">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>
    </SimpleLayout>
  );
}