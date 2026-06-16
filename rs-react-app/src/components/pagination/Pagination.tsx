import type { PaginationProps } from '@/types/pagination';

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const visible = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2
  );

  const withEllipsis: (number | '...')[] = [];
  visible.forEach((p, i) => {
    if (i > 0 && p - (visible[i - 1] as number) > 1) {
      withEllipsis.push('...');
    }
    withEllipsis.push(p);
  });

  return (
    <nav
      aria-label="Pagination"
      onClick={(event) => event.stopPropagation()}
      className="flex items-center justify-center gap-1 flex-wrap py-4"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          border: '1px solid var(--border)',
          color: 'var(--text)',
          background: 'transparent',
        }}
        className="h-9 px-3 text-sm rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-70 transition-opacity cursor-pointer"
      >
        ←
      </button>

      {withEllipsis.map((p, i) =>
        p === '...' ? (
          <span
            key={`ellipsis-${i}`}
            style={{ color: 'var(--text)' }}
            className="px-2 text-sm"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={{
              border: '1px solid var(--border)',
              background: p === currentPage ? 'var(--accent)' : 'transparent',
              color: p === currentPage ? '#fff' : 'var(--text)',
            }}
            className="h-9 w-9 text-sm rounded-lg hover:opacity-70 transition-opacity cursor-pointer"
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          border: '1px solid var(--border)',
          color: 'var(--text)',
          background: 'transparent',
        }}
        className="h-9 px-3 text-sm rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-70 transition-opacity cursor-pointer"
      >
        →
      </button>
    </nav>
  );
}

export default Pagination;
