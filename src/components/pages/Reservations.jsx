import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, startOfDay, endOfDay } from 'date-fns';
import reservationService from '@/services/api/reservationService';
import tableService from '@/services/api/tableService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ReservationCard from '@/components/molecules/ReservationCard';
import ReservationModal from '@/components/organisms/ReservationModal';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);

  useEffect(() => {
    loadReservations();
    loadTables();
  }, [selectedDate]);

  const loadReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await reservationService.getByDate(selectedDate);
      setReservations(result);
    } catch (err) {
      setError(err.message || 'Failed to load reservations');
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const loadTables = async () => {
    try {
      const result = await tableService.getAll();
      setTables(result);
    } catch (err) {
      console.error('Failed to load tables:', err);
    }
  };

  const handleCreateReservation = async (reservationData) => {
    try {
      const newReservation = await reservationService.create(reservationData);
      setReservations(prev => [...prev, newReservation]);
      setModalOpen(false);
    } catch (error) {
      throw new Error('Failed to create reservation');
    }
  };

  const handleUpdateReservation = async (reservationData) => {
    try {
      const updatedReservation = await reservationService.update(editingReservation.Id, reservationData);
      setReservations(prev => prev.map(r => 
        r.Id === editingReservation.Id ? updatedReservation : r
      ));
      setEditingReservation(null);
      setModalOpen(false);
    } catch (error) {
      throw new Error('Failed to update reservation');
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;
    
    try {
      await reservationService.update(reservationId, { status: 'cancelled' });
      setReservations(prev => prev.map(r => 
        r.Id === reservationId ? { ...r, status: 'cancelled' } : r
      ));
      toast.success('Reservation cancelled');
    } catch (error) {
      toast.error('Failed to cancel reservation');
    }
  };

  const handleSeatGuests = async (reservation) => {
    try {
      // Find available table that can accommodate the party
      const availableTable = tables.find(t => 
        t.status === 'available' && t.capacity >= reservation.partySize
      );
      
      if (!availableTable) {
        toast.error('No available tables for this party size');
        return;
      }

      // Update table status
      await tableService.updateStatus(availableTable.Id, 'occupied', {
        currentPartySize: reservation.partySize
      });

      // Update reservation status
      await reservationService.update(reservation.Id, { 
        status: 'seated',
        tableId: availableTable.Id.toString()
      });

      setReservations(prev => prev.map(r => 
        r.Id === reservation.Id ? { ...r, status: 'seated', tableId: availableTable.Id.toString() } : r
      ));

      toast.success(`Guests seated at Table ${availableTable.number}`);
    } catch (error) {
      toast.error('Failed to seat guests');
    }
  };

  const openEditModal = (reservation) => {
    setEditingReservation(reservation);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingReservation(null);
  };

  const getReservationStats = () => {
    const total = reservations.length;
    const confirmed = reservations.filter(r => r.status === 'confirmed').length;
    const pending = reservations.filter(r => r.status === 'pending').length;
    const seated = reservations.filter(r => r.status === 'seated').length;
    
    return { total, confirmed, pending, seated };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-heading font-bold">Reservations</h1>
        </div>
        <SkeletonLoader count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          message={error}
          onRetry={loadReservations}
        />
      </div>
    );
  }

  const stats = getReservationStats();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Reservations</h1>
          <p className="text-gray-600">Manage customer reservations and seating</p>
        </div>
        <Button icon="Plus" onClick={() => setModalOpen(true)}>
          New Reservation
        </Button>
      </div>

      {/* Date Selector and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-1">
          <Input
            type="date"
            label="Select Date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            icon="Calendar"
          />
        </div>
        
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <ApperIcon name="Calendar" className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-lg font-bold">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                <ApperIcon name="Check" className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-lg font-bold">{stats.confirmed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-info/10 rounded-full flex items-center justify-center">
                <ApperIcon name="Users" className="w-4 h-4 text-info" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Seated</p>
                <p className="text-lg font-bold">{stats.seated}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reservations List */}
      {reservations.length === 0 ? (
        <EmptyState 
          icon="Calendar"
          title="No reservations found"
          description={`No reservations scheduled for ${format(new Date(selectedDate), 'MMM d, yyyy')}`}
          actionLabel="Create Reservation"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((reservation, index) => (
            <motion.div
              key={reservation.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ReservationCard
                reservation={reservation}
                onEdit={() => openEditModal(reservation)}
                onCancel={() => handleCancelReservation(reservation.Id)}
                onSeat={() => handleSeatGuests(reservation)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Reservation Modal */}
      <ReservationModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={editingReservation ? handleUpdateReservation : handleCreateReservation}
        reservation={editingReservation}
        availableTables={tables.filter(t => t.status === 'available')}
      />
    </div>
  );
};

export default Reservations;