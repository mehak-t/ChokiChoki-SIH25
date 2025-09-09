import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Circle } from 'lucide-react';
import NavigationSidebar from '@/components/NavigationSidebar';

const progressSteps = [
  'Validating fleet data integrity',
  'Applying constraint weights (fitness, maintenance, branding)',
  'Optimizing for operational efficiency and crew availability',
  'Route allocation and timetable alignment',
  'Finalizing schedule and generating insights'
];

export default function Progress() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleLogout = () => {
    navigate('/login');
  };

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = prev + 1;
        if (nextStep <= progressSteps.length) {
          setCompletedSteps(prevCompleted => [...prevCompleted, prev]);
          return nextStep;
        }
        return prev;
      });
    }, 800);

    const navigationTimeout = setTimeout(() => {
      clearInterval(progressInterval);
      navigate('/dashboard');
    }, 4500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(navigationTimeout);
    };
  }, [navigate]);

  const getStepIcon = (index: number) => {
    if (completedSteps.includes(index)) {
      return <CheckCircle className="h-5 w-5" style={{ color: 'var(--status-green)' }} />;
    } else if (index === currentStep) {
      return <Clock className="h-5 w-5" style={{ color: 'var(--accent-orange)' }} />;
    } else {
      return <Circle className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />;
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Navigation Sidebar */}
      <NavigationSidebar currentPage="/progress" onLogout={handleLogout} />
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Running Optimization Engine...
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Processing fleet data and generating optimal induction schedule
          </p>
        </div>

        <div className="card-radius card-shadow p-8" 
             style={{ backgroundColor: 'var(--bg-secondary)' }}>
          
          {/* Loading Spinner */}
          <div className="flex justify-center mb-8">
            <div 
              className="w-16 h-16 border-4 border-solid rounded-full animate-spin"
              style={{ 
                borderColor: 'var(--border-color)',
                borderTopColor: 'var(--accent-orange)'
              }}
            ></div>
          </div>

          {/* Progress Steps */}
          <div className="space-y-4">
            {progressSteps.map((step, index) => (
              <div key={index} className="flex items-center space-x-3">
                {getStepIcon(index)}
                <span 
                  className={`text-sm ${
                    completedSteps.includes(index) 
                      ? 'font-medium' 
                      : index === currentStep 
                        ? 'font-medium' 
                        : ''
                  }`}
                  style={{ 
                    color: completedSteps.includes(index) 
                      ? 'var(--status-green)' 
                      : index === currentStep 
                        ? 'var(--accent-orange)'
                        : 'var(--text-secondary)'
                  }}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-8 pt-6" 
               style={{ borderTop: '1px solid var(--border-color)' }}>
            <button 
              className="button-radius px-6 py-2 text-sm font-medium"
              style={{ 
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)'
              }}
            >
              Cancel
            </button>
            <button 
              className="button-radius px-6 py-2 text-sm font-medium"
              style={{ 
                backgroundColor: 'var(--accent-orange)',
                color: 'white'
              }}
            >
              Run in Background
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Please wait while we optimize your fleet operations...
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}