// src/lib/public-api/http.ts
type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export type HttpErrorShape = {
  status: number;
  message: string;
  details?: unknown;
};

export class HttpError extends Error {
  status: number;
  details?: unknown;
  constructor(data: HttpErrorShape) {
    super(data.message);
    this.status = data.status;
    this.details = data.details;
  }
}

export type HttpClientOptions = {
  baseUrl?: string;
  timeoutMs?: number;
};

const DEFAULT_TIMEOUT = 15000;

/**
 * Minimal fetch wrapper for the public site.
 * No auth token. JSON by default. Graceful error normalization.
 */
export class HttpClient {
  private baseUrl: string;
  private timeoutMs: number;

  constructor(opts: HttpClientOptions = {}) {
    this.baseUrl =
      opts.baseUrl ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "http://localhost:4000";
    this.timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT;
  }

  private buildHeaders(extra?: HeadersInit, body?: unknown): HeadersInit {
    const isFormData =
      typeof FormData !== "undefined" && body instanceof FormData;

    const headers: HeadersInit = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...extra,
    };
    return headers;
  }

  private async handle<T>(res: Response): Promise<T> {
    const ct = res.headers.get("content-type") || "";
    const isJson = ct.includes("application/json");

    if (!res.ok) {
      let message = `HTTP ${res.status}`;
      let details: unknown;
      if (isJson) {
        try {
          const body = await res.json();
          message = body?.message || body?.error || message;
          details = body;
        } catch {
          /* ignore */
        }
      } else {
        try {
          const text = await res.text();
          message = text || message;
        } catch {
          /* ignore */
        }
      }
      throw new HttpError({ status: res.status, message, details });
    }

    if (isJson) {
      return (await res.json()) as T;
    }
    return (undefined as unknown) as T;
  }

  async request<T>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    init?: RequestInit
  ): Promise<T> {
    const url = path.startsWith("http") ? path : `${this.baseUrl}${path}`;
    const isFormData =
      typeof FormData !== "undefined" && body instanceof FormData;

    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), this.timeoutMs);

    try {
      const res = await fetch(url, {
        method,
        headers: this.buildHeaders(init?.headers, body),
        body:
          body != null
            ? (isFormData ? (body as BodyInit) : JSON.stringify(body))
            : undefined,
        signal: ctrl.signal,
        ...init,
      });
      return await this.handle<T>(res);
    } finally {
      clearTimeout(timeout);
    }
  }

  get<T>(path: string, init?: RequestInit) {
    return this.request<T>("GET", path, undefined, init);
  }
}

export const http = new HttpClient();
