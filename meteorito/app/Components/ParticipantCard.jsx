// components/ParticipantCard.jsx
import React from 'react';
import { Rocket, GraduationCap, Shield, FlaskConical, Compass, Telescope } from 'lucide-react';

// Mapeo de nombres de íconos a componentes de Lucide
const iconMap = {
  Rocket: Rocket,
  GraduationCap: GraduationCap,
  Shield: Shield,
  FlaskConical: FlaskConical,
  Compass: Compass,
  Telescope: Telescope,
};

const ParticipantCard = ({ participant }) => {
  const { name, role, description, score, icon, color } = participant;
  const IconComponent = iconMap[icon];

  // Clases dinámicas de Tailwind basadas en el color
  const colorClasses = {
    amber: "from-amber-500 to-amber-700 shadow-amber-500/50",
    blue: "from-blue-500 to-blue-700 shadow-blue-500/50",
    green: "from-green-500 to-green-700 shadow-green-500/50",
    violet: "from-violet-500 to-violet-700 shadow-violet-500/50",
    pink: "from-pink-500 to-pink-700 shadow-pink-500/50",
    indigo: "from-indigo-500 to-indigo-700 shadow-indigo-500/50",
  }[color];
  
  const textColorClass = `text-${color}-400`;

  return (
    <div className="group relative p-6 bg-slate-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-gray-500/20">
      <div className="relative z-10">
        <div className={`w-14 h-14 bg-gradient-to-br ${colorClasses} rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform duration-500 shadow-lg`}>
          {IconComponent && <IconComponent className="w-7 h-7 text-white" />}
        </div>
        <h3 className="text-xl font-bold text-white mb-1 text-center">{name}</h3>
        <p className={`text-sm font-semibold mb-3 text-center ${textColorClass}`}>{role}</p>
        <p className="text-gray-300 text-sm leading-relaxed mb-4 text-center">{description}</p>
        
        {/* Marcador de Concurso */}
       
      </div>
    </div>
  );
};

export default ParticipantCard;