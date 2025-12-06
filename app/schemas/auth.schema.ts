export interface LoginRequest {
  nim: string;
  password: string;
}

export interface User {
  id: number;
  nim: string;
  nama: string;
  email: string;
  role: string;
}

export interface SessionInfo {
  expires_at: string;
  max_concurrent_sessions: number;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    session_info: SessionInfo;
  };
}
