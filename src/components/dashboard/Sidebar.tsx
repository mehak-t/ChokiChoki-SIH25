import { Home, Calendar, BarChart3, Settings, FileText } from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', icon: Home, active: true },
  { name: 'Schedule Planner', icon: Calendar, active: false },
  { name: 'Readiness Ranking', icon: BarChart3, active: false },
  { name: 'Constraints', icon: Settings, active: false },
  { name: 'Reports', icon: FileText, active: false }
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
          <div
            key={item.name}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
              item.active ? 'font-medium' : ''
            }`}
            style={{
              backgroundColor: item.active ? 'var(--status-green)' : 'transparent',
              color: item.active ? 'white' : 'var(--text-primary)'
            }}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-sm">{item.name}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}