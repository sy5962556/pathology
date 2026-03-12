import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, Eye, Edit3, Trash2 } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import './SharedList.css';

const Patients = () => {
  const { patients, setIsNewPatientModalOpen, globalSearchQuery, setGlobalSearchQuery, addToast } = useAppData();
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  // No more dropdown side effects needed

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) || 
                          p.id.toLowerCase().includes(globalSearchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="list-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Patient Directory</h1>
          <p>Manage and view all registered patients.</p>
        </div>
        <button className="primary-btn" onClick={() => setIsNewPatientModalOpen(true)}>
          <Plus size={18} /> Add Patient
        </button>
      </div>

      <div className="list-content glass-panel">
        <div className="list-toolbar">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search patients by name or ID..." 
              className="search-input" 
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex-align">
            <Filter size={18} style={{ color: 'var(--text-secondary)' }} />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '20px', outline: 'none', fontFamily: 'inherit', fontSize: '0.9rem', width: '150px' }}
            >
              <option value="All" style={{ background: 'var(--bg-color)' }}>All Statuses</option>
              <option value="Active" style={{ background: 'var(--bg-color)' }}>Active</option>
              <option value="Inactive" style={{ background: 'var(--bg-color)' }}>Inactive</option>
              <option value="New" style={{ background: 'var(--bg-color)' }}>New</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Age/Gender</th>
                <th>Last Visit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
          <tbody>
            {filteredPatients.map(p => (
              <tr key={p.id}>
                <td className="fw-600">{p.id}</td>
                <td>
                   <div className="flex-align">
                      <div className="avatar sm">{p.name.charAt(0)}</div>
                      {p.name}
                   </div>
                </td>
                <td>{p.age} / {p.gender.charAt(0)}</td>
                <td>{p.lastVisit}</td>
                <td>
                  <span className={`status-badge ${p.status.toLowerCase()}`}>
                    {p.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons-group">
                    <button 
                      className="action-btn-sm view" 
                      title="View Details"
                      onClick={() => addToast(`Viewing details for ${p.name}`, 'info')}
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="action-btn-sm edit" 
                      title="Edit Patient"
                      onClick={() => addToast(`Editing ${p.name}`, 'info')}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      className="action-btn-sm delete" 
                      title="Delete Patient"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete patient ${p.name}?`)) {
                          addToast(`Deleted ${p.name}`, 'error');
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        
        <div className="pagination">
          <span className="page-info">Showing {filteredPatients.length > 0 ? 1 : 0} to {filteredPatients.length} of {(1278 + patients.length).toLocaleString()} patients</span>
          <div className="page-controls">
            <button className="page-btn" disabled>Prev</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients;
