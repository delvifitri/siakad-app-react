import { z } from 'zod';

// Profile schema
export const profileSchema = z.object({
  nim: z.string(),
  full_name: z.string(),
  email: z.string().email(),
  gender: z.string(),
  semester: z.number(),
  program_studi: z.string(),
});

export type Profile = z.infer<typeof profileSchema>;

// Stat schema
export const statSchema = z.object({
  id: z.number(),
  name: z.string(),
  value: z.union([z.string(), z.number()]),
  url: z.string(),
});

export type Stat = z.infer<typeof statSchema>;

// News schema
export const newsSchema = z.object({
  id: z.number(),
  staf_id: z.number(),
  judul: z.string(),
  slug: z.string(),
  deskripsi: z.string(),
  gambar: z.string().nullable(),
  status: z.number(),
  tgl_publish: z.string(),
});

export type News = z.infer<typeof newsSchema>;

// Home response schema
export const homeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    profile: profileSchema,
    photo: z.string(),
    stats: z.array(statSchema),
    news: z.array(newsSchema),
  }),
});

export type HomeResponse = z.infer<typeof homeResponseSchema>;
