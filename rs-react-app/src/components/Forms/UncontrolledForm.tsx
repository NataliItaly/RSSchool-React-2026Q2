import type { FormData } from './form-type';
import { useRef } from 'react';

export default function UncontrolledForm() {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const ageRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const genderRef = useRef<HTMLSelectElement | null>(null);
  const termsRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const confPasswordRef = useRef<HTMLInputElement | null>(null);
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
    };

    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" ref={nameRef} />
      </div>
      <div>
        <label htmlFor="age">Age</label>
        <input type="number" id="age" name="age" ref={ageRef} />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" ref={emailRef} />
      </div>
      <div>
        <label htmlFor="gender">Gender</label>
        <select id="gender" name="gender" ref={genderRef}>
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <input type="checkbox" id="terms" name="terms" ref={termsRef} />
        <label htmlFor="terms">Accept Terms and Conditions</label>
      </div>
      <div>
        <label htmlFor="image">Upload Image</label>
        <input type="file" id="image" name="image" accept=".png,.jpg,.jpeg" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          ref={passwordRef}
        />
      </div>
      <div>
        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          type="password"
          id="confirm-password"
          name="confirmPassword"
          ref={confPasswordRef}
        />
      </div>
      <div>
        <label htmlFor="country">Choose Country</label>
        <input list="country" name="country" />
        <datalist id="country">
          <option value="USA">USA</option>
          <option value="France">France</option>
          <option value="Italy">Italy</option>
        </datalist>
      </div>
      <div>
        <button type="submit">Create Profile</button>
      </div>
    </form>
  );
}
