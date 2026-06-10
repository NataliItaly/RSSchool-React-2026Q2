import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { buttonStyles } from '../../constants/constants';
import { addSubmission } from '../../store/userSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { userSchema } from './userSchema';
import { z } from 'zod';
import { selectCountries } from '../../store/countrySlice';
import getPasswordStrength from '../../utils/getPasswordStrength';

type ReactHookFormProps = {
  onSuccess: () => void;
};

export type UserFormInput = z.infer<ReturnType<typeof userSchema>>;
type FormData = z.infer<ReturnType<typeof userSchema>>;

export default function ReactHookForm({ onSuccess }: ReactHookFormProps) {
  const countries = useAppSelector(selectCountries);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isValid, touchedFields },
  } = useForm<FormData>({
    resolver: zodResolver(userSchema(countries)),
    mode: 'all',
    defaultValues: {
      name: '',
      age: undefined,
      email: '',
      gender: '',
      termsAccepted: false,
      password: '',
      confirmPassword: '',
      country: '',
    },
  });

  const password = watch('password');
  const passwordStrength = getPasswordStrength(password ?? '');

  const [imageFile, setImageFile] = useState<File | null>(null);

  function convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
  }

  async function onSubmit(data: FormData) {
    console.log('SUBMIT');
    console.log('imageFile:', imageFile);

    if (!imageFile) {
      setError('imageBase64', {
        type: 'manual',
        message: 'Please select an image',
      });
      return;
    }
    console.log(errors);
    const allowedTypes = ['image/png', 'image/jpeg'];

    if (!allowedTypes.includes(imageFile.type)) {
      setError('imageBase64', {
        type: 'manual',
        message: 'Only PNG and JPEG images are allowed',
      });
      return;
    }

    const MAX_SIZE = 2 * 1024 * 1024;

    if (imageFile.size > MAX_SIZE) {
      setError('imageBase64', {
        type: 'manual',
        message: 'Image size must be less than 2 MB',
      });
      return;
    }

    const imageBase64 = await convertToBase64(imageFile);
    const id = crypto.randomUUID();
    const createdAt = Date.now();
    console.log('imageBase64 length:', imageBase64.length);
    dispatch(
      addSubmission({
        ...data,
        id,
        imageBase64,
        createdAt,
      })
    );

    onSuccess();
    reset();
  }

  const isImageValid =
    imageFile &&
    ['image/png', 'image/jpeg'].includes(imageFile.type) &&
    imageFile.size <= 2 * 1024 * 1024;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center flex-wrap mb-2">
        <label
          className="w-[70px] text-pink-800 font-bold leading-none"
          htmlFor="name"
        >
          Name
        </label>

        <input
          className={`border border-gray-400 rounded-md px-3 py-1 flex-auto ${
            errors.name
              ? 'border-pink-500 text-pink-600'
              : touchedFields.name
                ? 'border-green-700'
                : 'border-gray-400'
          }`}
          id="name"
          {...register('name')}
        />

        <p className="w-full min-h-5 text-sm text-pink-600">
          {errors.name?.message}
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
          type="number"
          id="age"
          className="border border-gray-400 rounded-md px-3 py-1 flex-auto invalid:border-pink-500 invalid:text-pink-600"
          {...register('age', { valueAsNumber: true })}
        />

        <p className="w-full min-h-5 text-sm text-pink-600">
          {errors.age?.message}
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
          type="email"
          id="email"
          className="border border-gray-400 rounded-md px-3 py-1 flex-auto invalid:border-pink-500 invalid:text-pink-600"
          {...register('email')}
        />

        <p className="w-full min-h-5 text-sm text-pink-600">
          {errors.email?.message}
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
          id="gender"
          className="border border-gray-400 rounded-md px-3 py-1 flex-auto invalid:border-pink-500 invalid:text-pink-600"
          {...register('gender')}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <p className="w-full min-h-5 text-sm text-pink-600">
          {errors.gender?.message}
        </p>
      </div>

      <div className="flex items-center flex-wrap mb-2">
        <input
          type="checkbox"
          id="terms"
          className="w-[70px]"
          {...register('termsAccepted')}
        />

        <label
          htmlFor="terms"
          className="flex-auto text-pink-800 font-bold leading-none px-3 py-1"
        >
          Accept Terms and Conditions
        </label>

        <p className="w-full min-h-5 text-sm text-pink-600">
          {errors.termsAccepted?.message}
        </p>
      </div>

      <div className="flex items-center flex-wrap mb-2">
        <label
          htmlFor="image"
          className="w-[70px] text-pink-800 font-bold leading-none"
        >
          Upload Image
        </label>

        <input
          type="file"
          id="image"
          accept=".png,.jpg,.jpeg"
          className="border border-gray-400 rounded-md px-3 py-1 flex-auto invalid:border-pink-500 invalid:text-pink-600"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            setImageFile(file);
          }}
        />

        <p className="w-full min-h-5 text-sm text-pink-600">
          {errors.imageBase64?.message}
        </p>
      </div>

      <div className="flex items-center flex-wrap mb-2">
        <label
          htmlFor="password"
          className="w-[70px] text-pink-800 font-bold leading-none"
        >
          Password
        </label>

        <input
          type="password"
          id="password"
          className="border border-gray-400 rounded-md px-3 py-1 flex-auto invalid:border-pink-500 invalid:text-pink-600"
          {...register('password')}
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

        <p className="w-full min-h-5 text-sm text-pink-600">
          {errors.password?.message}
        </p>
      </div>

      <div className="flex items-center flex-wrap mb-2">
        <label
          htmlFor="confirm-password"
          className="w-[70px] text-pink-800 font-bold leading-none"
        >
          Confirm Password
        </label>

        <input
          type="password"
          id="confirm-password"
          className="border border-gray-400 rounded-md px-3 py-1 flex-auto invalid:border-pink-500 invalid:text-pink-600"
          {...register('confirmPassword')}
        />

        <p className="w-full min-h-5 text-sm text-pink-600">
          {errors.confirmPassword?.message}
        </p>
      </div>

      <div className="flex items-center flex-wrap mb-2">
        <label
          htmlFor="country"
          className="w-[70px] text-pink-800 font-bold leading-none"
        >
          Choose Country
        </label>

        <input
          id="country"
          list="countries"
          className="border border-gray-400 rounded-md px-3 py-1 flex-auto"
          {...register('country')}
        />

        <datalist id="countries">
          {countries.map((country) => (
            <option key={country} value={country} />
          ))}
        </datalist>

        <p className="w-full min-h-5 text-sm text-pink-600">
          {errors.country?.message}
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 mt-6 mb-2 justify-center">
        <button
          className={buttonStyles('indigo')}
          type="submit"
          disabled={!isValid || !isImageValid}
        >
          Create Profile
        </button>
        {!isValid && (
          <p className="text-sm text-pink-700 mt-2">
            Complete all required fields to continue.
          </p>
        )}
      </div>
    </form>
  );
}
