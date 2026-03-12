import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import PDFGenerator from '../components/PDFGenerator';
import './EditReport.css';

const EditReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tests, updateTest, addToast } = useAppData();
  const [test, setTest] = useState(null);
  const pdfRef = useRef();

  useEffect(() => {
    const foundTest = tests.find(t => t.id === id);
    if (foundTest) {
      setTest(JSON.parse(JSON.stringify(foundTest)));
    } else {
      addToast('Report not found', 'error');
      navigate('/tests');
    }
  }, [id, tests, navigate, addToast]);

  if (!test) return (
    <div className="loading-container">
      <div className="loader"></div>
      <p>Loading report data...</p>
    </div>
  );

  const handlePatientChange = (field, value) => {
    setTest(prev => ({ ...prev, [field]: value }));
  };

  const handleResultChange = (index, field, value) => {
    const newResults = [...test.results];
    newResults[index][field] = value;
    
    // Auto-calculate status for common types if value changes
    if (field === 'result') {
      const resultVal = parseFloat(value);
      const refRange = (newResults[index].reference || '').split('-').map(v => parseFloat(v));
      if (!isNaN(resultVal) && refRange.length === 2) {
        if (resultVal < refRange[0]) newResults[index].status = 'Low';
        else if (resultVal > refRange[1]) newResults[index].status = 'High';
        else newResults[index].status = 'Normal';
      }
    }
    
    setTest(prev => ({ ...prev, results: newResults }));
  };

  const addResultRow = () => {
    setTest(prev => ({
      ...prev,
      results: [
        ...prev.results,
        { category: 'OTHER', investigation: '', result: '', reference: '', unit: '', status: 'Normal' }
      ]
    }));
  };

  const removeResultRow = (index) => {
    setTest(prev => ({
      ...prev,
      results: prev.results.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTest(test.id, test);
    
    // Workflow enhancement: Ask for PDF generation
    setTimeout(() => {
      if (window.confirm('Report saved successfully. Would you like to generate the PDF report now?')) {
        // Find the PDF download button and click it
        const pdfBtn = document.querySelector('.edit-report-page .pdf-trigger button');
        if (pdfBtn) pdfBtn.click();
      } else {
        navigate('/tests');
      }
    }, 100);
  };

  return (
    <div className="edit-report-page animate-fade-in">
      <div className="page-header">
        <div className="header-left">
          <button className="icon-btn-text" onClick={() => navigate('/tests')}>
            <ArrowLeft size={20} /> Back to Reports
          </button>
          <h1>Edit Report <span className="report-id">{test.id}</span></h1>
        </div>
        <div className="header-right">
          <div className="pdf-trigger" style={{ display: 'none' }}>
             <PDFGenerator test={test} addToast={addToast} />
          </div>
          <button type="button" className="secondary-btn" onClick={() => navigate('/tests')}>
            Cancel
          </button>
          <button type="submit" form="edit-report-form" className="primary-btn">
            <Save size={18} /> Save Changes
          </button>
        </div>
      </div>

      <div className="edit-container glass-panel">
        <form id="edit-report-form" onSubmit={handleSubmit} className="edit-report-form">
          <div className="form-section">
            <div className="section-title-wrapper">
              <div className="title-icon">👤</div>
              <h3>Patient Information</h3>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Patient Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={test.patient} 
                  onChange={(e) => handlePatientChange('patient', e.target.value)}
                  placeholder="Full Name"
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={test.age || ''} 
                  onChange={(e) => handlePatientChange('age', e.target.value)}
                  placeholder="e.g. 21 Years"
                />
              </div>
              <div className="form-group">
                <label>Sex</label>
                <select 
                  className="form-select" 
                  value={test.sex || 'Male'} 
                  onChange={(e) => handlePatientChange('sex', e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Referring Doctor</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={test.doctor || ''} 
                  onChange={(e) => handlePatientChange('doctor', e.target.value)}
                  placeholder="Dr. Name"
                />
              </div>
              <div className="form-group">
                <label>Collected Date</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={test.date || ''} 
                  onChange={(e) => handlePatientChange('date', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Test Type</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={test.type} 
                  onChange={(e) => handlePatientChange('type', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select 
                  className="form-select" 
                  value={test.status} 
                  onChange={(e) => handlePatientChange('status', e.target.value)}
                >
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <div className="section-title-wrapper">
                <div className="title-icon">📊</div>
                <h3>Investigation Results</h3>
              </div>
              <button type="button" className="action-btn-sm view" onClick={addResultRow} style={{ width: 'auto', padding: '0 12px' }}>
                <Plus size={14} /> Add Investigation
              </button>
            </div>
            
            <div className="results-edit-table-container">
              <table className="results-edit-table">
                <thead>
                  <tr>
                    <th width="35%">Investigation</th>
                    <th width="15%">Result</th>
                    <th width="20%">Reference Range</th>
                    <th width="10%">Unit</th>
                    <th width="15%">Status</th>
                    <th width="5%"></th>
                  </tr>
                </thead>
                <tbody>
                  {test.results.map((res, idx) => (
                    <tr key={idx}>
                      <td>
                        <input 
                          type="text" 
                          className="cell-input" 
                          value={res.investigation} 
                          onChange={(e) => handleResultChange(idx, 'investigation', e.target.value)} 
                          placeholder="e.g. Hemoglobin"
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="cell-input fw-600" 
                          value={res.result} 
                          onChange={(e) => handleResultChange(idx, 'result', e.target.value)} 
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="cell-input" 
                          value={res.reference} 
                          onChange={(e) => handleResultChange(idx, 'reference', e.target.value)} 
                          placeholder="e.g. 13.0-17.0"
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="cell-input" 
                          value={res.unit} 
                          onChange={(e) => handleResultChange(idx, 'unit', e.target.value)} 
                          placeholder="e.g. g/dL"
                        />
                      </td>
                      <td>
                        <select 
                          className="cell-select" 
                          value={res.status} 
                          onChange={(e) => handleResultChange(idx, 'status', e.target.value)}
                        >
                          <option value="Normal">Normal</option>
                          <option value="Low">Low</option>
                          <option value="High">High</option>
                        </select>
                      </td>
                      <td>
                        <button type="button" className="action-btn-sm delete" onClick={() => removeResultRow(idx)}>
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {test.results.length === 0 && (
              <div className="empty-results">
                <p>No investigations added yet. Click 'Add Investigation' to start.</p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReport;
