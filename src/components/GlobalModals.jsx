import { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import Modal from './Modal';

const GlobalModals = () => {
  const { 
    isNewPatientModalOpen, setIsNewPatientModalOpen, addPatient,
    isNewReportModalOpen, setIsNewReportModalOpen, addTest
  } = useAppData();

  const [patientData, setPatientData] = useState({ name: '', age: '', gender: 'Female' });
  const [testData, setTestData] = useState({ patient: '', type: 'Complete Blood Count', doctor: 'Dr. Smith' });

  const handlePatientSubmit = (e) => {
    e.preventDefault();
    if (patientData.name && patientData.age) {
       addPatient(patientData);
       setIsNewPatientModalOpen(false);
       setPatientData({ name: '', age: '', gender: 'Female' });
    }
  };

  const handleTestSubmit = (e) => {
    e.preventDefault();
    if (testData.patient) {
       addTest(testData);
       setIsNewReportModalOpen(false);
       setTestData({ patient: '', type: 'Complete Blood Count', doctor: 'Dr. Smith' });
    }
  };

  return (
    <>
      <Modal isOpen={isNewPatientModalOpen} onClose={() => setIsNewPatientModalOpen(false)} title="Register New Patient">
        <form onSubmit={handlePatientSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" className="form-input" required value={patientData.name} onChange={e => setPatientData({...patientData, name: e.target.value})} placeholder="e.g. John Doe" />
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
            <div className="form-group">
              <label>Age</label>
              <input type="number" className="form-input" required value={patientData.age} onChange={e => setPatientData({...patientData, age: e.target.value})} placeholder="e.g. 30" />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select className="form-select" value={patientData.gender} onChange={e => setPatientData({...patientData, gender: e.target.value})}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={() => setIsNewPatientModalOpen(false)}>Cancel</button>
            <button type="submit" className="primary-btn">Register Patient</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isNewReportModalOpen} onClose={() => setIsNewReportModalOpen(false)} title="Create New Test Report">
        <form onSubmit={handleTestSubmit}>
          <div className="form-group">
            <label>Patient Name</label>
            <input type="text" className="form-input" required value={testData.patient} onChange={e => setTestData({...testData, patient: e.target.value})} placeholder="e.g. John Doe" />
          </div>
          <div className="form-group">
            <label>Test Type</label>
            <select className="form-select" value={testData.type} onChange={e => setTestData({...testData, type: e.target.value})}>
              <option value="Complete Blood Count">Complete Blood Count</option>
              <option value="Lipid Panel">Lipid Panel</option>
              <option value="Thyroid Function">Thyroid Function</option>
              <option value="Urinalysis">Urinalysis</option>
              <option value="Glucose Tolerance">Glucose Tolerance</option>
              <option value="Liver Panel">Liver Panel</option>
            </select>
          </div>
          <div className="form-group">
            <label>Referring Doctor</label>
            <select className="form-select" value={testData.doctor} onChange={e => setTestData({...testData, doctor: e.target.value})}>
              <option value="Dr. Smith">Dr. Smith</option>
              <option value="Dr. Adams">Dr. Adams</option>
              <option value="Dr. Lee">Dr. Lee</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={() => setIsNewReportModalOpen(false)}>Cancel</button>
            <button type="submit" className="primary-btn">Create Report</button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default GlobalModals;
