const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

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
      throw new Error(errorData.message || 'API Request Failed');
    }

    const text = await response.text();
    return { ok: true, data: text ? JSON.parse(text) : null };

  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
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
    console.log(response)
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Stream Request Failed');
  }

  return response; 
};