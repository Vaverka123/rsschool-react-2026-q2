import { useEffect, useState } from 'react';

import type { CharacterDetail } from '@/types/character';

import { ApiError, fetchCharacter } from '@/api/rickAndMortyApi';

function useCharacterDetail(id: number | null) {
  const [character, setCharacter] = useState<CharacterDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      // Avoid synchronous setState inside effect to prevent cascading renders
      const t = setTimeout(() => setCharacter(null), 0);
      return () => clearTimeout(t);
    }

    let isActive = true;

    Promise.resolve().then(() => {
      if (!isActive) return;
      setLoading(true);
      setError(null);
    });

    fetchCharacter(id)
      .then((result) => {
        if (isActive) {
          setCharacter(result);
        }
      })
      .catch((err) => {
        if (!isActive) return;

        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Something went wrong.');
        }
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [id]);

  return { character, loading, error };
}

export default useCharacterDetail;
