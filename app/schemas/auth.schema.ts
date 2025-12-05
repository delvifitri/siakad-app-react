import { z } from 'zod';

// Login request schema
export const loginRequestSchema = z.object({
  nim: z.string().min(1, 'NIM tidak boleh kosong'),
  password: z.string().min(1, 'Password tidak boleh kosong'),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

// User schema
export const userSchema = z.object({
  id: z.number(),
  nim: z.string(),
  nama: z.string(),
  email: z.string().email(),
  role: z.string(),
});

export type User = z.infer<typeof userSchema>;

// Session info schema
export const sessionInfoSchema = z.object({
  expires_at: z.string(),
  max_concurrent_sessions: z.number(),
});

export type SessionInfo = z.infer<typeof sessionInfoSchema>;

// Login response schema
export const loginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    user: userSchema,
    session_info: sessionInfoSchema,
  }),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
