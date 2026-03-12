import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import GlobalModals from './GlobalModals';
import ToastContainer from './Toast';
import { useAppData } from '../context/AppDataContext';
import './Layout.css';

const Layout = () => {
  const { isNotificationDropdownOpen, theme } = useAppData();

  return (
    <div className="layout-container">
      <div className={isNotificationDropdownOpen ? 'content-blur' : ''} style={{ display: 'contents' }}>
        <Sidebar />
      </div>
      <div className="main-wrapper">
        <Header />
        <main className={`main-content ${isNotificationDropdownOpen ? 'content-blur' : ''}`}>
          <Outlet />
        </main>
      </div>
      <GlobalModals />
      <ToastContainer />
    </div>
  );
};

export default Layout;
