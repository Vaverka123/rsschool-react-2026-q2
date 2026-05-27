import { useState } from 'react';
import { Link } from 'react-router-dom';

import SearchBar from '../components/searchBar/SearchBar';
import useLocalStorage from '../hooks/useLocalStorage';

interface Result {
  id: number;
  title: string;
  description: string;
}

function HomePage() {
  const [query, setQuery] = useLocalStorage('searchQuery', '');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);

    // replace this with your real API call
    await new Promise((r) => setTimeout(r, 500));
    setResults([
      { id: 1, title: 'Result one', description: 'Some description here' },
      { id: 2, title: 'Result two', description: 'Another description here' },
    ]);

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/about">About</Link>
      <SearchBar value={query} onChange={setQuery} onSearch={handleSearch} />
      <div className="mt-6">
        {loading && <p className="text-sm text-gray-500">Searching...</p>}

        {!loading && searched && results.length === 0 && (
          <p className="text-sm text-gray-500">
            No results found for "{query}"
          </p>
        )}

        {!loading && results.length > 0 && (
          <ul className="flex flex-col gap-3">
            {results.map((result) => (
              <li
                key={result.id}
                className="p-4 border border-gray-200 rounded-md hover:border-gray-400 transition-colors"
              >
                <h3 className="font-medium text-gray-900">{result.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {result.description}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default HomePage;
