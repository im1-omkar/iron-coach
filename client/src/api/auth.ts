const API_BASE = 'http://localhost:4000/api/auth';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string | null;
  };
}

export interface SignupRequest {
  email: string;
  username?: string;
  password: string;
}

export interface SignupResponse {
  id: string;
  email: string;
  username: string | null;
}

export interface AuthError {
  error: string;
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error: AuthError = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  return response.json();
}

export async function signup(data: SignupRequest): Promise<SignupResponse> {
  const response = await fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error: AuthError = await response.json();
    throw new Error(error.error || 'Signup failed');
  }

  return response.json();
}

