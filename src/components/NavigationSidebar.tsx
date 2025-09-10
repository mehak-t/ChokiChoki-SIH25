import { Home, FileText, Database, Upload, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationSidebarProps {
  currentPage?: string;
  onLogout?: () => void;
}

const navigationItems = [
  { name: 'Dashboard', icon: Home, path: '/dashboard' },
  { name: 'Data Ingestion', icon: Upload, path: '/data-ingestion' },
  { name: 'Reports', icon: FileText, path: '/reports' },
  { name: 'Databases', icon: Database, path: '/databases' }
];

export default function NavigationSidebar({ currentPage = '/dashboard', onLogout }: NavigationSidebarProps) {
  return (
    <aside 
      className="w-64 flex flex-col justify-between p-6 border-r"
      style={{ 
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)'
      }}
    >
      <div className="space-y-6">
        {/* Logo and KMRL text */}
        <div className="flex items-center space-x-3">
          <img 
            src="/logo.jpg" 
            alt="KMRL Logo" 
            className="h-10 w-auto" 
          />
          <div className="text-2xl font-bold" style={{ color: '#00b8e6' }}>
            KMRL
          </div>
        </div>
        
        {/* Navigation Items */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.path;
            
            return (
              <a 
                key={item.name}
                href={item.path}
                className="flex items-center space-x-3 p-3 rounded-lg font-medium transition-colors hover:bg-slate-700"
                style={{ 
                  backgroundColor: isActive ? 'var(--bg-primary)' : 'transparent',
                  color: isActive ? '#00b8e6' : 'var(--text-primary)'
                }}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </a>
            );
          })}
        </nav>
      </div>

      {/* Logout button at the bottom */}
      <div className="mt-auto">
        <Button 
          onClick={onLogout}
          className="w-full justify-start space-x-3 p-3 font-medium rounded-lg"
          variant="ghost"
          style={{ color: '#FF073A' }}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}