// components/Button.tsx
import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded bg-blue-500 text-black hover:bg-blue-600 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
