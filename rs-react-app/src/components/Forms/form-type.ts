export interface UserFormData {
  id: string;
  name: string;
  age: number;
  email: string;
  gender: string;
  termsAccepted: boolean;
  password: string;
  confirmPassword: string;
  country: string;
  imageBase64: string;
  createdAt: number;
}

export type UserFormInput = {
  name: string;
  age: number;
  email: string;
  gender: string;
  termsAccepted: boolean;
  password: string;
  confirmPassword: string;
  country: string;
  imageBase64: string;
};
