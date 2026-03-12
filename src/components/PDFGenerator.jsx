import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download } from 'lucide-react';
import '../pages/ReportView.css';

const PDFGenerator = ({ test, addToast }) => {
  const printRef = useRef();
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async (e) => {
    e.stopPropagation();
    setIsGenerating(true);
    addToast('Generating PDF... please wait.', 'info');
    
    try {
      const element = printRef.current;
      if (!element) return;

      // Temporarily show the element to capture it properly
      element.style.display = 'block';
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.top = '0';
      
      const canvas = await html2canvas(element, { 
        scale: 2, // High resolution
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // A4 dimensions in mm: 210 x 297
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`DrLogy_Report_${test.id}.pdf`);
      
      // Hide again
      element.style.display = 'none';
      
      addToast('PDF downloaded successfully!', 'success');
    } catch (error) {
      console.error('Error generating PDF:', error);
      addToast('Failed to generate PDF.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button 
        className="icon-btn" 
        onClick={generatePDF} 
        disabled={isGenerating}
        title="Download PDF"
      >
        <Download size={16} />
      </button>

      {/* Hidden printable template - matches ReportView structure exactly */}
      <div 
        ref={printRef} 
        style={{ display: 'none', background: 'white', width: '800px', fontFamily: "'Inter', sans-serif", color: 'black' }}
      >
        <div className="report-paper" style={{ boxShadow: 'none', margin: '0', padding: '0', minHeight: 'auto' }}>
          <div className="report-header">
            <div className="header-left">
              <div className="logo-circle"><span className="plus-sign">+</span></div>
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

          <div className="patient-box">
            <div className="patient-col">
              <h2 className="patient-name">{test.patient}</h2>
              <p><strong>Age:</strong> {test.age || '21 Years'}</p>
              <p><strong>Sex:</strong> {test.sex || 'Male'}</p>
              <p><strong>PID:</strong> {test.id.replace('T-', '')}</p>
            </div>
            <div className="patient-col qr-col">
               <div className="mock-qr"></div>
            </div>
            <div className="patient-col ref-col">
               <p><strong>Sample Collected At:</strong></p>
               <p>125, Shivam Bungalow, S G Road, <br/>Mumbai</p>
               <p className="dr-ref"><strong>Ref. By:</strong> {test.doctor}</p>
            </div>
            <div className="patient-col date-col">
               <div className="mock-barcode">||||||||||||||||||||||||||||</div>
               <p><strong>Registered on:</strong> 02:31 PM {test.date}</p>
               <p><strong>Collected on:</strong> 03:11 PM {test.date}</p>
               <p><strong>Reported on:</strong> 04:35 PM {test.date}</p>
            </div>
          </div>

          <h3 className="report-title">{test.type}</h3>

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
              {(test.results || []).map((res, idx) => (
                <React.Fragment key={idx}>
                  {(idx === 0 || res.category !== test.results[idx-1].category) && (
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

          <div className="report-footer-section" style={{ marginTop: '100px' }}>
            <p className="instruments"><strong>Instruments:</strong> Fully automated cell counter - Mindray 300</p>
            <div className="signature-area">
              <div className="sig-box">
                <p className="thanks">Thanks for Reference</p>
                <div className="sig-line"><div className="mock-sig1"></div></div>
                <p><strong>Medical Lab Technician</strong></p>
                <p className="sub-title">(DMLT, BMLT)</p>
              </div>
              <div className="sig-box">
                <p className="thanks">****End of Report****</p>
                <div className="sig-line"><div className="mock-sig2"></div></div>
                <p><strong>Dr. Payal Shah</strong></p>
                <p className="sub-title">(MD, Pathologist)</p>
              </div>
              <div className="sig-box no-border">
                <div className="sig-line" style={{marginTop: '25px'}}><div className="mock-sig3"></div></div>
                <p><strong>Dr. Vimal Shah</strong></p>
                <p className="sub-title">(MD, Pathologist)</p>
              </div>
            </div>
            <div className="gen-stamp">
              <p>Generated on : {test.date} 05:00 PM</p>
              <p>Page 1 of 1</p>
            </div>
          </div>
          <div className="bottom-bar">
            <div className="delivery-truck"><span role="img" aria-label="motorcycle">🛵</span></div>
            <div className="bottom-text">Sample Collection</div>
            <div className="bottom-phone"><span className="wa-icon">🟢</span> 0123456789</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PDFGenerator;
