const bgStyles: Record<string, string> = {
  pink: 'bg-pink-700 hover:bg-pink-500',
  indigo: 'bg-indigo-700 hover:bg-indigo-500',
  green: 'bg-green-700 hover:bg-green-500',
} as const;

type ButtonColor = keyof typeof bgStyles;

export function buttonStyles(color: ButtonColor) {
  return `
      px-6 py-2 text-lg text-white rounded-md cursor-pointer hover:opacity-75 transition-all duration-500 disabled:opacity-50 disabled:cursor-none disabled:pointer-events-none ${bgStyles[color]}
    `;
}
