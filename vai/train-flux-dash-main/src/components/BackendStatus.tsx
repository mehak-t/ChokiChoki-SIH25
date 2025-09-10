import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { Wifi, WifiOff } from 'lucide-react';

export function BackendStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [aiStatus, setAiStatus] = useState<any>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await apiService.getAiStatus();
        setAiStatus(status);
        setIsConnected(true);
      } catch (error) {
        console.error('Backend connection failed:', error);
        setIsConnected(false);
        setAiStatus(null);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  if (isConnected === null) {
    return (
      <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
        <span>Checking backend...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-sm">
      {isConnected ? (
        <>
          <Wifi className="h-4 w-4 text-green-500" />
          <span style={{ color: 'var(--text-primary)' }}>Backend Connected</span>
          {aiStatus?.ai_enabled && (
            <div className="ml-2 px-2 py-1 rounded text-xs bg-green-100 text-green-800">
              AI Enhanced
            </div>
          )}
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-red-500" />
          <span style={{ color: 'var(--text-primary)' }}>Backend Offline</span>
          <div className="ml-2 px-2 py-1 rounded text-xs bg-red-100 text-red-800">
            Using Fallback Data
          </div>
        </>
      )}
    </div>
  );
}
