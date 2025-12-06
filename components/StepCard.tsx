import React from 'react';
import { CheckCircle2, Lock } from 'lucide-react';
import { StepCardProps } from '../types';

export const StepCard: React.FC<StepCardProps> = ({ 
  title, 
  icon: Icon, 
  color, 
  children, 
  isActive, 
  isCompleted,
  onActivate 
}) => {
  // Map color names to Tailwind classes dynamically
  const colorMap = {
    blue: {
      border: 'border-blue-500',
      ring: 'ring-blue-100',
      bg: 'bg-blue-50',
      bgHeader: 'bg-blue-600',
      text: 'text-blue-900',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      pulse: 'bg-blue-500'
    },
    yellow: {
      border: 'border-amber-500',
      ring: 'ring-amber-100',
      bg: 'bg-amber-50',
      bgHeader: 'bg-amber-500',
      text: 'text-amber-900',
      iconBg: 'bg-amber-100',
      iconText: 'text-amber-600',
      pulse: 'bg-amber-500'
    },
    indigo: {
      border: 'border-indigo-500',
      ring: 'ring-indigo-100',
      bg: 'bg-indigo-50',
      bgHeader: 'bg-indigo-600',
      text: 'text-indigo-900',
      iconBg: 'bg-indigo-100',
      iconText: 'text-indigo-600',
      pulse: 'bg-indigo-500'
    },
    purple: {
      border: 'border-purple-500',
      ring: 'ring-purple-100',
      bg: 'bg-purple-50',
      bgHeader: 'bg-purple-600',
      text: 'text-purple-900',
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
      pulse: 'bg-purple-500'
    },
    teal: {
      border: 'border-teal-500',
      ring: 'ring-teal-100',
      bg: 'bg-teal-50',
      bgHeader: 'bg-teal-600',
      text: 'text-teal-900',
      iconBg: 'bg-teal-100',
      iconText: 'text-teal-600',
      pulse: 'bg-teal-500'
    },
    green: {
      border: 'border-green-500',
      ring: 'ring-green-100',
      bg: 'bg-green-50',
      bgHeader: 'bg-green-600',
      text: 'text-green-900',
      iconBg: 'bg-green-100',
      iconText: 'text-green-600',
      pulse: 'bg-green-500'
    },
    red: {
      border: 'border-red-500',
      ring: 'ring-red-100',
      bg: 'bg-red-50',
      bgHeader: 'bg-red-600',
      text: 'text-red-900',
      iconBg: 'bg-red-100',
      iconText: 'text-red-600',
      pulse: 'bg-red-500'
    }
  };

  const theme = colorMap[color];

  // Base classes
  const baseClasses = "relative z-10 w-full bg-white rounded-xl border-l-4 transition-all duration-500 shadow-sm hover:shadow-md overflow-hidden";
  
  // State specific classes
  let stateClasses = "border-gray-200 opacity-60 grayscale-[0.5]"; // Inactive/Future
  
  if (isActive) {
    stateClasses = `${theme.border} ring-4 ${theme.ring} transform scale-[1.02] shadow-xl opacity-100 grayscale-0`;
  } else if (isCompleted) {
    stateClasses = `border-green-500 opacity-90 grayscale-0`;
  }

  return (
    <div 
      className={`${baseClasses} ${stateClasses} mb-12 scroll-mt-24`}
      onClick={!isActive && isCompleted && onActivate ? onActivate : undefined}
    >
      {/* Header */}
      <div className={`p-4 border-b border-gray-100 flex items-center justify-between ${isActive ? theme.bg : 'bg-gray-50'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-full ${isActive ? theme.bgHeader + ' text-white shadow-lg' : 'bg-gray-200 text-gray-500'}`}>
            <Icon size={20} strokeWidth={2.5} />
          </div>
          <div>
             <h3 className={`text-lg font-bold ${isActive ? theme.text : 'text-gray-600'}`}>
              {title}
            </h3>
            {isActive && <span className="text-xs font-semibold uppercase tracking-wider opacity-70">Paso Actual</span>}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isActive && (
            <span className={`flex h-3 w-3`}>
              <span className={`animate-ping absolute inline-flex h-3 w-3 rounded-full ${theme.pulse} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${theme.pulse}`}></span>
            </span>
          )}
          {isCompleted && !isActive && <CheckCircle2 className="text-green-500" size={24} />}
          {!isCompleted && !isActive && <Lock className="text-gray-300" size={20} />}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};
