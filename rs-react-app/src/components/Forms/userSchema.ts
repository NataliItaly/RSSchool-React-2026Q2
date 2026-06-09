import { z } from 'zod';

const countries = ['USA', 'France', 'Italy'];

export type UserFormInput = z.infer<typeof userSchema>;

export const userSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .refine(
        (value) => value[0] === value[0]?.toUpperCase(),
        'First letter must be uppercase'
      ),

    age: z.number().min(1, 'Age is required and must be more than 0'),

    email: z
      .string()
      .min(1, 'Email is required')
      .refine((value) => {
        const parts = value.split('@');

        if (parts.length !== 2) return false;

        const [localPart, domain] = parts;

        return (
          localPart.length > 0 &&
          domain.includes('.') &&
          domain.split('.').every((part) => part.length > 0)
        );
      }, 'Invalid email'),

    gender: z.string().min(1, 'Gender is required'),

    termsAccepted: z.boolean().refine((value) => value, {
      message: 'You must accept Terms and Conditions',
    }),

    password: z.string().min(1, 'Password is required'),

    confirmPassword: z.string(),

    country: z
      .string()
      .refine(
        (value) => countries.includes(value),
        'Country must be selected from the list'
      ),

    imageBase64: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match',
  });
