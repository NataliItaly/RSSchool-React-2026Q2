export default function getPasswordStrength(password: string) {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) {
    return {
      label: 'Weak',
      width: '25%',
      color: 'bg-pink-700',
    };
  }

  if (score <= 4) {
    return {
      label: 'Medium',
      width: '60%',
      color: 'bg-yellow-500',
    };
  }

  return {
    label: 'Strong',
    width: '100%',
    color: 'bg-green-700',
  };
}
