import type { UserFormData } from '../Forms/form-type';
import { useState, useEffect } from 'react';

type Props = {
  user: UserFormData;
};

export default function SubmissionCard({ user }: Props) {
  const [isNew, setIsNew] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNew(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  //const isNew = Date.now() - user.createdAt < 5000;

  return (
    <div
      className={`
        p-4 w-2xs rounded-md border transition-all duration-500
        ${isNew ? 'border-green-500 bg-green-50' : 'border-gray-300'}
      `}
    >
      <img
        src={user.imageBase64}
        alt={user.name}
        className="w-full h-32 object-cover rounded-md mb-3"
      />

      <h3 className="font-bold text-lg">{user.name}</h3>

      <p>Age: {user.age}</p>
      <p>Email: {user.email}</p>
      <p>Gender: {user.gender}</p>
      <p>Country: {user.country}</p>
    </div>
  );
}
