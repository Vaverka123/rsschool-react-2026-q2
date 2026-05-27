function SkeletonCard() {
  return (
    <li
      style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}
      className="flex flex-col rounded-2xl overflow-hidden animate-pulse"
    >
      <div className="p-3 pb-0">
        <div
          style={{ background: 'var(--border)' }}
          className="w-full aspect-square rounded-xl"
        />
      </div>
      <div className="flex flex-col gap-2 px-4 py-3">
        <div
          style={{ background: 'var(--border)' }}
          className="h-4 w-3/4 rounded-md"
        />
        <div className="flex items-center gap-2">
          <div
            style={{ background: 'var(--border)' }}
            className="w-2 h-2 rounded-full shrink-0"
          />
          <div
            style={{ background: 'var(--border)' }}
            className="h-3 w-1/2 rounded-md"
          />
        </div>
        <div
          style={{ background: 'var(--border)' }}
          className="h-3 w-2/3 rounded-md"
        />
      </div>
    </li>
  );
}

export default SkeletonCard;
