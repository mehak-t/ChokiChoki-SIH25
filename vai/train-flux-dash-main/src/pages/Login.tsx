// src/components/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
  const [supervisorId, setSupervisorId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login and navigate directly to dashboard (data comes from backend)
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center" 
         style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md">
        {/* Logo and Title Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-800 rounded-lg mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            KMRL Fleet Command
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Operations Control Center Access
          </p>
        </div>

        {/* Login Card */}
        <div className="card-radius card-shadow p-8" 
             style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Secure Login
          </h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="supervisorId" className="text-sm font-medium">
                Supervisor ID
              </Label>
              <Input
                id="supervisorId"
                type="text"
                value={supervisorId}
                onChange={(e) => setSupervisorId(e.target.value)}
                className="mt-1 button-radius"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 button-radius"
                required
              />
            </div>
            
            <Button 
              type="submit"
              className="w-full button-radius font-medium py-3 mt-6"
              style={{ 
                backgroundColor: 'var(--accent-orange)',
                color: 'white'
              }}
            >
              Secure Login
            </Button>
          </form>
          
          <div className="text-center mt-6">
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Authorized Personnel Only
            </p>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            © 2025 Kochi Metro Rail Limited
          </p>
        </div>
      </div>
    </div>
  );
}