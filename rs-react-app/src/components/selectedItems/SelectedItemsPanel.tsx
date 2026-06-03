import { useClearCheckedItems, useCheckedItems } from '@/store/characterStore';

function downloadCsv(items: ReturnType<typeof useCheckedItems>) {
  const header = 'id,name,status,species,location';
  const rows = items.map(
    (c) =>
      `${c.id},"${c.name}",${c.status},${c.species},"${c.location.name}"`
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'selected-characters.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function SelectedItemsPanel() {
  const checkedItems = useCheckedItems();
  const clearCheckedItems = useClearCheckedItems();

  if (checkedItems.length === 0) return null;

  const count = checkedItems.length;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex items-center justify-center gap-6 px-6 py-4 z-50"
      style={{
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.12)',
      }}
    >
      <span style={{ color: 'var(--text-h)' }} className="text-sm font-medium">
        {count} item{count !== 1 ? 's' : ''} selected
      </span>
      <button
        onClick={clearCheckedItems}
        style={{
          color: 'var(--text)',
          border: '1px solid var(--border)',
        }}
        className="px-4 py-1.5 rounded-lg text-sm hover:opacity-70 transition-opacity cursor-pointer"
      >
        Unselect all
      </button>
      <button
        onClick={() => downloadCsv(checkedItems)}
        style={{
          color: 'var(--bg)',
          background: 'var(--accent)',
        }}
        className="px-4 py-1.5 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer"
      >
        Download
      </button>
    </div>
  );
}

export default SelectedItemsPanel;
