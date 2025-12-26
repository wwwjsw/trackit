import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layers, Heart } from 'lucide-react';
import './index.css';
import { Timeline } from './components/Timeline';
import { SourcesManager } from './components/SourcesManager';
import { useTrackItData } from './hooks/useTrackItData';

function Nav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? 'active-link' : '';

  return (
    <nav className="glass-panel" style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '400px',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '0.8rem',
      borderRadius: '20px',
      zIndex: 100,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
    }}>
      <Link to="/" className={`nav-item ${isActive('/')}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: 'var(--text-color)', opacity: location.pathname === '/' ? 1 : 0.6, transition: 'all 0.3s' }}>
        <Heart className="icon" size={24} fill={location.pathname === '/' ? '#f78166' : 'none'} color={location.pathname === '/' ? '#f78166' : 'currentColor'} />
        <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>Timeline</span>
      </Link>
      <Link to="/sources" className={`nav-item ${isActive('/sources')}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: 'var(--text-color)', opacity: location.pathname === '/sources' ? 1 : 0.6, transition: 'all 0.3s' }}>
        <Layers className="icon" size={24} color={location.pathname === '/sources' ? '#58a6ff' : 'currentColor'} />
        <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>Sources</span>
      </Link>
    </nav>
  );
}

function App() {
  const { sources, releases, addSource, removeSource, refreshAll, loadMore, loadingMore } = useTrackItData();

  return (
    <Router basename='/trackit'>
      <div style={{ paddingBottom: '100px', flex: 1 }}>
        <header style={{ 
          padding: '1.5rem', 
          position: 'sticky', 
          top: 0, 
          background: 'rgba(13, 17, 23, 0.8)', 
          backdropFilter: 'blur(10px)',
          zIndex: 10,
          borderBottom: '1px solid rgba(48, 54, 61, 0.3)'
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '1.8rem', 
            fontWeight: 800,
            letterSpacing: '-1px',
            background: 'linear-gradient(135deg, #58a6ff 0%, #f78166 100%)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            TrackIt
          </h1>
        </header>
        <Routes>
          <Route index element={<Timeline releases={releases} refresh={refreshAll} loadMore={loadMore} loadingMore={loadingMore} />} />
          <Route path="sources" element={<SourcesManager sources={sources} onAdd={addSource} onRemove={removeSource} />} />
        </Routes>
      </div>
      <Nav />
    </Router>
  );
}

export default App;
