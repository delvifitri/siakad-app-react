import { useParams, useSearchParams } from "react-router-dom";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import SimpleLayout from "../layouts/SimpleLayout";
import { chatData } from "../data/chatData";

export default function Chat() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  
  const studentName = searchParams.get('name');
  const chat = chatData[Number(id) as keyof typeof chatData] || { name: "Unknown", messages: [] };
  const displayName = studentName || chat.name;

  return (
    <SimpleLayout title={displayName} footer={
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Ketik pesan..."
          className="flex-1 h-11 px-4 rounded-3xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
        />
        <button className="h-11 w-11 shrink-0 rounded-full bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center">
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </div>
    }>
      <div className="space-y-4 overflow-y-auto">
        {chat.messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs p-3 rounded-2xl ${msg.sender === "You" ? "bg-blue-500 text-white" : "bg-white "}`}>
              <p>{msg.text}</p>
              <span className="text-xs opacity-70">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>
    </SimpleLayout>
  );
}