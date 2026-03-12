import { useState, useRef, useEffect } from 'react';
import { Bell, Check, Sun, Moon, Menu } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import './Layout.css';

const Header = () => {
  const { 
    setIsNewReportModalOpen, 
    notifications,
    setNotifications,
    isNotificationDropdownOpen,
    setIsNotificationDropdownOpen,
    isSidebarOpen,
    setIsSidebarOpen,
    theme,
    toggleTheme
  } = useAppData();
  
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotificationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsNotificationDropdownOpen]);

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

        <div className="notification-wrapper" ref={dropdownRef}>
          <button className="icon-btn" onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}>
            <Bell size={20} />
            {unreadCount > 0 && <span className="notification-dot">{unreadCount}</span>}
          </button>
          
          {isNotificationDropdownOpen && (
            <div className="notification-dropdown glass-panel animate-fade-in">
              <div className="dropdown-header">
                <h3>Notifications</h3>
                {unreadCount > 0 && (
                  <button className="mark-read-btn" onClick={markAllAsRead}>
                    <Check size={14} /> Mark all as read
                  </button>
                )}
              </div>
              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div className="empty-notifications">No notifications</div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                      onClick={() => !notif.read && markAsRead(notif.id)}
                    >
                      <div className="notif-dot"></div>
                      <div className="notif-content">
                        <p>{notif.text}</p>
                        <span className="notif-time">{notif.time}</span>
                      </div>
                      {!notif.read && (
                        <button 
                          className="notif-action-btn" 
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notif.id);
                          }}
                          title="Mark as read"
                        >
                          <Check size={16} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        <button className={`primary-btn ${isNotificationDropdownOpen ? 'content-blur' : ''}`} onClick={() => setIsNewReportModalOpen(true)}>
          + New Report
        </button>
      </div>
    </header>
  );
};

export default Header;
