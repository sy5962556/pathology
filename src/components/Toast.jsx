import React, { useEffect } from 'react';
import { useAppData } from '../context/AppDataContext';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import './Toast.css';

const Toast = ({ id, message, type, removeToast }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, 3000); // Auto dismiss after 3 seconds

    return () => clearTimeout(timer);
  }, [id, removeToast]);

  const Icon = type === 'success' ? CheckCircle : type === 'error' ? XCircle : Info;

  return (
    <div className={`toast animate-slide-in ${type}`}>
      <Icon size={20} className="toast-icon" />
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={() => removeToast(id)}>
        <X size={16} />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts, removeToast } = useAppData();

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} removeToast={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
