import SimpleLayout from "../layouts/SimpleLayout";
import { Link } from "react-router";
import { chatData } from "../data/chatData";

export default function Messages() {
  const threads = Object.entries(chatData).map(([id, thread]) => ({ id, ...thread } as any));

  return (
    <SimpleLayout title="Pesan">
      <div className="space-y-4">
        {threads.map((t) => (
          <Link
            key={t.id}
            to={`/chat/${t.id}`}
            className="block p-4 rounded-lg bg-white  shadow-sm hover:bg-gray-50 "
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">{t.name.charAt(0)}</div>
              <div className="flex-1">
                <h2 className="font-medium">{t.name}</h2>
                <p className="text-sm text-gray-600 ">{t.messages[t.messages.length - 1]?.text}</p>
              </div>
              <span className="text-xs text-gray-500">{t.messages[t.messages.length - 1]?.time}</span>
            </div>
          </Link>
        ))}
      </div>
    </SimpleLayout>
  );
}