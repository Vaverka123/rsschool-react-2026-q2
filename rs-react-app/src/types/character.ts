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
  };
};

export type { ApiResponse, Character };
