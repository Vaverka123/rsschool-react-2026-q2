import {
  useCheckedIds,
  useClearCheckedIds,
} from '@/store/characterStore';

function SelectedItemsPanel() {
  const checkedIds = useCheckedIds();
  const clearCheckedIds = useClearCheckedIds();

  if (checkedIds.length === 0) return null;

  const count = checkedIds.length;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 rounded-2xl shadow-lg z-50"
      style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      <span style={{ color: 'var(--text-h)' }} className="text-sm font-medium">
        {count} item{count !== 1 ? 's' : ''} selected
      </span>
      <button
        onClick={clearCheckedIds}
        style={{
          color: 'var(--accent)',
          border: '1px solid var(--accent)',
        }}
        className="px-3 py-1 rounded-lg text-sm hover:opacity-70 transition-opacity cursor-pointer"
      >
        Deselect all
      </button>
    </div>
  );
}

export default SelectedItemsPanel;
