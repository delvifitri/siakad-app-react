export type ChatMessage = {
  sender: string;
  text: string;
  time: string;
};

export type ChatThread = {
  name: string;
  messages: ChatMessage[];
};

export const chatData: Record<number, ChatThread> = {
  1: {
    name: "Dosen A",
    messages: [
      { sender: "Dosen A", text: "Halo, ada pertanyaan tentang tugas?", time: "10:30" },
      { sender: "You", text: "Ya, saya bingung dengan soal nomor 3.", time: "10:32" },
      { sender: "Dosen A", text: "Baik, saya jelaskan ya.", time: "10:35" },
    ],
  },
  2: {
    name: "Mahasiswa B",
    messages: [
      { sender: "Mahasiswa B", text: "Terima kasih atas bantuannya!", time: "09:15" },
      { sender: "You", text: "Sama-sama!", time: "09:16" },
    ],
  },
  3: {
    name: "Admin",
    messages: [
      { sender: "Admin", text: "Pemberitahuan penting tentang jadwal.", time: "Kemarin" },
      { sender: "You", text: "Baik, saya baca.", time: "Kemarin" },
    ],
  },
};
