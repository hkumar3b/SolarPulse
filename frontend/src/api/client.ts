import type {
  PortfolioResponse,
  PlantDetailResponse,
  AlertItem,
} from "../types/api";

const BASE_URL = "http://localhost:3001/api";

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
): Promise<PortfolioResponse> {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  return fetch(`${BASE_URL}/portfolio?${params}`).then((res) =>
    handleResponse<PortfolioResponse>(res),
  );
}

export function fetchPlantDetail(
  plantId: string,
  from?: string,
  to?: string,
): Promise<PlantDetailResponse> {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  return fetch(`${BASE_URL}/plants/${plantId}?${params}`).then((res) =>
    handleResponse<PlantDetailResponse>(res),
  );
}

export function fetchAlerts(from?: string, to?: string): Promise<AlertItem[]> {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  return fetch(`${BASE_URL}/alerts?${params}`).then((res) =>
    handleResponse<AlertItem[]>(res),
  );
}
