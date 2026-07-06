import type {
  PortfolioResponse,
  PlantDetailResponse,
  AlertItem,
} from "../types/api";

const BASE_URL = "http://localhost:3001/api";

function getHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed with status ${res.status}`);
  }
  return res.json();
}

export function fetchPortfolio(
  from?: string,
  to?: string,
  threshold?: number,
): Promise<PortfolioResponse> {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  if (threshold !== undefined) params.set("threshold", threshold.toString());
  return fetch(`${BASE_URL}/portfolio?${params}`, {
    headers: getHeaders(),
  }).then((res) => handleResponse<PortfolioResponse>(res));
}

export function fetchPlantDetail(
  plantId: string,
  from?: string,
  to?: string,
  threshold?: number,
): Promise<PlantDetailResponse> {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  if (threshold !== undefined) params.set("threshold", threshold.toString());
  return fetch(`${BASE_URL}/plants/${plantId}?${params}`, {
    headers: getHeaders(),
  }).then((res) => handleResponse<PlantDetailResponse>(res));
}

export function fetchAlerts(from?: string, to?: string): Promise<AlertItem[]> {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  return fetch(`${BASE_URL}/alerts?${params}`, {
    headers: getHeaders(),
  }).then((res) => handleResponse<AlertItem[]>(res));
}

// Authentication API methods
export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export function loginUser(email: string, password: string): Promise<AuthResponse> {
  return fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then((res) => handleResponse<AuthResponse>(res));
}

export function registerUser(email: string, password: string): Promise<{ message: string }> {
  return fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then((res) => handleResponse<{ message: string }>(res));
}

export function fetchMe(): Promise<{ user: AuthUser }> {
  return fetch(`${BASE_URL}/auth/me`, {
    headers: getHeaders(),
  }).then((res) => handleResponse<{ user: AuthUser }>(res));
}
