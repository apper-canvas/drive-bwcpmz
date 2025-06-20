import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import Card from '@/components/atoms/Card';

const TableStatusPanel = ({ 
  table, 
  onUpdateStatus, 
  onClose,
  isOpen = false 
}) => {
  const [partySize, setPartySize] = useState(table?.currentPartySize || 1);
  const [loading, setLoading] = useState(false);

  if (!table) return null;

  const handleStatusUpdate = async (newStatus, additionalData = {}) => {
    setLoading(true);
    try {
      await onUpdateStatus(table.Id, newStatus, additionalData);
      toast.success(`Table ${table.number} updated to ${newStatus}`);
      onClose();
    } catch (error) {
      toast.error('Failed to update table status');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatGuests = () => {
    if (partySize < 1 || partySize > table.capacity) {
      toast.error(`Party size must be between 1 and ${table.capacity}`);
      return;
    }
    handleStatusUpdate('occupied', { currentPartySize: partySize });
  };

  const statusActions = {
    available: [
      { 
        label: 'Seat Guests', 
        action: handleSeatGuests,
        variant: 'primary',
        icon: 'Users'
      },
      { 
        label: 'Reserve', 
        action: () => handleStatusUpdate('reserved'),
        variant: 'secondary',
        icon: 'Calendar'
      }
    ],
    occupied: [
      { 
        label: 'Clear Table', 
        action: () => handleStatusUpdate('cleaning'),
        variant: 'primary',
        icon: 'Sparkles'
      }
    ],
    reserved: [
      { 
        label: 'Seat Guests', 
        action: handleSeatGuests,
        variant: 'primary',
        icon: 'Users'
      },
      { 
        label: 'Cancel Reservation', 
        action: () => handleStatusUpdate('available'),
        variant: 'outline',
        icon: 'X'
      }
    ],
    cleaning: [
      { 
        label: 'Mark Available', 
        action: () => handleStatusUpdate('available'),
        variant: 'success',
        icon: 'Check'
      }
    ]
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-48%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-48%' }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <Card className="p-6 m-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-heading font-bold">Table {table.number}</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  <Badge variant={table.status}>{table.status}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Capacity</span>
                  <span className="text-sm text-gray-900">{table.capacity} seats</span>
                </div>

                {table.status === 'occupied' && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Current Party</span>
                    <span className="text-sm text-gray-900">{table.currentPartySize} guests</span>
                  </div>
                )}
              </div>

              {(table.status === 'available' || table.status === 'reserved') && (
                <div className="mb-6">
                  <Input
                    type="number"
                    label="Party Size"
                    value={partySize}
                    onChange={(e) => setPartySize(parseInt(e.target.value) || 1)}
                    min="1"
                    max={table.capacity}
                    icon="Users"
                  />
                </div>
              )}

              <div className="space-y-2">
                {statusActions[table.status]?.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant}
                    icon={action.icon}
                    className="w-full"
                    onClick={action.action}
                    loading={loading}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TableStatusPanel;