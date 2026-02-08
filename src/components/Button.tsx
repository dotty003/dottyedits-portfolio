import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 font-medium tracking-wide transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase";
  
  const variants = {
    primary: "bg-white text-black hover:bg-neutral-200 border border-transparent",
    outline: "bg-transparent text-white border border-white/30 hover:bg-white hover:text-black",
    ghost: "bg-transparent text-neutral-400 hover:text-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};
