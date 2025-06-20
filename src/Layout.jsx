import { Outlet, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routeArray } from '@/config/routes';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-secondary border-b z-40">
        <div className="flex items-center space-x-3">
          <ApperIcon name="ChefHat" className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-heading font-bold text-white">TableFlow</h1>
        </div>
        <button
          onClick={toggleMobileMenu}
          className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-secondary flex-col">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <ApperIcon name="ChefHat" className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-heading font-bold text-white">TableFlow</h1>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {routeArray.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <ApperIcon name={route.icon} className="w-5 h-5" />
                <span className="font-medium">{route.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={toggleMobileMenu}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "tween", duration: 0.3 }}
                className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-secondary z-50"
              >
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="ChefHat" className="w-8 h-8 text-primary" />
                    <h1 className="text-xl font-heading font-bold text-white">TableFlow</h1>
                  </div>
                </div>
                
                <nav className="p-4 space-y-2">
                  {routeArray.map((route) => (
                    <NavLink
                      key={route.id}
                      to={route.path}
                      onClick={toggleMobileMenu}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-primary text-white shadow-lg'
                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                        }`
                      }
                    >
                      <ApperIcon name={route.icon} className="w-5 h-5" />
                      <span className="font-medium">{route.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;