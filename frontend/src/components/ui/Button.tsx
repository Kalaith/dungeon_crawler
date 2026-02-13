import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-200 ease-out cursor-pointer border-none text-decoration-none relative';

  const variantClasses = {
    primary:
      'bg-transparent border border-cyan-500 text-cyan-400 hover:bg-cyan-900/50 hover:text-white hover:border-cyan-400 active:bg-cyan-800 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary:
      'bg-etrian-800 border border-etrian-700 text-cyan-100 hover:bg-etrian-700 active:bg-etrian-600 disabled:opacity-50 disabled:cursor-not-allowed',
    outline:
      'bg-transparent border border-cyan-900 text-cyan-400 hover:border-cyan-500 hover:text-cyan-100 hover:bg-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed',
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-5 py-2.5 text-lg rounded-xl',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
