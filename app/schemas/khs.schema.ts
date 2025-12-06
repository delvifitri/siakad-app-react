export interface MataKuliah {
  id: number;
  kode_mk: string;
  id_mk: number;
  nama_mk: string;
  sks: number;
  nilai_huruf: string;
  nilai_indeks: string;
  nilai_angka: number;
}

export interface Mahasiswa {
  nama: string;
  nim: string;
  prodi: string;
}

export interface DosenPa {
  nama: string;
}

export interface SemesterInfo {
  semester: string;
  tahun_ajaran: string;
}

export interface Summary {
  total_mk: number;
  total_sks: number;
  total_nilai: number;
  ips: string;
  ipk: string;
}

export interface KhsData {
  mahasiswa: Mahasiswa;
  dosen_pa: DosenPa;
  semester_info: SemesterInfo;
  summary: Summary;
  mata_kuliah: MataKuliah[];
}

export interface KhsResponse {
  success: boolean;
  message: string;
  data: {
    semesters: string[];
    active_semester: string;
    khs: KhsData;
  };
}
