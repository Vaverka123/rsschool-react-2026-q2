import { useSearchParams } from 'react-router-dom';

import useCharacterDetail from '@/hooks/useCharacterDetail';

import { RefreshIcon } from '@/assets/refreshIcon';

function CharacterDetail() {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = Number(searchParams.get('details')) || null;

  const { character, loading, error, handleRefresh } = useCharacterDetail(id);

  const handleClose = () => {
    setSearchParams((prev) => {
      prev.delete('details');
      return prev;
    });
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
          aria-label="Close"
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
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            style={{ color: 'var(--text)', border: '1px solid var(--border)' }}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:opacity-70 transition-opacity cursor-pointer"
            aria-label="Refresh details"
          >
            <RefreshIcon size={14} />
          </button>
          <button
            onClick={handleClose}
            style={{ color: 'var(--text)', border: '1px solid var(--border)' }}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:opacity-70 transition-opacity cursor-pointer"
            aria-label="Close details"
          >
            ×
          </button>
        </div>
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
