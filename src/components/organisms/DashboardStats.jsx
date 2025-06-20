import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      id: 'occupancy',
      label: 'Occupancy Rate',
      value: `${stats.occupancyRate}%`,
      icon: 'Users',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      id: 'turnover',
      label: 'Avg Turnover',
      value: `${stats.avgTurnoverTime}min`,
      icon: 'Clock',
      color: 'text-info',
      bgColor: 'bg-info/10'
    },
    {
      id: 'revenue',
      label: 'Daily Revenue',
      value: `$${stats.dailyRevenue.toLocaleString()}`,
      icon: 'DollarSign',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      id: 'covers',
      label: 'Covers Served',
      value: stats.coversServed,
      icon: 'Utensils',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
                <ApperIcon name={stat.icon} className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;