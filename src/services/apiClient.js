import { buildApiUrl } from "../config/api";
import { loadSession } from "../utils/authSession";

const resolveUrl = (url) => {
  if (typeof url !== "string") return buildApiUrl("");
  return /^https?:\/\//i.test(url) ? url : buildApiUrl(url);
};

const normalizeBody = (body) => {
  if (body === undefined || body === null) return undefined;
  if (typeof body === "string") return body;
  if (body instanceof FormData) return body;
  return JSON.stringify(body);
};

export const apiRequest = async (url, options = {}) => {
  const targetUrl = resolveUrl(url);
  const session = loadSession();
  const headers = { ...(options.headers || {}) };

  if (!headers.Accept) {
    headers.Accept = "application/json";
  }

  if (
    options.body !== undefined &&
    options.body !== null &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] = "application/json";
  }

  const token = session?.token?.trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(targetUrl, {
    ...options,
    headers,
    body: normalizeBody(options.body),
  });

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  return {
    ok: response.ok && response.status >= 200 && response.status < 300,
    status: response.status,
    data,
    headers: response.headers,
  };
};
