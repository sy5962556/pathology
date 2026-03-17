import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import GlobalModals from './GlobalModals';
import ToastContainer from './Toast';
import { useAppData } from '../context/AppDataContext';
import './Layout.css';

const Layout = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useAppData();
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className={`layout-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}
      
      <div style={{ display: 'contents' }}>
        <Sidebar />
      </div>
      <div className="main-wrapper">
        <Header />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <GlobalModals />
      <ToastContainer />
    </div>
  );
};

export default Layout;
