import { useRef, useState } from 'react';

interface SearchFormUncontrolledProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
}

function SearchFormUncontrolled({
  initialQuery = '',
  onSearch,
}: SearchFormUncontrolledProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = inputRef.current?.value.trim() ?? '';

    if (value.length > 0 && value.length < 2) {
      setError('Query must be at least 2 characters.');
      return;
    }
    if (value.length > 50) {
      setError('Query must be 50 characters or less.');
      return;
    }

    setError(null);
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p
        style={{ color: 'var(--text)' }}
        className="text-xs mb-3 uppercase tracking-wide font-medium"
      >
        Uncontrolled
      </p>
      <div className="flex flex-col gap-1 mb-4">
        <label
          htmlFor="uncontrolled-query"
          style={{ color: 'var(--text)' }}
          className="text-sm"
        >
          Character name
        </label>
        <input
          ref={inputRef}
          id="uncontrolled-query"
          type="text"
          defaultValue={initialQuery}
          placeholder="e.g. Rick"
          maxLength={50}
          style={{
            border: `1px solid ${error ? '#ef4444' : 'var(--accent-border)'}`,
            background: 'var(--bg)',
            color: 'var(--text-h)',
          }}
          className="h-10 px-3 text-sm rounded-xl focus:outline-none focus:ring-2"
        />
        {error && (
          <p role="alert" style={{ color: '#ef4444' }} className="text-xs mt-1">
            {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        style={{ background: 'var(--accent)', color: '#fff' }}
        className="w-full h-10 text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
      >
        Search
      </button>
    </form>
  );
}

export default SearchFormUncontrolled;
