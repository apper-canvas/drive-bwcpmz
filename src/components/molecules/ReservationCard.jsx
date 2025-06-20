import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const ReservationCard = ({ 
  reservation, 
  onEdit, 
  onCancel, 
  onSeat,
  className = '' 
}) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'seated': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-heading font-semibold text-lg">{reservation.customerName}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
              <div className="flex items-center space-x-1">
                <ApperIcon name="Phone" className="w-4 h-4" />
                <span>{reservation.phone}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="Users" className="w-4 h-4" />
                <span>{reservation.partySize} guests</span>
              </div>
            </div>
          </div>
          <Badge variant={getStatusVariant(reservation.status)}>
            {reservation.status}
          </Badge>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Calendar" className="w-4 h-4" />
            <span>{format(new Date(reservation.dateTime), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Clock" className="w-4 h-4" />
            <span>{format(new Date(reservation.dateTime), 'h:mm a')}</span>
          </div>
        </div>

        {reservation.notes && (
          <div className="mb-3">
            <div className="flex items-start space-x-2">
              <ApperIcon name="MessageSquare" className="w-4 h-4 text-gray-400 mt-0.5" />
              <p className="text-sm text-gray-600">{reservation.notes}</p>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
          {reservation.status === 'confirmed' && onSeat && (
            <Button size="sm" variant="primary" onClick={onSeat}>
              Seat Guests
            </Button>
          )}
          {onEdit && (
            <Button size="sm" variant="secondary" icon="Edit" onClick={onEdit}>
              Edit
            </Button>
          )}
          {onCancel && reservation.status !== 'cancelled' && (
            <Button size="sm" variant="outline" icon="X" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default ReservationCard;