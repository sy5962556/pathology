import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Activity, Clock, Search, CheckCircle, BarChart3 } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import './Dashboard.css';

const Dashboard = () => {
  const { tests, patients, setIsNewPatientModalOpen, setIsNewReportModalOpen } = useAppData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Total Reports', value: tests.length.toString(), icon: <BarChart3 />, trend: 'Actual', color: 'var(--accent-primary)' },
    { label: 'Completed', value: tests.filter(t => t.status === 'Completed').length.toString(), icon: <CheckCircle />, trend: 'Live', color: 'var(--accent-success)' },
    { label: 'In Progress', value: tests.filter(t => t.status === 'In Progress').length.toString(), icon: <Activity />, trend: 'Live', color: 'var(--accent-secondary)' },
    { label: 'Pending', value: tests.filter(t => t.status === 'Pending').length.toString(), icon: <Clock />, trend: 'Live', color: '#f78166' }
  ];

  const filteredTests = tests.filter(t => 
    t.patient.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentTests = filteredTests.slice(0, 5);

  return (
    <div className="dashboard animate-fade-in">
      <div className="dashboard-header">
        <h1>Overview</h1>
        <p>Welcome back, Dr. Smith. Here's what's happening today.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card glass-panel" style={{ '--card-color': stat.color }}>
            <div className="stat-icon-wrapper" style={{ color: stat.color, background: `color-mix(in srgb, ${stat.color} 15%, transparent)` }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
            <div className={`stat-trend ${stat.trend.startsWith('+') ? 'positive' : stat.trend.startsWith('-') ? 'negative' : 'neutral'}`}>
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid" style={{gridTemplateColumns: '1fr'}}>
        <div className="recent-activity glass-panel">
          <div className="panel-header">
            <h2>Recent Tests</h2>
            <div className="panel-search-bar">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search tests..." 
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="view-all-btn" onClick={() => navigate('/tests')}>View All</button>
          </div>
          <div className="table-scroll-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Test ID</th>
                  <th>Patient Name</th>
                  <th>Test Type</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTests.map(test => (
                  <tr key={test.id}>
                    <td>{test.id}</td>
                    <td>{test.patient}</td>
                    <td>{test.type}</td>
                    <td>{test.date}</td>
                    <td>
                      <span className={`status-badge ${test.status.toLowerCase().replace(' ', '-')}`}>
                        {test.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
