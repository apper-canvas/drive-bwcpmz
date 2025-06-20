import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const OrderCard = ({ 
  order, 
  onUpdateStatus, 
  onViewDetails,
  className = '' 
}) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'ordered': return 'warning';
      case 'preparing': return 'info';
      case 'ready': return 'success';
      case 'served': return 'default';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'ordered': return 'preparing';
      case 'preparing': return 'ready';
      case 'ready': return 'served';
      case 'served': return 'completed';
      default: return null;
    }
  };

  const getNextStatusLabel = (currentStatus) => {
    switch (currentStatus) {
      case 'ordered': return 'Start Preparing';
      case 'preparing': return 'Mark Ready';
      case 'ready': return 'Mark Served';
      case 'served': return 'Complete';
      default: return null;
    }
  };

  const nextStatus = getNextStatus(order.status);
  const nextStatusLabel = getNextStatusLabel(order.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-heading font-semibold text-lg">Table {order.tableId}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
              <div className="flex items-center space-x-1">
                <ApperIcon name="Clock" className="w-4 h-4" />
                <span>{format(new Date(order.createdAt), 'h:mm a')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="DollarSign" className="w-4 h-4" />
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <Badge variant={getStatusVariant(order.status)}>
            {order.status}
          </Badge>
        </div>

        <div className="space-y-1 mb-3">
          {order.items.slice(0, 3).map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.quantity}x {item.name}
              </span>
              <span className="text-gray-900">${item.price.toFixed(2)}</span>
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="text-sm text-gray-500">
              +{order.items.length - 3} more items
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
          {nextStatus && nextStatusLabel && (
            <Button 
              size="sm" 
              variant="primary" 
              onClick={() => onUpdateStatus(order.Id, nextStatus)}
            >
              {nextStatusLabel}
            </Button>
          )}
          {onViewDetails && (
            <Button size="sm" variant="secondary" icon="Eye" onClick={onViewDetails}>
              Details
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default OrderCard;