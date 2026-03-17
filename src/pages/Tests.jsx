import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Download, Filter, Eye, Edit3, Trash2 } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import PDFGenerator from '../components/PDFGenerator';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './SharedList.css';

const Tests = () => {
  const { tests, globalSearchQuery, setGlobalSearchQuery, addToast, deleteTest, updateTest } = useAppData();
  const [statusFilter, setStatusFilter] = useState('All');
  const [isExporting, setIsExporting] = useState(false);
  const navigate = useNavigate();
  const bulkExportRef = useRef();

  const filteredTests = tests.filter(t => {
    const matchesSearch = t.patient.toLowerCase().includes(globalSearchQuery.toLowerCase()) || 
                          t.id.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                          t.type.toLowerCase().includes(globalSearchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = async () => {
    if (filteredTests.length === 0) {
      addToast('No reports to export', 'error');
      return;
    }

    setIsExporting(true);
    addToast('Generating bulk report PDF...', 'info');

    try {
      const element = bulkExportRef.current;
      element.style.display = 'block';
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.setProperties({
        title: `Pathology_Summary_${new Date().toISOString().split('T')[0]}`,
        subject: 'Bulk Pathology Reports Summary',
        author: 'PathoPro'
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Open in new tab for preview
      const pdfBlob = pdf.output('bloburl', { filename: `Reports_Summary_${new Date().toISOString().split('T')[0]}.pdf` });
      window.open(pdfBlob, '_blank');
      
      element.style.display = 'none';
      addToast('Bulk report preview opened in new tab!', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      addToast('Export failed. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="list-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Test Reports</h1>
          <p>Access pathology test results and statuses.</p>
        </div>
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
          <button 
            className="icon-btn" 
            title="Export All to PDF" 
            onClick={handleExport}
            disabled={isExporting}
          >
            <Download size={18} />
          </button>
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
                    {t.status === 'Completed' ? (
                      <PDFGenerator test={t} addToast={addToast} />
                    ) : (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', opacity: 0.6 }}>N/A</span>
                    )}
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
          <span className="page-info">Showing {filteredTests.length > 0 ? 1 : 0} to {filteredTests.length} of {tests.length.toLocaleString()} tests</span>
          <div className="page-controls">
            <button className="page-btn" disabled>Prev</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">Next</button>
          </div>
        </div>
      </div>
      
      {/* Hidden Bulk Export Template */}
      <div 
        ref={bulkExportRef} 
        style={{ 
          display: 'none', 
          width: '800px', 
          padding: '40px', 
          background: 'white', 
          color: 'black',
          fontFamily: "'Inter', sans-serif"
        }}
      >
        <div style={{ borderBottom: '2px solid #0969da', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, color: '#0969da', fontSize: '24px' }}>PathoPro Reports Summary</h1>
            <p style={{ margin: '5px 0 0', color: '#666', fontSize: '14px' }}>Comprehensive list of filtered pathology reports</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '12px' }}>Date: {new Date().toLocaleDateString()}</p>
            <p style={{ margin: 0, fontSize: '12px' }}>Total Records: {filteredTests.length}</p>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee' }}>
              <th style={{ textAlign: 'left', padding: '12px 8px' }}>Test ID</th>
              <th style={{ textAlign: 'left', padding: '12px 8px' }}>Patient Name</th>
              <th style={{ textAlign: 'left', padding: '12px 8px' }}>Test Type</th>
              <th style={{ textAlign: 'left', padding: '12px 8px' }}>Date</th>
              <th style={{ textAlign: 'left', padding: '12px 8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '10px 8px', fontWeight: 'bold', color: '#0969da' }}>{t.id}</td>
                <td style={{ padding: '10px 8px' }}>{t.patient}</td>
                <td style={{ padding: '10px 8px' }}>{t.type}</td>
                <td style={{ padding: '10px 8px' }}>{t.date}</td>
                <td style={{ padding: '10px 8px' }}>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '10px', 
                    fontSize: '10px',
                    background: t.status === 'Completed' ? '#dafbe1' : t.status === 'Pending' ? '#fff8c5' : '#ddf4ff',
                    color: t.status === 'Completed' ? '#1a7f37' : t.status === 'Pending' ? '#9a6700' : '#0969da'
                  }}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'center', fontSize: '10px', color: '#999' }}>
          <p>This is an automatically generated summary report from PathoPro Pathology Management System.</p>
          <p>© {new Date().getFullYear()} PathoPro Labs. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Tests;
