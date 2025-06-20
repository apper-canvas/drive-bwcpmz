import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import tableService from '@/services/api/tableService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import TableCard from '@/components/molecules/TableCard';
import TableStatusPanel from '@/components/organisms/TableStatusPanel';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';

const FloorView = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [statusPanelOpen, setStatusPanelOpen] = useState(false);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await tableService.getAll();
      setTables(result);
    } catch (err) {
      setError(err.message || 'Failed to load tables');
      toast.error('Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  const handleTableClick = (table) => {
    setSelectedTable(table);
    setStatusPanelOpen(true);
  };

  const handleUpdateStatus = async (tableId, status, additionalData = {}) => {
    try {
      const updatedTable = await tableService.updateStatus(tableId, status, additionalData);
      setTables(prev => prev.map(table => 
        table.Id === tableId ? updatedTable : table
      ));
      return updatedTable;
    } catch (error) {
      throw new Error('Failed to update table status');
    }
  };

  const getStatusCounts = () => {
    const counts = tables.reduce((acc, table) => {
      acc[table.status] = (acc[table.status] || 0) + 1;
      return acc;
    }, {});
    return {
      available: counts.available || 0,
      occupied: counts.occupied || 0,
      reserved: counts.reserved || 0,
      cleaning: counts.cleaning || 0
    };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-heading font-bold">Floor View</h1>
        </div>
        <SkeletonLoader count={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          message={error}
          onRetry={loadTables}
        />
      </div>
    );
  }

  if (tables.length === 0) {
    return (
      <div className="p-6">
        <EmptyState 
          icon="Grid3X3"
          title="No tables configured"
          description="Set up your restaurant floor plan to get started"
          actionLabel="Add Tables"
          onAction={() => {}}
        />
      </div>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Floor View</h1>
          <p className="text-gray-600">Manage your restaurant tables and seating</p>
        </div>
        <Button icon="RefreshCw" onClick={loadTables}>
          Refresh
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
              <ApperIcon name="Check" className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-lg font-bold">{statusCounts.available}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
              <ApperIcon name="Users" className="w-4 h-4 text-warning" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Occupied</p>
              <p className="text-lg font-bold">{statusCounts.occupied}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-info/10 rounded-full flex items-center justify-center">
              <ApperIcon name="Clock" className="w-4 h-4 text-info" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Reserved</p>
              <p className="text-lg font-bold">{statusCounts.reserved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <ApperIcon name="Sparkles" className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Cleaning</p>
              <p className="text-lg font-bold">{statusCounts.cleaning}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floor Plan Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tables.map((table, index) => (
          <motion.div
            key={table.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <TableCard
              table={table}
              onClick={() => handleTableClick(table)}
            />
          </motion.div>
        ))}
      </div>

      {/* Table Status Panel */}
      <TableStatusPanel
        table={selectedTable}
        onUpdateStatus={handleUpdateStatus}
        onClose={() => setStatusPanelOpen(false)}
        isOpen={statusPanelOpen}
      />
    </div>
  );
};

export default FloorView;