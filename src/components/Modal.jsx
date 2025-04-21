// src/components/Modal.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-[#00000088] bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-coffee-latte">
          <h3 className="font-semibold text-lg text-coffee-dark">{title}</h3>
          <button
            onClick={onClose}
            className="text-coffee-dark hover:text-coffee-accent transition-colors"
          >
            <FaTimes size={20} className='cursor-pointer' />
          </button>
        </div>
        
        <div className="overflow-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;