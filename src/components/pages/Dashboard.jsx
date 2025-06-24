import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import tableService from "@/services/api/tableService";
import orderService from "@/services/api/orderService";
import reservationService from "@/services/api/reservationService";
import ApperIcon from "@/components/ApperIcon";
import Orders from "@/components/pages/Orders";
import SkeletonLoader from "@/components/molecules/SkeletonLoader";
import ErrorState from "@/components/molecules/ErrorState";
import ReservationModal from "@/components/organisms/ReservationModal";
import DashboardStats from "@/components/organisms/DashboardStats";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    tables: [],
    reservations: [],
    orders: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [walkInModalOpen, setWalkInModalOpen] = useState(false);
  const [walkInData, setWalkInData] = useState({
    customerName: '',
    partySize: 2,
    notes: ''
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tables, reservations, orders] = await Promise.all([
        tableService.getAll(),
        reservationService.getByDate(format(new Date(), 'yyyy-MM-dd')),
        orderService.getAll()
      ]);
      
      setData({ tables, reservations, orders });
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const { tables, reservations, orders } = data;
    
    const occupiedTables = tables.filter(t => t.status === 'occupied').length;
    const totalTables = tables.length;
    const occupancyRate = totalTables > 0 ? Math.round((occupiedTables / totalTables) * 100) : 0;
    
    const completedOrders = orders.filter(o => o.status === 'completed');
    const dailyRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
    
    const coversServed = completedOrders.reduce((sum, order) => {
      const table = tables.find(t => t.Id.toString() === order.tableId);
      return sum + (table?.currentPartySize || 0);
    }, 0);
    
    // Calculate average turnover time (simplified)
    const avgTurnoverTime = 45; // minutes - would be calculated from actual data
    
    return {
      occupancyRate,
      avgTurnoverTime,
      dailyRevenue,
      coversServed
    };
  };

  const getRecentActivity = () => {
    const { reservations, orders } = data;
    const activities = [];
    
    // Add recent reservations
    reservations.slice(0, 3).forEach(reservation => {
      activities.push({
        id: `res-${reservation.Id}`,
        type: 'reservation',
        title: `Reservation: ${reservation.customerName}`,
        subtitle: `${reservation.partySize} guests at ${format(new Date(reservation.dateTime), 'h:mm a')}`,
        icon: 'Calendar',
        time: reservation.dateTime
      });
    });
    
    // Add recent orders
    orders.slice(0, 3).forEach(order => {
      activities.push({
        id: `ord-${order.Id}`,
        type: 'order',
        title: `Order: Table ${order.tableId}`,
        subtitle: `$${order.total.toFixed(2)} - ${order.status}`,
        icon: 'ClipboardList',
        time: order.createdAt
      });
    });
    
return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
  };

  const handleCreateReservation = async (reservationData) => {
    try {
      await reservationService.create(reservationData);
      toast.success('Reservation created successfully');
      setReservationModalOpen(false);
      loadDashboardData(); // Refresh data
    } catch (error) {
      toast.error('Failed to create reservation');
      throw error;
    }
  };

  const handleSeatWalkIn = async () => {
    if (!walkInData.customerName || !walkInData.partySize) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Find available table that can accommodate the party
      const availableTable = data.tables.find(t => 
        t.status === 'available' && t.capacity >= parseInt(walkInData.partySize)
      );
      
      if (!availableTable) {
        toast.error('No available tables for this party size');
        return;
      }

      // Update table status
      await tableService.updateStatus(availableTable.Id, 'occupied', {
        currentPartySize: parseInt(walkInData.partySize)
      });

      // Create reservation record for walk-in
      await reservationService.create({
        customerName: walkInData.customerName,
        phone: 'Walk-in',
        partySize: parseInt(walkInData.partySize),
        dateTime: new Date().toISOString(),
        notes: walkInData.notes,
        status: 'seated',
        tableId: availableTable.Id.toString()
      });

      toast.success(`Walk-in guests seated at Table ${availableTable.number}`);
      setWalkInModalOpen(false);
      setWalkInData({ customerName: '', partySize: 2, notes: '' });
      loadDashboardData(); // Refresh data
    } catch (error) {
      toast.error('Failed to seat walk-in guests');
    }
  };

const handleWalkInChange = (field, value) => {
    setWalkInData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-heading font-bold">Dashboard</h1>
        </div>
        <SkeletonLoader count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          message={error}
          onRetry={loadDashboardData}
        />
      </div>
    );
  }

  const stats = calculateStats();
  const recentActivity = getRecentActivity();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Dashboard</h1>
          <p className="text-gray-600">Restaurant performance overview for {format(new Date(), 'MMM d, yyyy')}</p>
        </div>
        <Button icon="RefreshCw" onClick={loadDashboardData}>
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="mb-8">
        <DashboardStats stats={stats} />
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold">Recent Activity</h2>
            <ApperIcon name="Activity" className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent activity</p>
            ) : (
              recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <ApperIcon name={activity.icon} className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.subtitle}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(activity.time), 'h:mm a')}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold">Quick Actions</h2>
            <ApperIcon name="Zap" className="w-5 h-5 text-gray-400" />
</div>
          
          <div className="space-y-3">
            <Button 
              variant="outline"
              className="w-full justify-start" 
              icon="Calendar"
              onClick={() => setReservationModalOpen(true)}
            >
              Add New Reservation
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              icon="Users"
              onClick={() => setWalkInModalOpen(true)}
            >
              Seat Walk-in Guests
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              icon="ClipboardList"
              onClick={() => navigate('/orders')}
            >
              View Active Orders
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              icon="BarChart3"
              onClick={() => toast.info('Report generation feature coming soon!')}
            >
              Generate Report
            </Button>
          </div>
        </Card>
      </div>

      {/* Table Status Overview */}
      <div className="mt-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold">Table Status Overview</h2>
            <ApperIcon name="Grid3X3" className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['available', 'occupied', 'reserved', 'cleaning'].map((status) => {
              const count = data.tables.filter(t => t.status === status).length;
              const statusConfig = {
                available: { color: 'text-success', bg: 'bg-success/10', icon: 'Check' },
                occupied: { color: 'text-warning', bg: 'bg-warning/10', icon: 'Users' },
                reserved: { color: 'text-info', bg: 'bg-info/10', icon: 'Clock' },
                cleaning: { color: 'text-gray-600', bg: 'bg-gray-100', icon: 'Sparkles' }
              };
              
              return (
                <div key={status} className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${statusConfig[status].bg}`}>
                    <ApperIcon name={statusConfig[status].icon} className={`w-6 h-6 ${statusConfig[status].color}`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-sm text-gray-600 capitalize">{status}</p>
                </div>
              );
            })}
</div>
        </Card>
      </div>
      {/* Reservation Modal */}
      <ReservationModal
        isOpen={reservationModalOpen}
        onClose={() => setReservationModalOpen(false)}
        onSubmit={handleCreateReservation}
        availableTables={data.tables.filter(t => t.status === 'available')}
      />

      {/* Walk-in Modal */}
      {walkInModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setWalkInModalOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-48%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-48%' }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <Card className="p-6 m-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-bold">Seat Walk-in Guests</h2>
                <button
                  onClick={() => setWalkInModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <Input
                  label="Customer Name *"
                  value={walkInData.customerName}
                  onChange={(e) => handleWalkInChange('customerName', e.target.value)}
                  placeholder="Enter customer name"
                  icon="User"
                  required
                />

                <Input
                  label="Party Size *"
                  type="number"
                  value={walkInData.partySize}
                  onChange={(e) => handleWalkInChange('partySize', e.target.value)}
                  min="1"
                  max="12"
                  icon="Users"
                  required
                />

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Special Requests
                  </label>
                  <textarea
                    value={walkInData.notes}
                    onChange={(e) => handleWalkInChange('notes', e.target.value)}
                    placeholder="Any special requests or notes..."
                    rows="3"
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Available Tables</h3>
                  <div className="text-sm text-gray-600">
                    {data.tables.filter(t => t.status === 'available' && t.capacity >= parseInt(walkInData.partySize || 1)).length} 
                    {' '}table(s) available for party of {walkInData.partySize || 1}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setWalkInModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleSeatWalkIn}
                    className="flex-1"
                  >
                    Seat Guests
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
  );
};

export default Dashboard;