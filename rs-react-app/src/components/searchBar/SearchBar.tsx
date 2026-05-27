import type { SearchBarProps } from '@/types/searchBarProps';

const SearchBar = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
}: SearchBarProps) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-xl mx-auto">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={{
          border: '1px solid var(--accent-border)',
          background: 'var(--bg)',
          color: 'var(--text-h)',
        }}
        className="flex-1 h-11 px-4 text-sm rounded-xl focus:outline-none focus:ring-2"
      />
      <button
        onClick={onSearch}
        style={{
          background: 'var(--accent)',
          color: '#fff',
        }}
        className="h-11 px-6 text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
