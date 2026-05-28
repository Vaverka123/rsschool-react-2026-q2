type Character = {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  image: string;
  location: {
    name: string;
  };
};

type ApiResponse = {
  results: Character[];
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
};

type CharacterCardProps = {
  character: Character;
};

export type { ApiResponse, Character, CharacterCardProps };
