import { useNavigate } from 'react-router-dom';
import { Users, FileText, Activity, Clock } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import './Dashboard.css';

const Dashboard = () => {
  const { tests, patients, setIsNewPatientModalOpen, setIsNewReportModalOpen, globalSearchQuery } = useAppData();
  const navigate = useNavigate();

  const basePatients = 1278; 
  const basePending = 35;
  const baseCompleted = 449;

  const stats = [
    { label: 'Total Patients', value: (basePatients + patients.length).toLocaleString(), icon: <Users />, trend: '+12%', color: 'var(--accent-primary)' },
    { label: 'Pending Reports', value: basePending + tests.filter(t => t.status !== 'Completed').length, icon: <Clock />, trend: '-5%', color: 'var(--accent-secondary)' },
    { label: 'Completed Tests', value: baseCompleted + tests.filter(t => t.status === 'Completed').length, icon: <FileText />, trend: '+8%', color: 'var(--accent-success)' },
    { label: 'Active Facilities', value: '3', icon: <Activity />, trend: '0%', color: '#a371f7' }
  ];

  const filteredTests = tests.filter(t => 
    t.patient.toLowerCase().includes(globalSearchQuery.toLowerCase()) || 
    t.id.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    t.type.toLowerCase().includes(globalSearchQuery.toLowerCase())
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

      <div className="dashboard-grid">
        <div className="recent-activity glass-panel" style={{gridColumn: '1 / span 2'}}>
          <div className="panel-header">
            <h2>Recent Tests</h2>
            <button className="view-all-btn">View All</button>
          </div>
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
        
        <div className="quick-actions glass-panel">
          <div className="panel-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="actions-list">
             <button className="action-btn" onClick={() => setIsNewReportModalOpen(true)}>Log Sample / New Report</button>
             <button className="action-btn" onClick={() => navigate('/analytics')}>Generate Analytics</button>
             <button className="action-btn" onClick={() => alert('Printing integration required.')}>Print Labels</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
