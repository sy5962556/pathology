import React, { createContext, useState, useContext, useEffect } from 'react';

const AppDataContext = createContext();

export const useAppData = () => useContext(AppDataContext);

// ─── Helper: safe localStorage read ───
const loadFromStorage = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const DEFAULT_TEST_RESULTS = [
  { category: 'HEMOGLOBIN', investigation: 'Hemoglobin (Hb)', result: '12.5', reference: '13.0 - 17.0', unit: 'g/dL', status: 'Low' },
  { category: 'RBC COUNT', investigation: 'Total RBC count', result: '5.2', reference: '4.5 - 5.5', unit: 'mill/cumm', status: 'Normal' },
  { category: 'BLOOD INDICES', investigation: 'Packed Cell Volume (PCV)', result: '57.5', reference: '40 - 50', unit: '%', status: 'High' },
  { category: 'BLOOD INDICES', investigation: 'MCV', result: '87.75', reference: '83 - 101', unit: 'fL', status: 'Normal' },
  { category: 'BLOOD INDICES', investigation: 'MCH', result: '27.2', reference: '27 - 32', unit: 'pg', status: 'Normal' },
  { category: 'BLOOD INDICES', investigation: 'MCHC', result: '32.8', reference: '32.5 - 34.5', unit: 'g/dL', status: 'Normal' },
  { category: 'WBC COUNT', investigation: 'Total WBC count', result: '9000', reference: '4000-11000', unit: 'cumm', status: 'Normal' },
  { category: 'DIFFERENTIAL', investigation: 'Neutrophils', result: '60', reference: '50 - 62', unit: '%', status: 'Normal' },
  { category: 'DIFFERENTIAL', investigation: 'Lymphocytes', result: '31', reference: '20 - 40', unit: '%', status: 'Normal' },
  { category: 'PLATELET', investigation: 'Platelet Count', result: '320000', reference: '150000 - 410000', unit: 'cumm', status: 'Normal' }
];

// ─── Default seed data generator ───
const getRecentDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

const DEFAULT_PATIENTS = [
  { id: 'P-9832', name: 'Maria Garcia', age: 45, gender: 'Female', lastVisit: getRecentDate(1), status: 'Active' },
  { id: 'P-9833', name: 'James Wilson', age: 62, gender: 'Male', lastVisit: getRecentDate(2), status: 'Active' },
  { id: 'P-9834', name: 'Robert Chen', age: 28, gender: 'Male', lastVisit: getRecentDate(15), status: 'Inactive' },
  { id: 'P-9835', name: 'Anita Patel', age: 34, gender: 'Female', lastVisit: getRecentDate(0), status: 'Active' },
  { id: 'P-9836', name: 'David Smith', age: 51, gender: 'Male', lastVisit: getRecentDate(5), status: 'Active' },
  { id: 'P-9837', name: 'Elena Rostova', age: 39, gender: 'Female', lastVisit: getRecentDate(0), status: 'New' },
  { id: 'P-9838', name: 'John Doe', age: 29, gender: 'Male', lastVisit: getRecentDate(3), status: 'Active' },
  { id: 'P-9839', name: 'Sarah Miller', age: 41, gender: 'Female', lastVisit: getRecentDate(4), status: 'Active' },
  { id: 'P-9840', name: 'Michael Brown', age: 55, gender: 'Male', lastVisit: getRecentDate(2), status: 'Active' },
];

const DEFAULT_TESTS = [
  { id: 'T-1042', patient: 'James Wilson', type: 'Complete Blood Count', doctor: 'Dr. Smith', date: getRecentDate(2), status: 'Completed', results: DEFAULT_TEST_RESULTS, age: '62', sex: 'Male' },
  { id: 'T-1043', patient: 'Maria Garcia', type: 'Lipid Panel', doctor: 'Dr. Adams', date: getRecentDate(1), status: 'Pending', results: DEFAULT_TEST_RESULTS, age: '45', sex: 'Female' },
  { id: 'T-1044', patient: 'Robert Chen', type: 'Thyroid Function', doctor: 'Dr. Smith', date: getRecentDate(15), status: 'Completed', results: DEFAULT_TEST_RESULTS, age: '28', sex: 'Male' },
  { id: 'T-1045', patient: 'Anita Patel', type: 'Urinalysis', doctor: 'Dr. Lee', date: getRecentDate(0), status: 'Pending', results: DEFAULT_TEST_RESULTS, age: '34', sex: 'Female' },
  { id: 'T-1046', patient: 'David Smith', type: 'Glucose Tolerance', doctor: 'Dr. Adams', date: getRecentDate(5), status: 'Completed', results: DEFAULT_TEST_RESULTS, age: '51', sex: 'Male' },
  { id: 'T-1047', patient: 'Elena Rostova', type: 'Liver Panel', doctor: 'Dr. Lee', date: getRecentDate(0), status: 'Completed', results: DEFAULT_TEST_RESULTS, age: '39', sex: 'Female' },
  { id: 'T-1048', patient: 'John Doe', type: 'Basic Metabolic Panel', doctor: 'Dr. Smith', date: getRecentDate(3), status: 'Completed', results: DEFAULT_TEST_RESULTS, age: '29', sex: 'Male' },
  { id: 'T-1049', patient: 'Sarah Miller', type: 'WBC Count', doctor: 'Dr. Adams', date: getRecentDate(4), status: 'In Progress', results: DEFAULT_TEST_RESULTS, age: '41', sex: 'Female' },
  { id: 'T-1050', patient: 'Michael Brown', type: 'Hemoglobin A1c', doctor: 'Dr. Lee', date: getRecentDate(2), status: 'Pending', results: DEFAULT_TEST_RESULTS, age: '55', sex: 'Male' },
];



export const AppDataProvider = ({ children }) => {
  // ─── Persisted state: load from localStorage, fall back to defaults ───
  const [patients, setPatients] = useState(() => loadFromStorage('pathology_patients', DEFAULT_PATIENTS));
  const [tests, setTests] = useState(() => loadFromStorage('pathology_tests', DEFAULT_TESTS));

  // ─── Sync to localStorage on every change ───
  useEffect(() => { localStorage.setItem('pathology_patients', JSON.stringify(patients)); }, [patients]);
  useEffect(() => { localStorage.setItem('pathology_tests', JSON.stringify(tests)); }, [tests]);

  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.className = `${theme}-theme`;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };



  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };



  const addPatient = (patient) => {
    const newId = `P-${Math.floor(Math.random() * 9000) + 1000}`;
    setPatients(prev => [{ ...patient, id: newId, status: 'New', lastVisit: new Date().toISOString().split('T')[0] }, ...prev]);
    addToast(`Patient ${patient.name} registered successfully.`, 'success');
  };

  const addTest = (test) => {
    const newId = `T-${Math.floor(Math.random() * 9000) + 1000}`;
    const today = new Date().toISOString().split('T')[0];
    setTests(prev => [{ ...test, id: newId, status: 'Pending', date: today, age: test.age || 'N/A', sex: test.sex || 'Other', results: DEFAULT_TEST_RESULTS }, ...prev]);
    
    // Auto-create patient if one with this name doesn't exist yet
    const patientExists = patients.some(p => p.name.toLowerCase() === test.patient.toLowerCase());
    if (!patientExists) {
      const patientId = `P-${Math.floor(Math.random() * 9000) + 1000}`;
      setPatients(prev => [{ 
        id: patientId, 
        name: test.patient, 
        age: test.age || 'N/A', 
        gender: test.sex || 'Other', 
        lastVisit: today, 
        status: 'Active' 
      }, ...prev]);
    } else {
      // Update existing patient's lastVisit
      setPatients(prev => prev.map(p => 
        p.name.toLowerCase() === test.patient.toLowerCase() 
          ? { ...p, lastVisit: today, status: 'Active' }
          : p
      ));
    }
    
    addToast(`Test report created for ${test.patient}.`, 'success');
  };

  const updateTest = (id, updatedData) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
    addToast(`Test ${id} updated successfully.`, 'success');
  };

  const deleteTest = (id) => {
    setTests(prev => prev.filter(t => t.id !== id));
    addToast(`Test ${id} deleted.`, 'error');
  };

  return (
    <AppDataContext.Provider value={{
      patients, addPatient,
      tests, addTest, updateTest, deleteTest,
      isNewReportModalOpen, setIsNewReportModalOpen,
      isNewPatientModalOpen, setIsNewPatientModalOpen,
      globalSearchQuery, setGlobalSearchQuery,
      isSidebarOpen, setIsSidebarOpen,
      theme, toggleTheme,
      toasts, addToast, removeToast
    }}>
      {children}
    </AppDataContext.Provider>
  );
};
