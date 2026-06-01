import { Route, Routes } from 'react-router-dom';

import CharacterDetail from './components/characterDetail/CharacterDetail';
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}>
        <Route path="/" element={<CharacterDetail />} />
      </Route>
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}

export default App;
