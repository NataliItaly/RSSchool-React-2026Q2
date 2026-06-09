import { createPortal } from 'react-dom';
import React, { useEffect, useRef } from 'react';

type ModalProps = {
  isOpen: boolean;
  handleClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ isOpen, handleClose, children }: ModalProps) {
  const previousFocus = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement;
      closeButtonRef.current?.focus();
    }
    return () => {
      previousFocus.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="overlay fixed top-0 left-0 right-0 w-full min-h-screen justify-center items-center bg-[#000000a0] overflow-auto">
      <div
        className="modal relative h-[90vh] p-5 mx-auto my-5 bg-white rounded-md w-1/2 max-w-[600px] min-w-3xs overflow-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2
          className="text-indigo-800 text-2xl font-bold text-center mb-4"
          id="modal-title"
        >
          Create User
        </h2>
        <button
          ref={closeButtonRef}
          className="absolute top-0 right-1 text-2xl text-indigo-800 font-bold hover:text-indigo-600 transition-all duration-300 leading-none p-1 cursor-pointer"
          onClick={handleClose}
        >
          x
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
