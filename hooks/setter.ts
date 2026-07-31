"use client";

import { useCallback, useState } from "react";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginApiPayload {
  url?: string;
  bodyData: LoginPayload;
}

interface ApiErrorResponse {
  msg?: string;
  message?: string;
  error?: string;
}

export interface LoginApiResponse {
  token: string;
  user?: {
    email: string;
    name?: string;
  };
}

function getApiErrorMessage(value: unknown, fallback: string) {
  if (!value || typeof value !== "object") return fallback;

  const data = value as ApiErrorResponse;
  return data.msg ?? data.message ?? data.error ?? fallback;
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