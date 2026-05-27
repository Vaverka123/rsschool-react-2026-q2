import { Link } from 'react-router-dom';
const AboutPage = () => {
  return (
    <>
      <Link to="/">Home</Link>
      <section id="about">
        <h2>About This App</h2>
        <p>
          This is a simple React application built with Vite. It demonstrates
          basic routing and component structure.
        </p>
        <p>
          You can find the source code for this app on{' '}
          <a href="https://github.com/your-username/react-vite-app">GitHub</a>.
        </p>
      </section>
    </>
  );
};

export default AboutPage;
