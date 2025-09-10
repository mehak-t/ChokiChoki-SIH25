// src/components/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import IntroSplash from '@/components/ui/IntroSplash';

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
    <>
    <IntroSplash />
   <div className="min-h-screen flex items-center justify-center" 
     style={{ backgroundColor: 'var(--bg-primary)' }}>
  <div className="w-full max-w-md">
    {/* Logo and Title Section */}
    <div className="text-center mb-8">
      {/* The src path is now updated to your new folder structure */}
      <img 
        src="/images/logo.jpg" 
        alt="Kochi Metro Rail Limited Logo" 
        className="h-20 mx-auto mb-4"
      />
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
        Login
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Operations Control Center Access
      </p>
    </div>

   {/* Login Card */}
<form className="bg-white p-8 rounded-lg shadow-lg" onSubmit={handleLogin}>
  <h2 className="text-xl font-semibold mb-6 text-center">Secure Login</h2>

  {/* Supervisor ID Field */}
  <div className="mb-4">
    <label htmlFor="supervisor-id" className="block text-gray-700 text-sm font-bold mb-2">
      Supervisor ID
    </label>
    <input
      type="text"
      id="supervisor-id"
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      // Add value and onChange to control the input
      value={supervisorId}
      onChange={(e) => setSupervisorId(e.target.value)}
    />
  </div>

  {/* Password Field */}
  <div className="mb-6">
    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
      Password
    </label>
    <input
      type="password"
      id="password"
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
      // Add value and onChange to control the input
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
  </div>

  {/* Secure Login Button - Changed type to "submit" */}
  <button
  className="w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
  style={{ backgroundColor: '#00b8e6'}}
  type="submit"
>
  Secure Login
</button>

  {/* Authorized Personnel Only Text */}
  <p className="text-center text-gray-500 text-xs mt-6">
    Authorized Personnel Only
  </p>
</form>
  </div>
</div>
    </>
  );
}