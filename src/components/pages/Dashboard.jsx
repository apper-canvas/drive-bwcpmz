import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import tableService from '@/services/api/tableService';
import reservationService from '@/services/api/reservationService';
import orderService from '@/services/api/orderService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import DashboardStats from '@/components/organisms/DashboardStats';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';

const Dashboard = () => {
  const [data, setData] = useState({
    tables: [],
    reservations: [],
    orders: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
              onClick={() => {}}
            >
              Add New Reservation
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              icon="Users"
              onClick={() => {}}
            >
              Seat Walk-in Guests
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              icon="ClipboardList"
              onClick={() => {}}
            >
              View Active Orders
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              icon="BarChart3"
              onClick={() => {}}
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
    </div>
  );
};

export default Dashboard;