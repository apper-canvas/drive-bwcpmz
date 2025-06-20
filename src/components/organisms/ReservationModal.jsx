import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';

const ReservationModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  reservation = null,
  availableTables = [] 
}) => {
  const [formData, setFormData] = useState({
    customerName: reservation?.customerName || '',
    phone: reservation?.phone || '',
    partySize: reservation?.partySize || 2,
    dateTime: reservation?.dateTime ? new Date(reservation.dateTime).toISOString().slice(0, 16) : '',
    notes: reservation?.notes || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.phone || !formData.dateTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        dateTime: new Date(formData.dateTime).toISOString(),
        partySize: parseInt(formData.partySize)
      });
      onClose();
      toast.success(reservation ? 'Reservation Updated' : 'Reservation Created');
    } catch (error) {
      toast.error('Failed to save reservation');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <Card className="p-6 m-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-bold">
                  {reservation ? 'Edit Reservation' : 'New Reservation'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Customer Name *"
                  value={formData.customerName}
                  onChange={(e) => handleChange('customerName', e.target.value)}
                  placeholder="Enter customer name"
                  icon="User"
                  required
                />

                <Input
                  label="Phone Number *"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  icon="Phone"
                  required
                />

                <Input
                  label="Party Size *"
                  type="number"
                  value={formData.partySize}
                  onChange={(e) => handleChange('partySize', e.target.value)}
                  min="1"
                  max="12"
                  icon="Users"
                  required
                />

                <Input
                  label="Date & Time *"
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => handleChange('dateTime', e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  icon="Calendar"
                  required
                />

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Special Requests
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Any special requests or notes..."
                    rows="3"
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    className="flex-1"
                  >
                    {reservation ? 'Update' : 'Create'} Reservation
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReservationModal;