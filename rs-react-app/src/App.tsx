import Modal from './components/Modal/Modal';
import SubmissionCard from './components/SubmissionCard/SubmissionCard';
import { useState } from 'react';
import UncontrolledForm from './components/Forms/UncontrolledForm';
import ReactHookForm from './components/Forms/ReactHookForm';
import { buttonStyles } from './constants/constants';
import { useAppSelector } from './hooks/reduxHooks';

export default function App() {
  //const [isOpen, setIsOpen] = useState(false);
  const [formType, setFormType] = useState<'uncontrolled' | 'rhf' | null>(null);

  const submissions = useAppSelector((state) => state.users.submissions);

  return (
    <div className="h-dvh ">
      <div className="py-5 flex justify-center items-center gap-5">
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
      </div>
      <div className="flex justify-center gap-4 mt-8">
        {submissions.map((user) => (
          <SubmissionCard key={user.id} user={user} />
        ))}
      </div>
      <Modal isOpen={formType !== null} handleClose={() => setFormType(null)}>
        {formType === 'uncontrolled' ? (
          <UncontrolledForm onSuccess={() => setFormType(null)} />
        ) : (
          <ReactHookForm />
        )}
      </Modal>
    </div>
  );
}
