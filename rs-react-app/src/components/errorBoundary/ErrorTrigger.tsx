import { useState } from 'react';

function ErrorTrigger() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('Test error triggered by user');
  }

  return (
    <button
      onClick={() => setShouldThrow(true)}
      style={{
        border: '1px solid rgba(239,68,68,0.4)',
        color: '#ef4444',
        background: 'rgba(239,68,68,0.05)',
      }}
      className="px-4 h-9 text-sm rounded-xl hover:opacity-80 transition-opacity"
    >
      <i className="ti ti-bug" style={{ fontSize: 15 }} aria-hidden="true" />{' '}
      Simulate error
    </button>
  );
}

export default ErrorTrigger;
