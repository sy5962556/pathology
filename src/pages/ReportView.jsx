import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { Printer, ArrowLeft } from 'lucide-react';
import './ReportView.css';

const ReportView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tests } = useAppData();

  const testRecord = tests.find(t => t.id === id) || {
    id: 'T-555',
    patient: 'Yash M. Patel',
    type: 'Complete Blood Count (CBC)',
    date: '202X-12-02',
    doctor: 'Dr. Hiren Shah',
    status: 'Completed'
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="report-wrapper animate-fade-in">
      <div className="report-actions hide-on-print">
        <button className="icon-btn-text" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>
        <button className="primary-btn" onClick={handlePrint}>
          <Printer size={18} /> Print Report
        </button>
      </div>

      <div className="report-paper">
        {/* Header section */}
        <div className="report-header">
          <div className="header-left">
            <div className="logo-circle">
              <span className="plus-sign">+</span>
            </div>
            <div className="clinic-details">
              <h1>DRLOGY <span className="blue-text">PATHOLOGY LAB</span></h1>
              <div className="tagline">
                <span className="icon">🔬</span> <strong>Accurate</strong> | <strong>Caring</strong> | <strong>Instant</strong>
              </div>
              <p className="address">105 -108, SMART VISION COMPLEX, HEALTHCARE ROAD, OPPOSITE HEALTHCARE COMPLEX. MUMBAI - 689578</p>
            </div>
          </div>
          <div className="header-right">
            <p>📞 0123456789 | 0912345678</p>
            <p>✉️ drlogypathlab@drlogy.com</p>
          </div>
        </div>

        <div className="stripe-bar">
          <span>www.drlogy.com</span>
        </div>

        {/* Patient Details */}
        <div className="patient-box">
          <div className="patient-col">
            <h2 className="patient-name">{testRecord.patient}</h2>
            <p><strong>Age:</strong> {testRecord.age || '21 Years'}</p>
            <p><strong>Sex:</strong> {testRecord.sex || 'Male'}</p>
            <p><strong>PID:</strong> {testRecord.id.replace('T-', '')}</p>
          </div>
          <div className="patient-col qr-col">
             <div className="mock-qr"></div>
          </div>
          <div className="patient-col ref-col">
             <p><strong>Sample Collected At:</strong></p>
             <p>125, Shivam Bungalow, S G Road, <br/>Mumbai</p>
             <p className="dr-ref"><strong>Ref. By:</strong> {testRecord.doctor}</p>
          </div>
          <div className="patient-col date-col">
             <div className="mock-barcode">||||||||||||||||||||||||||||</div>
             <p><strong>Registered on:</strong> 02:31 PM {testRecord.date}</p>
             <p><strong>Collected on:</strong> 03:11 PM {testRecord.date}</p>
             <p><strong>Reported on:</strong> 04:35 PM {testRecord.date}</p>
          </div>
        </div>

        {/* Report Title */}
        <h3 className="report-title">{testRecord.type}</h3>

        {/* Results Table */}
        <table className="report-table">
          <thead>
            <tr>
              <th width="40%">Investigation</th>
              <th width="20%">Result</th>
              <th width="25%">Reference Value</th>
              <th width="15%">Unit</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-bottom">
              <td>Primary Sample Type :</td>
              <td>Blood</td>
              <td></td>
              <td></td>
            </tr>
            
            {(testRecord.results || []).map((res, idx) => (
              <React.Fragment key={idx}>
                {/* Show category header if it's the first item or category changed */}
                {(idx === 0 || res.category !== testRecord.results[idx-1].category) && (
                  <tr className="section-title">
                    <td colSpan="4">{res.category}</td>
                  </tr>
                )}
                <tr>
                  <td>
                    {res.investigation}
                    {res.investigation.includes('MCV') || res.investigation.includes('MCH') ? (
                      <div className="sub-text">Calculated</div>
                    ) : null}
                  </td>
                  <td className={`result-${res.status.toLowerCase()}`}>
                    {res.result} {res.status !== 'Normal' && <span className="flag">{res.status}</span>}
                  </td>
                  <td>{res.reference}</td>
                  <td>{res.unit}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* Footer Area */}
        <div className="report-footer-section">
          <p className="instruments"><strong>Instruments:</strong> Fully automated cell counter - Mindray 300</p>
          <div className="signature-area">
            <div className="sig-box">
              <p className="thanks">Thanks for Reference</p>
              <div className="sig-line">
                 <div className="mock-sig1"></div>
              </div>
              <p><strong>Medical Lab Technician</strong></p>
              <p className="sub-title">(DMLT, BMLT)</p>
            </div>
            <div className="sig-box">
              <p className="thanks">****End of Report****</p>
              <div className="sig-line">
                 <div className="mock-sig2"></div>
              </div>
              <p><strong>Dr. Payal Shah</strong></p>
              <p className="sub-title">(MD, Pathologist)</p>
            </div>
            <div className="sig-box no-border">
              <div className="sig-line" style={{marginTop: '25px'}}>
                 <div className="mock-sig3"></div>
              </div>
              <p><strong>Dr. Vimal Shah</strong></p>
              <p className="sub-title">(MD, Pathologist)</p>
            </div>
          </div>
          <div className="gen-stamp">
            <p>Generated on : {testRecord.date} 05:00 PM</p>
            <p>Page 1 of 1</p>
          </div>
        </div>
        
        <div className="bottom-bar">
          <div className="delivery-truck">
            <span role="img" aria-label="motorcycle">🛵</span>
          </div>
          <div className="bottom-text">Sample Collection</div>
          <div className="bottom-phone">
            <span className="wa-icon">🟢</span> 0123456789
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReportView;
