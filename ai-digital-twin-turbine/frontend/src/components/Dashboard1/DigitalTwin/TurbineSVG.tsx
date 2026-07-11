import React from 'react';
import { motion } from 'framer-motion';
import { AffectedComponent } from '../../../types';

interface TurbineSVGProps {
  affectedComponents: AffectedComponent[];
  getComponentColor: (status: string) => string;
}

const TurbineSVG: React.FC<TurbineSVGProps> = ({ affectedComponents, getComponentColor }) => {
  const getComponentStatus = (componentId: string) => {
    return affectedComponents.find(c => c.id === componentId)?.status || 'healthy';
  };

  return (
    <svg
      viewBox="0 0 800 400"
      style={{ width: '100%', height: '100%' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bladeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1F2937" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#1F2937" stopOpacity="0.4" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Base/Condenser */}
      <rect
        x="50"
        y="280"
        width="700"
        height="80"
        rx="8"
        fill={getComponentColor(getComponentStatus('condenser'))}
        opacity="0.2"
        stroke={getComponentColor(getComponentStatus('condenser'))}
        strokeWidth="2"
      />

      {/* Main Casing */}
      <path
        d="M 150 200 L 650 200 L 650 280 L 150 280 Z"
        fill={getComponentColor(getComponentStatus('casing'))}
        opacity="0.15"
        stroke={getComponentColor(getComponentStatus('casing'))}
        strokeWidth="3"
      />

      {/* Bearing Left */}
      <circle
        cx="180"
        cy="240"
        r="25"
        fill={getComponentColor(getComponentStatus('bearing'))}
        opacity="0.3"
        stroke={getComponentColor(getComponentStatus('bearing'))}
        strokeWidth="3"
      />

      {/* Bearing Right */}
      <circle
        cx="620"
        cy="240"
        r="25"
        fill={getComponentColor(getComponentStatus('bearing'))}
        opacity="0.3"
        stroke={getComponentColor(getComponentStatus('bearing'))}
        strokeWidth="3"
      />

      {/* Rotor Shaft */}
      <rect
        x="150"
        y="230"
        width="500"
        height="20"
        rx="10"
        fill={getComponentColor(getComponentStatus('rotor'))}
        stroke={getComponentColor(getComponentStatus('rotor'))}
        strokeWidth="2"
      />

      {/* Rotor Assembly - Center */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        style={{ originX: 0.5, originY: 0.5 }}
      >
        <circle
          cx="400"
          cy="240"
          r="60"
          fill={getComponentColor(getComponentStatus('rotor'))}
          opacity="0.25"
          stroke={getComponentColor(getComponentStatus('rotor'))}
          strokeWidth="3"
        />
        
        {/* Rotor Blades */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <motion.g
            key={i}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{ originX: 400, originY: 240 }}
          >
            <path
              d={`M 400 240 L ${400 + 50 * Math.cos((angle * Math.PI) / 180)} ${240 + 50 * Math.sin((angle * Math.PI) / 180)}`}
              stroke={getComponentColor(getComponentStatus('blades'))}
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.8"
            />
          </motion.g>
        ))}
      </motion.g>

      {/* Seals */}
      <circle
        cx="200"
        cy="240"
        r="8"
        fill={getComponentColor(getComponentStatus('seals'))}
        stroke={getComponentColor(getComponentStatus('seals'))}
        strokeWidth="2"
      />
      <circle
        cx="600"
        cy="240"
        r="8"
        fill={getComponentColor(getComponentStatus('seals'))}
        stroke={getComponentColor(getComponentStatus('seals'))}
        strokeWidth="2"
      />

      {/* Governor */}
      <g transform="translate(700, 200)">
        <circle
          cx="0"
          cy="0"
          r="30"
          fill={getComponentColor(getComponentStatus('governor'))}
          opacity="0.2"
          stroke={getComponentColor(getComponentStatus('governor'))}
          strokeWidth="2"
        />
        <motion.path
          d="M -15 0 L 15 0 M 0 -15 L 0 15"
          stroke={getComponentColor(getComponentStatus('governor'))}
          strokeWidth="2"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ originX: 0, originY: 0 }}
        />
      </g>

      {/* Lubrication System */}
      <g transform="translate(100, 150)">
        <circle
          cx="0"
          cy="0"
          r="25"
          fill={getComponentColor(getComponentStatus('lubrication'))}
          opacity="0.25"
          stroke={getComponentColor(getComponentStatus('lubrication'))}
          strokeWidth="2"
        />
        <path
          d="M -10 5 Q 0 -5 10 5"
          fill="none"
          stroke={getComponentColor(getComponentStatus('lubrication'))}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Connection Lines */}
      <path
        d="M 100 175 L 100 240"
        stroke={getComponentColor(getComponentStatus('lubrication'))}
        strokeWidth="2"
        strokeDasharray="4 4"
        opacity="0.5"
      />

      {/* Labels */}
      <text x="400" y="180" textAnchor="middle" fill="var(--color-carbon)" fontSize="14" fontWeight="600">
        TURBINE ASSEMBLY
      </text>
      <text x="180" y="320" textAnchor="middle" fill="var(--color-gray)" fontSize="10">
        Bearing
      </text>
      <text x="620" y="320" textAnchor="middle" fill="var(--color-gray)" fontSize="10">
        Bearing
      </text>
      <text x="400" y="320" textAnchor="middle" fill="var(--color-gray)" fontSize="10">
        Rotor
      </text>
    </svg>
  );
};

export default TurbineSVG;