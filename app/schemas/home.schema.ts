export interface Profile {
  nim: string;
  full_name: string;
  email: string;
  gender: string;
  semester: number;
  program_studi: string;
}

export interface Stat {
  id: number;
  name: string;
  value: string | number;
}

export interface News {
  id: number;
  staf_id: number;
  judul: string;
  slug: string;
  deskripsi: string;
  gambar: string | null;
  status: number;
  tgl_publish: string;
}

export interface HomeResponse {
  success: boolean;
  message: string;
  data: {
    profile: Profile;
    photo: string;
    stats: Stat[];
    news: News[];
  };
}
