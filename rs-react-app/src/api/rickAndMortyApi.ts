import type { ApiResponse } from '../types/character';

const BASE_URL = 'https://rickandmortyapi.com/api';

export async function fetchCharacters(name: string): Promise<ApiResponse> {
  const url = name.trim()
    ? `${BASE_URL}/character?name=${encodeURIComponent(name)}`
    : `${BASE_URL}/character`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('No characters found');
  }

  return response.json();
}
