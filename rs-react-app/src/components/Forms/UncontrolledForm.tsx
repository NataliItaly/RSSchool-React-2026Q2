import { buttonStyles } from '../../constants/constants';
import type { UserFormData } from './form-type';
import { useRef } from 'react';

export default function UncontrolledForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  function convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const image = formData.get('image');

    if (!(image instanceof File) || image.size === 0) {
      alert('Please select an image');
      return;
    }

    const allowedTypes = ['image/png', 'image/jpeg'];

    if (!allowedTypes.includes(image.type)) {
      alert('Only PNG and JPEG images are allowed');
      return;
    }

    const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

    if (image.size > MAX_SIZE) {
      alert('Image size must be less than 2 MB');
      return;
    }

    const imageBase64 = await convertToBase64(image);

    const data: UserFormData = {
      name: String(formData.get('name') ?? ''),
      age: Number(formData.get('age') ?? 0),
      email: String(formData.get('email') ?? ''),
      gender: String(formData.get('gender') ?? ''),
      termsAccepted: formData.get('terms') !== null,
      password: String(formData.get('password') ?? ''),
      confirmPassword: String(formData.get('confirmPassword') ?? ''),
      country: String(formData.get('country') ?? ''),
      imageBase64,
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
          id="country"
          className="border border-gray-400 rounded-md px-3 py-1 flex-auto"
          list="country"
          name="country"
        />
        <datalist id="countries">
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
