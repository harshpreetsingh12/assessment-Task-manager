import { showToast } from "@/lib/toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 70_000);

  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
    ...(options.headers as { [key: string]: string }),
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',  // sends httpOnly cookies
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
      const error: any = new Error(errorData.message || 'API Request Failed');
      error.response = {
        status: response.status,
        data: errorData
      };
      handleApiError(error);
      throw error;
    }

    const text = await response.text();
    return { ok: true, data: text ? JSON.parse(text) : null };

  } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error("Request timed out. Please try again.");
      }
    throw err;
  }
};

export const apiStreamClient = async (endpoint: string, options: RequestInit = {}) => {
  const headers: { [key: string]: string } = {
    ...(options.headers as { [key: string]: string }),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error: any = new Error(errorData.message || 'API Request Failed');
    error.response = {
      status: response.status,
      data: errorData
    };
    handleApiError(error);
    throw error;
  }

  return response; 
};

const handleApiError = (err: any, fallbackMessage: string = "An unexpected error occurred") => {
  const status = err.response?.status;
  const serverMessage = err.response?.data?.message || err.message;
  
  switch (status) {
    case 401:
      showToast.error("Session Expired", "Please log in again.",'sessionError');
      break;
    case 403:
      showToast.error("Access Denied", "You don't have permission to do that.",'accessDenied');
      break;
    case 429:
      showToast.error("Too Many Requests", "Slow down! You're hitting the rate limit.",'toomanyReq');
      break;
    case 400:
      showToast.error("Validation Error", serverMessage || "Please check your input.", 'badRequest');
      break;
    case 500:
      showToast.error("Server Error", "Something went wrong on our end.",'InternalSerr');
      break;
    default:
      showToast.error("Error", serverMessage || fallbackMessage);
  }
};