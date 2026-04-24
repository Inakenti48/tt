import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Favorites } from './pages/Favorites';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
