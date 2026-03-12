import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Activity, X } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import './Layout.css';

const Sidebar = () => {
  const { setIsSidebarOpen } = useAppData();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/tests', icon: <FileText size={20} />, label: 'Test Reports' },
    { path: '/analytics', icon: <Activity size={20} />, label: 'Analytics' },
  ];

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-brand">
        <Activity className="brand-icon" size={28} />
        <h2>NeedyPath</h2>
        <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)}>
          <X size={20} />
        </button>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">DR</div>
          <div className="user-details">
            <span className="user-name">Dr. Sunny yadav</span>
            <span className="user-role">Lead Pathologist</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
