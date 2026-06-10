import { buttonStyles } from '../../constants/constants';
import type { UserFormData } from './form-type';
import { useRef, useState } from 'react';
import { addSubmission } from '../../store/userSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { userSchema } from './userSchema';
import { selectCountries } from '../../store/countrySlice';
import getPasswordStrength from '../../utils/getPasswordStrength';

type UncontrolledFormProps = {
  onSuccess: () => void;
};

export default function UncontrolledForm({ onSuccess }: UncontrolledFormProps) {
  const countries = useAppSelector(selectCountries);

  const formRef = useRef<HTMLFormElement | null>(null);
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [password, setPassword] = useState('');
  const passwordStrength = getPasswordStrength(password);

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
      id: crypto.randomUUID(),
      name: String(formData.get('name') ?? ''),
      age: Number(formData.get('age') ?? 0),
      email: String(formData.get('email') ?? ''),
      gender: String(formData.get('gender') ?? ''),
      termsAccepted: formData.get('terms') !== null,
      password: String(formData.get('password') ?? ''),
      confirmPassword: String(formData.get('confirmPassword') ?? ''),
      country: String(formData.get('country') ?? ''),
      imageBase64,
      createdAt: Date.now(),
    };

    console.log(data);

    if (!countries.includes(data.country)) {
      setErrors({
        country: 'Please select a valid country',
      });

      return;
    }

    const result = userSchema(countries).safeParse(data);

    if (!result.success) {
      console.log(result.error.flatten());
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0];

        if (typeof field === 'string') {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    dispatch(
      addSubmission({
        ...data,
      })
    );

    formRef.current?.reset();

    onSuccess();
  }

  return (
    <form className="overflow-auto" onSubmit={handleSubmit} ref={formRef}>
      <div className="flex items-center flex-wrap mb-2">
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
        <p className="w-full  min-h-5 text-sm text-pink-600">
          {errors.name ?? ''}
        </p>
      </div>
      <div className="flex items-center flex-wrap mb-2">
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
        <p className="w-full  min-h-5 text-sm text-pink-600">
          {errors.age ?? ''}
        </p>
      </div>
      <div className="flex items-center flex-wrap mb-2">
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
        <p className="w-full  min-h-5 text-sm text-pink-600">
          {errors.email ?? ''}
        </p>
      </div>
      <div className="flex items-center flex-wrap mb-2">
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
        <p className="w-full  min-h-5 text-sm text-pink-600">
          {errors.gender ?? ''}
        </p>
      </div>
      <div className="flex items-center flex-wrap mb-2">
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
        <p className="w-full  min-h-5 text-sm text-pink-600">
          {errors.termsAccepted ?? ''}
        </p>
      </div>
      <div className="flex items-center flex-wrap mb-2">
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
        <p className="w-full  min-h-5 text-sm text-pink-600">
          {errors.image ?? ''}
        </p>
      </div>
      <div className="flex items-center flex-wrap mb-2">
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
          onChange={(e) => setPassword(e.target.value)}
        />
        {password.length > 0 && (
          <div className="w-full mt-1">
            <div className="w-36 h-2 bg-gray-200 rounded">
              <div
                className={`h-2 rounded ${passwordStrength.color}`}
                style={{ width: passwordStrength.width }}
              />
            </div>

            <p className="text-sm mt-1">Strength: {passwordStrength.label}</p>
          </div>
        )}
        <p className="w-full  min-h-5 text-sm text-pink-600">
          {errors.password ?? ''}
        </p>
      </div>
      <div className="flex items-center flex-wrap mb-2">
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
        <p className="w-full  min-h-5 text-sm text-pink-600">
          {errors.confirmPassword ?? ''}
        </p>
      </div>
      <div className="flex items-center flex-wrap mb-2">
        <label
          className="w-[70px] text-pink-800 font-bold leading-none"
          htmlFor="country"
        >
          Choose Country
        </label>
        <input
          id="country"
          className="border border-gray-400 rounded-md px-3 py-1 flex-auto"
          list="countries"
          name="country"
        />
        <datalist id="countries">
          {countries.map((country: string) => (
            <option key={country} value={country} />
          ))}
        </datalist>
        <p className="w-full  min-h-5 text-sm text-pink-600">
          {errors.country ?? ''}
        </p>
      </div>
      <div className="flex items-center gap-3 mt-6 mb-2 justify-center">
        <button className={buttonStyles('indigo')} type="submit">
          Create Profile
        </button>
      </div>
    </form>
  );
}
