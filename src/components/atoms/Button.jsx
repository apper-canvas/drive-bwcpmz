import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50 shadow-sm',
    secondary: 'bg-white text-secondary border border-gray-300 hover:bg-gray-50 focus:ring-primary/50',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500/50',
    danger: 'bg-error text-white hover:bg-error/90 focus:ring-error/50 shadow-sm',
    success: 'bg-success text-white hover:bg-success/90 focus:ring-success/50 shadow-sm'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          className={`${iconSizeClasses[size]} animate-spin ${children ? 'mr-2' : ''}`} 
        />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon 
          name={icon} 
          className={`${iconSizeClasses[size]} ${children ? 'mr-2' : ''}`} 
        />
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon 
          name={icon} 
          className={`${iconSizeClasses[size]} ${children ? 'ml-2' : ''}`} 
        />
      )}
    </motion.button>
  );
};

export default Button;