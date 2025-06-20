import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';

const Settings = () => {
  const [restaurantSettings, setRestaurantSettings] = useState({
    name: 'TableFlow Restaurant',
    address: '123 Main Street, City, State 12345',
    phone: '(555) 123-4567',
    email: 'info@tableflowrestaurant.com',
    capacity: 8,
    openTime: '11:00',
    closeTime: '22:00'
  });

  const [operationalSettings, setOperationalSettings] = useState({
    turnoverTime: 90,
    reservationBuffer: 15,
    maxPartySize: 12,
    autoCleanTime: 10
  });

  const [loading, setLoading] = useState(false);

  const handleRestaurantChange = (field, value) => {
    setRestaurantSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleOperationalChange = (field, value) => {
    setOperationalSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const settingsSections = [
    {
      id: 'restaurant',
      title: 'Restaurant Information',
      icon: 'Store',
      description: 'Basic restaurant details and contact information'
    },
    {
      id: 'operational',
      title: 'Operational Settings',
      icon: 'Settings',
      description: 'Configure timing and capacity settings'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'Bell',
      description: 'Manage alert and notification preferences'
    },
    {
      id: 'staff',
      title: 'Staff Management',
      icon: 'Users',
      description: 'Manage staff accounts and permissions'
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Settings</h1>
          <p className="text-gray-600">Configure your restaurant settings and preferences</p>
        </div>
        <Button 
          icon="Save" 
          onClick={handleSaveSettings}
          loading={loading}
        >
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h2 className="font-heading font-semibold mb-4">Settings</h2>
            <nav className="space-y-2">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ApperIcon name={section.icon} className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{section.title}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Restaurant Information */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Store" className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-heading font-semibold">Restaurant Information</h2>
                <p className="text-sm text-gray-600">Basic restaurant details and contact information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Restaurant Name"
                value={restaurantSettings.name}
                onChange={(e) => handleRestaurantChange('name', e.target.value)}
                icon="Store"
              />
              
              <Input
                label="Phone Number"
                value={restaurantSettings.phone}
                onChange={(e) => handleRestaurantChange('phone', e.target.value)}
                icon="Phone"
              />
              
              <div className="md:col-span-2">
                <Input
                  label="Address"
                  value={restaurantSettings.address}
                  onChange={(e) => handleRestaurantChange('address', e.target.value)}
                  icon="MapPin"
                />
              </div>
              
              <Input
                label="Email"
                type="email"
                value={restaurantSettings.email}
                onChange={(e) => handleRestaurantChange('email', e.target.value)}
                icon="Mail"
              />
              
              <Input
                label="Total Tables"
                type="number"
                value={restaurantSettings.capacity}
                onChange={(e) => handleRestaurantChange('capacity', e.target.value)}
                icon="Grid3X3"
              />
            </div>
          </Card>

          {/* Operational Settings */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Settings" className="w-5 h-5 text-info" />
              </div>
              <div>
                <h2 className="text-lg font-heading font-semibold">Operational Settings</h2>
                <p className="text-sm text-gray-600">Configure timing and capacity settings</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Average Turnover Time (minutes)"
                type="number"
                value={operationalSettings.turnoverTime}
                onChange={(e) => handleOperationalChange('turnoverTime', e.target.value)}
                icon="Clock"
              />
              
              <Input
                label="Reservation Buffer (minutes)"
                type="number"
                value={operationalSettings.reservationBuffer}
                onChange={(e) => handleOperationalChange('reservationBuffer', e.target.value)}
                icon="Calendar"
              />
              
              <Input
                label="Maximum Party Size"
                type="number"
                value={operationalSettings.maxPartySize}
                onChange={(e) => handleOperationalChange('maxPartySize', e.target.value)}
                icon="Users"
              />
              
              <Input
                label="Auto-Clean Time (minutes)"
                type="number"
                value={operationalSettings.autoCleanTime}
                onChange={(e) => handleOperationalChange('autoCleanTime', e.target.value)}
                icon="Sparkles"
              />
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h2 className="text-lg font-heading font-semibold">Quick Actions</h2>
                <p className="text-sm text-gray-600">Manage your restaurant data and settings</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                icon="Download"
                onClick={() => toast.info('Export feature coming soon')}
              >
                Export Data
              </Button>
              
              <Button 
                variant="outline" 
                icon="Upload"
                onClick={() => toast.info('Import feature coming soon')}
              >
                Import Data
              </Button>
              
              <Button 
                variant="outline" 
                icon="RotateCcw"
                onClick={() => toast.info('Backup feature coming soon')}
              >
                Backup Settings
              </Button>
              
              <Button 
                variant="outline" 
                icon="Trash2"
                onClick={() => toast.info('Reset feature coming soon')}
              >
                Reset to Default
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;