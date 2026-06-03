import { Route, Routes } from 'react-router-dom';

import CharacterDetail from './components/characterDetail/CharacterDetail';
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}>
        <Route index element={<CharacterDetail />} />
      </Route>
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
