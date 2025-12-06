export interface MataKuliah {
  id: number;
  nama_mk: string;
  sks: number;
  kelas: string;
  kelas_text: string;
  status: string;
  status_color: string;
}

export interface DosenPa {
  id: number;
  nama: string;
  nidn: string;
  email?: string;
}

export interface StatusKrsData {
  dosen_pa: DosenPa | null;
  semester: string | number;
  tahun_ajaran: string;
  ringkasan: string;
  mata_kuliah: MataKuliah[];
}

export interface StatusKrsResponse {
  success: boolean;
  message: string;
  data: StatusKrsData;
}
