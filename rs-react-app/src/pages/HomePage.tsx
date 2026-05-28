import ErrorTrigger from '@/components/errorBoundary/ErrorTrigger';
import Pagination from '@/components/pagination/Pagination';
import SearchBar from '@/components/searchBar/SearchBar';
import SearchResults from '@/components/searchResults/SearchResults';

import useSearch from '@/hooks/useSearch';

function HomePage() {
  const {
    query,
    setQuery,
    results,
    totalPages,
    currentPage,
    loading,
    error,
    handleSearch,
    handlePageChange,
  } = useSearch();

  return (
    <div className="flex flex-col gap-8 px-6 py-8">
      <div className="flex flex-col gap-2">
        <h1 style={{ color: 'var(--accent)' }}>Rick & Morty</h1>
        <p style={{ color: 'var(--text)' }} className="text-sm">
          Search across{' '}
          <span style={{ color: 'var(--green)' }}>826 characters</span>
        </p>
      </div>

      <div className="flex items-center gap-4">
        <SearchBar value={query} onChange={setQuery} onSearch={handleSearch} />
        <ErrorTrigger />
      </div>

      <SearchResults results={results} loading={loading} error={error} />

      {!loading && !error && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default HomePage;
