import Modal from './components/Modal/Modal';
import { useState } from 'react';
import UncontrolledForm from './components/Forms/UncontrolledForm';
import ReactHookForm from './components/Forms/ReactHookForm';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [formType, setFormType] = useState<'uncontrolled' | 'rhf' | null>(null);

  function handleOpen() {
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <div className="h-dvh flex justify-center items-center gap-5">
      <button
        className="px-6 py-3 text-lg text-white bg-pink-800 rounded-md cursor-pointer hover:bg-pink-600 transition-all duration-500"
        onClick={() => setFormType('uncontrolled')}
      >
        Open Uncontrolled Form
      </button>
      <button
        className="px-6 py-3 text-lg text-white bg-indigo-700 rounded-md cursor-pointer hover:bg-indigo-500 transition-all duration-500"
        onClick={() => setFormType('rhf')}
      >
        Open React Hook Form
      </button>
      <Modal isOpen={formType !== null} handleClose={() => setFormType(null)}>
        {formType === 'uncontrolled' ? <UncontrolledForm /> : <ReactHookForm />}
      </Modal>
    </div>
  );
}
