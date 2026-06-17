import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { type SearchFormValues, searchSchema } from './searchSchema';

interface SearchFormRHFProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
}

function SearchFormRHF({ initialQuery = '', onSearch }: SearchFormRHFProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: initialQuery },
  });

  const onSubmit = ({ query }: SearchFormValues) => {
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <p
        style={{ color: 'var(--text)' }}
        className="text-xs mb-3 uppercase tracking-wide font-medium"
      >
        React Hook Form + Zod
      </p>
      <div className="flex flex-col gap-1 mb-4">
        <label
          htmlFor="rhf-query"
          style={{ color: 'var(--text)' }}
          className="text-sm"
        >
          Character name
        </label>
        <input
          {...register('query')}
          id="rhf-query"
          type="text"
          placeholder="e.g. Rick"
          style={{
            border: `1px solid ${errors.query ? '#ef4444' : 'var(--accent-border)'}`,
            background: 'var(--bg)',
            color: 'var(--text-h)',
          }}
          className="h-10 px-3 text-sm rounded-xl focus:outline-none focus:ring-2"
          aria-invalid={!!errors.query}
          aria-describedby={errors.query ? 'rhf-query-error' : undefined}
        />
        {errors.query && (
          <p
            id="rhf-query-error"
            role="alert"
            style={{ color: '#ef4444' }}
            className="text-xs mt-1"
          >
            {errors.query.message}
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

export default SearchFormRHF;
