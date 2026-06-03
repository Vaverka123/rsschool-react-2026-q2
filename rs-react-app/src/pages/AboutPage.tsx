import { Link } from 'react-router-dom';
const AboutPage = () => {
  return (
    <div className="flex flex-col gap-8 px-6 py-8">
      <Link
        to="/"
        style={{ color: 'var(--accent)' }}
        className="p-4 border-2 border-accent rounded-2xl text-lg  hover:opacity-70 transition-opacity"
      >
        Home
      </Link>
      <div className="flex flex-col gap-2">
        <h1 style={{ color: 'var(--accent)' }}>About This App</h1>
        <p style={{ color: 'var(--text)' }} className="text-md">
          The application is built using React and TypeScript, utilizing the
          Rick and Morty API to fetch character data. It features a search
          functionality, pagination, and detailed character views. The app is
          designed with a responsive layout and styled using CSS variables for
          easy theming
          <span style={{ color: 'var(--green)' }}>
            {' '}
            by student Vera Maslava{' '}
          </span>
          as part of the
          <Link
            to="https://rs.school/courses/reactjs"
            style={{ color: 'var(--accent)' }}
            target="_blank"
          >
            {' '}
            RS School React course.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
