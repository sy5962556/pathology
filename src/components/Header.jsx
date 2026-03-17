import { Sun, Moon, Menu } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import './Layout.css';

const Header = () => {
  const { 
    setIsNewReportModalOpen, 
    isSidebarOpen,
    setIsSidebarOpen,
    theme,
    toggleTheme
  } = useAppData();
  
  return (
    <header className="header glass-panel">
      <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
        <Menu size={24} />
      </button>
      <div></div>
      <div className="header-actions">
        <button className="icon-btn theme-toggle" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
                
        <button className="primary-btn" onClick={() => setIsNewReportModalOpen(true)}>
          + New Report
        </button>
      </div>
    </header>
  );
};

export default Header;
