import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Tests from './pages/Tests';
import Analytics from './pages/Analytics';
import ReportView from './pages/ReportView';
import EditReport from './pages/EditReport';
import { AppDataProvider } from './context/AppDataContext';
import './App.css';

function App() {
  return (
    <AppDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<Patients />} />
            <Route path="tests" element={<Tests />} />
            <Route path="report/:id" element={<ReportView />} />
            <Route path="edit-report/:id" element={<EditReport />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<div className="glass-panel" style={{padding: '2rem'}}>Settings coming soon</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppDataProvider>
  );
}

export default App;
