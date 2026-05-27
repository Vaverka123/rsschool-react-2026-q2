import type { SearchBarProps } from '../../types/searchBarProps';

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
    <div className="flex items-center max-w-md ">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 h-10 px-4 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:border-gray-500"
      />
      <button
        onClick={onSearch}
        className="h-10 px-4 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-700 transition-colors"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
