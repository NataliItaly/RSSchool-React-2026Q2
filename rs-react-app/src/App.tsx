import Modal from './components/Modal/Modal';
import { useState } from 'react';
import UncontrolledForm from './components/Forms/UncontrolledForm';
import ReactHookForm from './components/Forms/ReactHookForm';
import { buttonStyles } from './constants/constants';

export default function App() {
  //const [isOpen, setIsOpen] = useState(false);
  const [formType, setFormType] = useState<'uncontrolled' | 'rhf' | null>(null);

  /* function handleOpen() {
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  } */

  return (
    <div className="h-dvh flex justify-center items-center gap-5">
      <button
        className={buttonStyles('pink')}
        onClick={() => setFormType('uncontrolled')}
      >
        Open Uncontrolled Form
      </button>
      <button
        className={buttonStyles('indigo')}
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
