import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SiteLayout from './components/SiteLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import WorkPage from './pages/WorkPage.jsx';
import WorkCollectionPlaceholder from './pages/WorkCollectionPlaceholder.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import ThanksPage from './pages/ThanksPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/:slug" element={<WorkCollectionPlaceholder />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/thanks" element={<ThanksPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
