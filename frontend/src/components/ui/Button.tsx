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
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 ease-out cursor-pointer border-none text-decoration-none relative';
  
  const variantClasses = {
    primary: 'bg-teal-500 text-cream-50 hover:bg-teal-600 active:bg-teal-700',
    secondary: 'bg-gray-400/15 text-slate-900 hover:bg-gray-400/25 active:bg-gray-400/30 dark:bg-gray-400/15 dark:text-gray-200 dark:hover:bg-gray-400/25 dark:active:bg-gray-400/30',
    outline: 'bg-transparent border border-gray-400/30 text-slate-900 hover:bg-gray-400/15 dark:border-gray-400/30 dark:text-gray-200 dark:hover:bg-gray-400/15'
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-5 py-2.5 text-lg rounded-xl'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};