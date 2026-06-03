import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-6 py-20">
      <h1 style={{ color: 'var(--accent)' }}>404</h1>
      <h2 style={{ color: 'var(--text-h)' }}>Page not found</h2>
      <p
        style={{ color: 'var(--text)' }}
        className="text-sm text-center max-w-sm"
      >
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        style={{
          background: 'var(--accent)',
          color: '#fff',
        }}
        className="px-6 h-10 flex items-center text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
      >
        Back to home
      </Link>
    </div>
  );
}

export default NotFoundPage;
