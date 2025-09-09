// This assumes you have React Router set up in your project.
import { Home, Calendar, BarChart3, Settings, FileText, Database } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navigationItems = [
  { name: 'Dashboard', icon: Home, path: '/' },
  { name: 'Schedule Planner', icon: Calendar, path: '/schedule' },
  { name: 'Readiness Ranking', icon: BarChart3, path: '/ranking' },
  { name: 'Constraints', icon: Settings, path: '/constraints' },
  { name: 'Reports', icon: FileText, path: '/reports' },
  { name: 'Databases', icon: Database, path: '/databases' } // Add this line
];

export default function Sidebar() {
  return (
    <div 
      className="w-64 p-4 border-r"
      style={{ 
        backgroundColor: 'var(--sidebar-bg, var(--bg-secondary))',
        borderColor: 'var(--border-color)'
      }}
    >
      {/* Logo */}
      <div className="mb-8">
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Kochi Metro
        </h2>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive ? 'font-medium' : ''
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--status-green)' : 'transparent',
              color: isActive ? 'white' : 'var(--text-primary)'
            })}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}