import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <ApperIcon name="ChefHat" className="w-12 h-12 text-primary" />
        </motion.div>
        
        <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-xl font-heading font-semibold text-gray-700 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist. Let's get you back to managing your restaurant.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/')}
            icon="Home"
            className="w-full"
          >
            Go to Floor View
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate(-1)}
            icon="ArrowLeft"
            className="w-full"
          >
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;