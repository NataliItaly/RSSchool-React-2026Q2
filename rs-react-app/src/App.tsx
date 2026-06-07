import Modal from './components/Modal/Modal';
import { useState } from 'react';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  function handleOpen() {
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <div>
      <button onClick={handleOpen}>Open modal</button>
      <Modal isOpen={isOpen} handleClose={handleClose} />
    </div>
  );
}
