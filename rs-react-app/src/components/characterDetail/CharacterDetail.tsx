import { useNavigate, useSearchParams } from 'react-router-dom';

import useCharacterDetail from '@/hooks/useCharacterDetail';

function CharacterDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const detailsId = searchParams.get('details');
  const id = detailsId ? Number(detailsId) : null;

  const { character, loading, error } = useCharacterDetail(id);

  const handleClose = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('details');
    navigate(`?${params.toString()}`);
  };

  if (loading) {
    return (
      <div
        style={{
          borderLeft: '1px solid var(--border)',
          background: 'var(--bg)',
        }}
        className="flex items-center justify-center w-full h-full min-h-64 p-6"
      >
        <div
          style={{ borderColor: 'var(--accent)' }}
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          borderLeft: '1px solid var(--border)',
          background: 'var(--bg)',
        }}
        className="flex flex-col items-center justify-center gap-3 p-6"
      >
        <p style={{ color: '#ef4444' }} className="text-sm">
          {error}
        </p>
        <button
          onClick={handleClose}
          style={{ color: 'var(--accent)' }}
          className="text-sm"
        >
          Close
        </button>
      </div>
    );
  }

  if (!character) return null;

  return (
    <div
      style={{ borderLeft: '1px solid var(--border)', background: 'var(--bg)' }}
      className="flex flex-col"
    >
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <h2 style={{ color: 'var(--text-h)' }}>{character.name}</h2>
        <button
          onClick={handleClose}
          style={{ color: 'var(--text)', border: '1px solid var(--border)' }}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:opacity-70 transition-opacity cursor-pointer"
          aria-label="Close details"
        >
          ×
        </button>
      </div>

      <img
        src={character.image}
        alt={character.name}
        className="w-full object-cover"
      />

      <div className="flex flex-col gap-3 p-4">
        {[
          { label: 'Status', value: character.status },
          { label: 'Species', value: character.species },
          { label: 'Gender', value: character.gender },
          { label: 'Type', value: character.type || 'Unknown' },
          { label: 'Origin', value: character.origin.name },
          { label: 'Location', value: character.location.name },
          { label: 'Episodes', value: String(character.episode.length) },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex justify-between items-center"
            style={{
              borderBottom: '1px solid var(--border)',
              paddingBottom: 8,
            }}
          >
            <span style={{ color: 'var(--text)' }} className="text-sm">
              {label}
            </span>
            <span
              style={{ color: 'var(--text-h)' }}
              className="text-sm font-medium"
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CharacterDetail;
