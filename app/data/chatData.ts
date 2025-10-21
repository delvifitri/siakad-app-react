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
  4: {
    name: "Komisi Tugas Akhir",
    messages: [
      { sender: "Komisi TA", text: "Selamat, proposal Anda telah diterima untuk penjadwalan seminar.", time: "08:15" },
      { sender: "You", text: "Terima kasih informasinya, Bu/Pak.", time: "08:17" },
    ],
  },
  5: {
    name: "Dosen Pembimbing 1",
    messages: [
      { sender: "Dosen Pembimbing 1", text: "Silakan perbaiki Bab 1 sesuai catatan terakhir.", time: "Kemarin" },
      { sender: "You", text: "Baik Pak, akan saya revisi hari ini.", time: "Kemarin" },
    ],
  },
  6: {
    name: "Dosen Pembimbing 2",
    messages: [
      { sender: "Dosen Pembimbing 2", text: "Mohon kirimkan draft Bab 3 sebelum Jumat.", time: "09:00" },
      { sender: "You", text: "Siap, Pak. Saya kirim Kamis sore.", time: "09:05" },
    ],
  },
  7: {
    name: "Penguji 1",
    messages: [
      { sender: "Penguji 1", text: "Mohon siapkan ringkasan metodologi 1 halaman.", time: "12:20" },
      { sender: "You", text: "Baik Pak/Bu, segera saya siapkan.", time: "12:23" },
    ],
  },
  8: {
    name: "Penguji 2",
    messages: [
      { sender: "Penguji 2", text: "Pastikan referensi menggunakan format terbaru.", time: "Kemarin" },
      { sender: "You", text: "Baik, akan saya sesuaikan.", time: "Kemarin" },
    ],
  },
};
