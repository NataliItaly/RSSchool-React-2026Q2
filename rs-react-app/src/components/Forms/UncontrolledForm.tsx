import { buttonStyles } from '../../constants/constants';
import type { FormData } from './form-type';
import { useRef } from 'react';

export default function UncontrolledForm() {
  /*  const nameRef = useRef<HTMLInputElement | null>(null);
  const ageRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const genderRef = useRef<HTMLSelectElement | null>(null);
  const termsRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const confPasswordRef = useRef<HTMLInputElement | null>(null); */
  const formRef = useRef<HTMLFormElement | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get('name'),
      age: formData.get('age'),
      email: formData.get('email'),
      gender: formData.get('gender'),
      terms: formData.get('terms'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
      country: formData.get('country'),
    };

    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <div className="flex items-center gap-3 mb-2">
        <label
          className="w-[70px] text-pink-800 font-bold leading-none"
          htmlFor="name"
        >
          Name
        </label>
        <input
          className="border border-gray-400 rounded-md px-3 py-1 flex-auto"
          type="text"
          id="name"
          name="name"
        />
      </div>
      <div className="flex items-center gap-3 mb-2">
        <label
          className="w-[70px] text-pink-800 font-bold leading-none"
          htmlFor="age"
        >
          Age
        </label>
        <input
          className="border border-gray-400 rounded-md px-3 py-1 flex-auto"
          type="number"
          id="age"
          name="age"
        />
      </div>
      <div className="flex items-center gap-3 mb-2">
        <label
          className="w-[70px] text-pink-800 font-bold leading-none"
          htmlFor="email"
        >
          Email
        </label>
        <input
          className="border border-gray-400 rounded-md px-3 py-1 flex-auto"
          type="email"
          id="email"
          name="email"
        />
      </div>
      <div className="flex items-center gap-3 mb-2">
        <label
          className="w-[70px] text-pink-800 font-bold leading-none"
          htmlFor="gender"
        >
          Gender
        </label>
        <select
          className="border border-gray-400 rounded-md px-3 py-1 flex-auto"
          id="gender"
          name="gender"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="flex items-center gap-3 mb-2">
        <input
          className="w-[70px] border border-gray-400 rounded-md px-3 py-1"
          type="checkbox"
          id="terms"
          name="terms"
        />
        <label
          className="flex-auto text-pink-800 font-bold leading-none px-3 py-1"
          htmlFor="terms"
        >
          Accept Terms and Conditions
        </label>
      </div>
      <div className="flex items-center gap-3 mb-2">
        <label
          className="w-[70px] text-pink-800 font-bold leading-none"
          htmlFor="image"
        >
          Upload Image
        </label>
        <input
          className="border border-gray-400 rounded-md px-3 py-1 flex-auto"
          type="file"
          id="image"
          name="image"
          accept=".png,.jpg,.jpeg"
        />
      </div>
      <div className="flex items-center gap-3 mb-2">
        <label
          className="w-[70px] text-pink-800 font-bold leading-none"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className="border border-gray-400 rounded-md px-3 py-1 flex-auto"
          type="password"
          id="password"
          name="password"
        />
      </div>
      <div className="flex items-center gap-3 mb-2">
        <label
          className="w-[70px] text-pink-800 font-bold leading-none"
          htmlFor="confirm-password"
        >
          Confirm Password
        </label>
        <input
          className="border border-gray-400 rounded-md px-3 py-1 flex-auto"
          type="password"
          id="confirm-password"
          name="confirmPassword"
        />
      </div>
      <div className="flex items-center gap-3 mb-2">
        <label
          className="w-[70px] text-pink-800 font-bold leading-none"
          htmlFor="country"
        >
          Choose Country
        </label>
        <input
          className="border border-gray-400 rounded-md px-3 py-1 flex-auto"
          list="country"
          name="country"
        />
        <datalist id="country">
          <option value="USA">USA</option>
          <option value="France">France</option>
          <option value="Italy">Italy</option>
        </datalist>
      </div>
      <div className="flex items-center gap-3 mt-6 mb-2 justify-center">
        <button className={buttonStyles('indigo')} type="submit">
          Create Profile
        </button>
      </div>
    </form>
  );
}
