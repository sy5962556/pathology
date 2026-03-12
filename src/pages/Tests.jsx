import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Download, Filter, Eye, Edit3, Trash2 } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import PDFGenerator from '../components/PDFGenerator';
import './SharedList.css';

const Tests = () => {
  const { tests, globalSearchQuery, setGlobalSearchQuery, addToast, updateTest } = useAppData();
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  // Removed click outside listener as we don't use the dropdown anymore

  const filteredTests = tests.filter(t => {
    const matchesSearch = t.patient.toLowerCase().includes(globalSearchQuery.toLowerCase()) || 
                          t.id.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                          t.type.toLowerCase().includes(globalSearchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="list-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Test Reports</h1>
          <p>Access pathology test results and statuses.</p>
        </div>
        <button className="primary-btn" onClick={() => setIsNewReportModalOpen(true)}>
          <Plus size={18} /> New Test
        </button>
      </div>

      <div className="list-content glass-panel">
        <div className="list-toolbar">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search tests by ID, patient, or type..." 
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
              style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '20px', outline: 'none', fontFamily: 'inherit', fontSize: '0.9rem', width: '160px' }}
            >
              <option value="All" style={{ background: 'var(--bg-color)' }}>All Statuses</option>
              <option value="Completed" style={{ background: 'var(--bg-color)' }}>Completed</option>
              <option value="Pending" style={{ background: 'var(--bg-color)' }}>Pending</option>
              <option value="In Progress" style={{ background: 'var(--bg-color)' }}>In Progress</option>
            </select>
          </div>
          <button className="icon-btn" title="Export"><Download size={18} /></button>
        </div>

        <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Test ID</th>
              <th>Patient</th>
              <th>Test Type</th>
              <th>Referred By</th>
              <th>Date</th>
              <th>Status</th>
              <th>Download</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.map(t => (
               <tr key={t.id}>
                 <td className="fw-600 color-accent">{t.id}</td>
                 <td>{t.patient}</td>
                 <td>{t.type}</td>
                 <td>{t.doctor}</td>
                 <td>{t.date}</td>
                 <td>
                   <span className={`status-badge ${t.status.toLowerCase().replace(' ', '-')}`}>
                     {t.status}
                   </span>
                 </td>
                  <td data-pdf-id={t.id}>
                    <PDFGenerator test={t} addToast={addToast} />
                  </td>
                  <td>
                    <div className="action-buttons-group">
                      <button 
                        className="action-btn-sm view" 
                        title="View Report"
                        onClick={() => navigate(`/report/${t.id}`)}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="action-btn-sm edit" 
                        title="Edit Report"
                        onClick={() => navigate(`/edit-report/${t.id}`)}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        className="action-btn-sm delete" 
                        title="Delete Report"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete report ${t.id}?`)) {
                            deleteTest(t.id);
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
          <span className="page-info">Showing {filteredTests.length > 0 ? 1 : 0} to {filteredTests.length} of {(8486 + tests.length).toLocaleString()} tests</span>
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

export default Tests;
