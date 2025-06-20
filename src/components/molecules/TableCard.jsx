import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';

const TableCard = ({ table, onClick, className = '' }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-success text-white';
      case 'occupied': return 'bg-warning text-white';
      case 'reserved': return 'bg-info text-white';
      case 'cleaning': return 'bg-gray-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return 'Check';
      case 'occupied': return 'Users';
      case 'reserved': return 'Clock';
      case 'cleaning': return 'Sparkles';
      default: return 'Circle';
    }
  };

  const getOccupiedTime = () => {
    if (!table.seatedAt) return null;
    return formatDistanceToNow(new Date(table.seatedAt), { addSuffix: true });
  };

  return (
    <Card
      onClick={onClick}
      hover
      className={`relative p-4 min-h-[120px] flex flex-col justify-between ${className}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(table.status)}`}>
            <ApperIcon name={getStatusIcon(table.status)} className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg">Table {table.number}</h3>
            <p className="text-sm text-gray-600">Seats {table.capacity}</p>
          </div>
        </div>
        <Badge variant={table.status} size="sm">
          {table.status}
        </Badge>
      </div>

      {table.status === 'occupied' && (
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="Users" className="w-4 h-4" />
            <span>{table.currentPartySize} guests</span>
          </div>
          {getOccupiedTime() && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ApperIcon name="Clock" className="w-4 h-4" />
              <span>Seated {getOccupiedTime()}</span>
            </div>
          )}
        </div>
      )}

      {table.status === 'reserved' && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ApperIcon name="Calendar" className="w-4 h-4" />
          <span>Reserved</span>
        </div>
      )}

      {table.status === 'available' && (
        <div className="flex items-center space-x-2 text-sm text-success">
          <ApperIcon name="Check" className="w-4 h-4" />
          <span>Ready for guests</span>
        </div>
      )}
    </Card>
  );
};

export default TableCard;