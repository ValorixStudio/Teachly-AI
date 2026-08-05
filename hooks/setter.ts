"use client";

import { useCallback, useState } from "react";



interface ApiErrorResponse {
  msg?: string;
  message?: string;
  error?: string;
}

function getApiErrorMessage(value: unknown, fallback: string) {
  if (!value || typeof value !== "object") return fallback;
  const data = value as ApiErrorResponse;
  return data.msg ?? data.message ?? data.error ?? fallback;
}

function getAuthToken(): string | null {
  try {
    return window.localStorage.getItem("teachly-ai-token");
  } catch {
    return null;
  }
}



interface ProgressApiPayload<TBody = unknown> {
  url: string;
  method?: "GET" | "POST";
  bodyData?: TBody;
}

export const useProgressApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callProgressApi = useCallback(
    async <T = unknown, TBody = unknown>({
      url,
      method = "POST",
      bodyData,
    }: ProgressApiPayload<TBody>): Promise<T | false> => {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        setError("Not logged in");
        setLoading(false);
        return false;
      }

      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          ...(method === "POST" ? { body: JSON.stringify(bodyData ?? {}) } : {}),
        });

        const data = (await response.json().catch(() => null)) as unknown;

        if (!response.ok) {
          setError(getApiErrorMessage(data, "Request failed"));
          return false;
        }

        return data as T;
      } catch (apiError) {
        console.error("Progress API Error:", apiError);
        setError("Unable to connect. Please try again.");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { callProgressApi, loading, error };
};

// ---------------------------------------------------------------------
// useSetter — unchanged, for the login flow (POST only, no auth header,
// uses NEXT_PUBLIC_LOGIN_API_URL as its base).
// ---------------------------------------------------------------------

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginApiPayload {
  url?: string;
  bodyData: LoginPayload;
}

export interface LoginApiResponse {
  token: string;
  user?: {
    email: string;
    name?: string;
  };
}

export const useSetter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callSetter = useCallback(
    async <T = LoginApiResponse>({
      url = `/`,
      bodyData,
    }: LoginApiPayload): Promise<T | false> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_LOGIN_API_URL}/${url}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        });

        const data = (await response.json().catch(() => null)) as unknown;

        if (!response.ok) {
          const message = getApiErrorMessage(data, "Login failed");
          setError(message);
          return false;
        }

        return data as T;
      } catch (apiError) {
        console.error("Login API Error:", apiError);
        const message = "Unable to connect. Please try again.";
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { callSetter, loading, error };
};