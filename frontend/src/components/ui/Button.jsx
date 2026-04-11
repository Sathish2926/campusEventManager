import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-[1.02] active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-gradient-primary text-white shadow-soft hover:shadow-soft-hover focus:ring-primary',
    secondary: 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 focus:ring-slate-200',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    ghost: 'bg-transparent text-slate-600 hover:text-primary hover:bg-slate-50',
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

export default Button;
