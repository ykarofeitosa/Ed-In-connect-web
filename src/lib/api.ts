// const BASE_URL = "http://localhost:3333";
const BASE_URL = "https://ed-in-connect-api-1.onrender.com"

function getToken(): string | null {
  return localStorage.getItem("@edinconnect:token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Erro desconhecido" }));

    throw new Error(error.message ?? `Erro ${response.status}`);
  }

  if (response.status === 204) return undefined as T;

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return undefined as T;
  }

  const text = await response.text();

  if (!text) return undefined as T;

  return JSON.parse(text) as T;
}

export const api = {
  get:    <T>(path: string)                  => request<T>(path),
  post:   <T>(path: string, body: unknown)   => request<T>(path, { method: "POST",  body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown)   => request<T>(path, { method: "PUT",   body: JSON.stringify(body) }),
  patch:  <T>(path: string, body: unknown)   => request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string)                  => request<T>(path, { method: "DELETE" }),
};