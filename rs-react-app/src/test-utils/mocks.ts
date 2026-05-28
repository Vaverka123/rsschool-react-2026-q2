import type { Character } from '@/types/character';

export const mockCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  location: { name: 'Citadel of Ricks' },
};

export const mockCharacters: Character[] = [
  mockCharacter,
  {
    id: 2,
    name: 'Morty Smith',
    status: 'Alive',
    species: 'Human',
    image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
    location: { name: 'Earth (C-137)' },
  },
  {
    id: 3,
    name: 'Summer Smith',
    status: 'Alive',
    species: 'Human',
    image: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg',
    location: { name: 'Earth (Replacement Dimension)' },
  },
];

export const mockApiResponse = {
  results: mockCharacters,
  info: { count: 3, pages: 1, next: null, prev: null },
};
