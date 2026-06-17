import { useState } from 'react';

import Modal from '@/components/modal/Modal';

import SearchFormRHF from './SearchFormRHF';
import SearchFormUncontrolled from './SearchFormUncontrolled';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onSearch: (query: string) => void;
}

type Tab = 'uncontrolled' | 'rhf';

function SearchModal({
  isOpen,
  onClose,
  initialQuery = '',
  onSearch,
}: SearchModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('uncontrolled');

  const handleSearch = (query: string) => {
    onSearch(query);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Search Characters">
      {/* Tab switcher */}
      <div
        className="flex rounded-xl overflow-hidden"
        style={{ border: '1px solid var(--border)' }}
        role="tablist"
        aria-label="Form implementation"
      >
        {(['uncontrolled', 'rhf'] as Tab[]).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? 'var(--accent)' : 'var(--bg)',
              color: activeTab === tab ? '#fff' : 'var(--text)',
            }}
            className="flex-1 h-9 text-xs font-medium transition-colors"
          >
            {tab === 'uncontrolled' ? 'Uncontrolled' : 'React Hook Form'}
          </button>
        ))}
      </div>

      {/* Active form */}
      {activeTab === 'uncontrolled' ? (
        <SearchFormUncontrolled
          initialQuery={initialQuery}
          onSearch={handleSearch}
        />
      ) : (
        <SearchFormRHF initialQuery={initialQuery} onSearch={handleSearch} />
      )}
    </Modal>
  );
}

export default SearchModal;
