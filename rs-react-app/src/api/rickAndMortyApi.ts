import type { ApiResponse } from '@/types/character';

const BASE_URL = 'https://rickandmortyapi.com/api';

export class ApiError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

const ERROR_MESSAGES: Record<number, string> = {
  404: 'No characters found for your search.',
  429: 'Too many requests — please wait a moment and try again.',
  500: 'The server is having issues. Please try again later.',
  503: 'Service unavailable. Please try again later.',
};

export async function fetchCharacters(
  name: string,
  page: number = 1
): Promise<ApiResponse> {
  const params = new URLSearchParams();
  if (name.trim()) params.set('name', name.trim());
  params.set('page', String(page));

  const url = `${BASE_URL}/character?${params.toString()}`;

  let response: Response;

  try {
    response = await fetch(url);
  } catch {
    throw new ApiError(0, 'Network error — check your internet connection.');
  }

  if (!response.ok) {
    const message =
      ERROR_MESSAGES[response.status] ??
      `Unexpected error (${response.status}). Please try again.`;
    throw new ApiError(response.status, message);
  }

  return response.json();
}
