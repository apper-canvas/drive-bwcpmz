import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import orderService from '@/services/api/orderService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import OrderCard from '@/components/molecules/OrderCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await orderService.getAll();
      setOrders(result);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const updatedOrder = await orderService.updateStatus(orderId, newStatus);
      setOrders(prev => prev.map(order => 
        order.Id === orderId ? updatedOrder : order
      ));
      toast.success(`Order updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const getFilteredOrders = () => {
    if (statusFilter === 'all') return orders;
    return orders.filter(order => order.status === statusFilter);
  };

  const getOrderStats = () => {
    const stats = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      acc.total += 1;
      return acc;
    }, { total: 0, ordered: 0, preparing: 0, ready: 0, served: 0, completed: 0 });
    
    return stats;
  };

  const statusOptions = [
    { value: 'all', label: 'All Orders', icon: 'List' },
    { value: 'ordered', label: 'Ordered', icon: 'Clock' },
    { value: 'preparing', label: 'Preparing', icon: 'ChefHat' },
    { value: 'ready', label: 'Ready', icon: 'CheckCircle' },
    { value: 'served', label: 'Served', icon: 'Utensils' }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-heading font-bold">Orders</h1>
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
          onRetry={loadOrders}
        />
      </div>
    );
  }

  const filteredOrders = getFilteredOrders();
  const stats = getOrderStats();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Orders</h1>
          <p className="text-gray-600">Track and manage customer orders</p>
        </div>
        <Button icon="RefreshCw" onClick={loadOrders}>
          Refresh
        </Button>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <ApperIcon name="List" className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-lg font-bold">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
              <ApperIcon name="Clock" className="w-4 h-4 text-warning" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Ordered</p>
              <p className="text-lg font-bold">{stats.ordered}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-info/10 rounded-full flex items-center justify-center">
              <ApperIcon name="ChefHat" className="w-4 h-4 text-info" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Preparing</p>
              <p className="text-lg font-bold">{stats.preparing}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Ready</p>
              <p className="text-lg font-bold">{stats.ready}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-500/10 rounded-full flex items-center justify-center">
              <ApperIcon name="Utensils" className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Served</p>
              <p className="text-lg font-bold">{stats.served}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusOptions.map((option) => (
          <Button
            key={option.value}
            variant={statusFilter === option.value ? 'primary' : 'ghost'}
            size="sm"
            icon={option.icon}
            onClick={() => setStatusFilter(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <EmptyState 
          icon="ClipboardList"
          title={statusFilter === 'all' ? 'No orders found' : `No ${statusFilter} orders`}
          description={statusFilter === 'all' ? 'Orders will appear here when customers place them' : `No orders with ${statusFilter} status`}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <OrderCard
                order={order}
                onUpdateStatus={handleUpdateStatus}
                onViewDetails={() => {}}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;