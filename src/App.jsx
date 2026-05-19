import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SiteLayout from './components/SiteLayout.jsx';

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const WorkPage = lazy(() => import('./pages/WorkPage.jsx'));
const WorkCollectionPlaceholder = lazy(() => import('./pages/WorkCollectionPlaceholder.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const ThanksPage = lazy(() => import('./pages/ThanksPage.jsx'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
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
      </Suspense>
    </BrowserRouter>
  );
}
