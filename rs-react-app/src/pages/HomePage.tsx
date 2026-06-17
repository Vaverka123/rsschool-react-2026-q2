import { useState } from 'react';
import { Link, Outlet, useSearchParams } from 'react-router-dom';

import ErrorTrigger from '@/components/errorBoundary/ErrorTrigger';
import Pagination from '@/components/pagination/Pagination';
import SearchBar from '@/components/searchBar/SearchBar';
import SearchModal from '@/components/searchForm/SearchModal';
import SearchResults from '@/components/searchResults/SearchResults';
import SelectedItemsPanel from '@/components/selectedItems/SelectedItemsPanel';
import ThemeToggle from '@/components/themeToggle/ThemeToggle';

import useSearch from '@/hooks/useSearch';

import { useCheckedItems } from '@/store/characterStore';

import { RefreshIcon } from '@/assets/refreshIcon';

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
    handleRefresh,
  } = useSearch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const checkedItems = useCheckedItems();
  const hasDetails = searchParams.has('details');
  const hasFlyout = checkedItems.length > 0;

  const handleMainClick = () => {
    if (!hasDetails) return;
    setSearchParams((prev) => {
      prev.delete('details');
      return prev;
    });
  };

  return (
    <div
      className={`flex flex-col gap-8 px-6 py-8 ${hasFlyout ? 'pb-24' : ''}`}
    >
      <div className="flex items-center justify-between">
        <Link
          to="/about"
          style={{ color: 'var(--accent)' }}
          className="p-4 border-2 border-accent rounded-2xl text-lg hover:opacity-70 transition-opacity"
        >
          About
        </Link>
        <ThemeToggle />
      </div>
      <div className="flex flex-col gap-2">
        <h1 style={{ color: 'var(--accent)' }}>Rick & Morty</h1>
        <p style={{ color: 'var(--text)' }} className="text-sm">
          Search across{' '}
          <span style={{ color: 'var(--green)' }}>826 characters</span>
        </p>
      </div>
      <div className="flex items-center gap-4">
        <SearchBar value={query} onChange={setQuery} onSearch={handleSearch} />
        <button
          onClick={() => setIsModalOpen(true)}
          style={{ color: 'var(--text)', border: '1px solid var(--border)' }}
          className="flex items-center justify-center h-10 px-4 rounded-xl hover:opacity-70 transition-opacity cursor-pointer shrink-0 text-sm"
          aria-label="Open advanced search"
        >
          Advanced
        </button>
        <button
          onClick={handleRefresh}
          style={{ color: 'var(--text)', border: '1px solid var(--border)' }}
          className="flex items-center justify-center w-10 h-10 rounded-xl hover:opacity-70 transition-opacity cursor-pointer shrink-0"
          aria-label="Refresh results"
          title="Refresh"
        >
          <RefreshIcon />
        </button>
        <ErrorTrigger />
      </div>

      <SearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialQuery={query}
        onSearch={(q) => {
          setQuery(q);
          handleSearch();
        }}
      />
      <div
        className={`grid gap-6 ${hasDetails ? 'grid-cols-[1fr_360px]' : 'grid-cols-1'}`}
      >
        <div onClick={handleMainClick}>
          <SearchResults results={results} loading={loading} error={error} />
          {!loading && !error && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        {hasDetails && (
          <div className="sticky top-4 self-start">
            <Outlet />
          </div>
        )}
      </div>

      <SelectedItemsPanel />
    </div>
  );
}

export default HomePage;
