import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({ 
  type = 'text',
  label,
  placeholder,
  error,
  icon,
  iconPosition = 'left',
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors';
  const errorClasses = error ? 'border-error focus:border-error focus:ring-error' : '';
  const iconClasses = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '';
  
  const inputClasses = `${baseClasses} ${errorClasses} ${iconClasses} ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
            <ApperIcon name={icon} className="w-4 h-4 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={inputClasses}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;