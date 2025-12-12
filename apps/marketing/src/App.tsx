import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/index';
import PricingPage from './pages/pricing';
import ServicesPage from './pages/services';
import PortfolioPage from './pages/portfolio';
import AboutPage from './pages/about';
import ContactPage from './pages/contact';
import EstimatePage from './pages/estimate';

function App() {
  const location = useLocation();
  const isEstimatePage = location.pathname === '/estimate';

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location]);

  // Estimate page has its own layout
  if (isEstimatePage) {
    return <EstimatePage />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServicesPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
