"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Info, AlertTriangle, Calendar, Gauge, Ruler } from "lucide-react";

interface NEOData {
  id: string;
  name: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    relative_velocity: {
      kilometers_per_second: string;
    };
    miss_distance: {
      astronomical: string;
      kilometers: string;
    };
  }>;
}

interface MeteoriteInfoProps {
  meteorite: NEOData;
}

export default function MeteoriteInfo({ meteorite }: MeteoriteInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const avgDiameter = (meteorite.estimated_diameter.kilometers.estimated_diameter_min + 
                     meteorite.estimated_diameter.kilometers.estimated_diameter_max) / 2;

  const latestApproach = meteorite.close_approach_data[0];
  const velocity = parseFloat(latestApproach.relative_velocity.kilometers_per_second);
  const missDistance = parseFloat(latestApproach.miss_distance.kilometers);

  // Calculate risk level
  const getRiskLevel = () => {
    if (meteorite.is_potentially_hazardous_asteroid) {
      return { level: "ALTO", color: "text-red-400", bgColor: "bg-red-500/20" };
    } else if (avgDiameter > 1) {
      return { level: "MEDIO", color: "text-yellow-400", bgColor: "bg-yellow-500/20" };
    } else {
      return { level: "BAJO", color: "text-green-400", bgColor: "bg-green-500/20" };
    }
  };

  const risk = getRiskLevel();

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="absolute bottom-4 left-4 z-20 w-80 bg-slate-800/90 backdrop-blur-sm rounded-lg border border-purple-500/20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Info className="w-5 h-5 text-purple-400" />
          Información del Meteorito
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Basic Info (Always visible) */}
      <div className="p-4">
        <div className="space-y-3">
          {/* Name and Risk */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{meteorite.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${risk.bgColor} ${risk.color}`}>
              {risk.level}
            </span>
          </div>

          {/* Hazard Warning */}
          {meteorite.is_potentially_hazardous_asteroid && (
            <div className="flex items-center gap-2 p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm font-medium">Asteroides Potencialmente Peligrosos</span>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-xs text-gray-400">Diámetro</div>
                <div className="text-sm font-medium text-white">{avgDiameter.toFixed(2)} km</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-xs text-gray-400">Magnitud</div>
                <div className="text-sm font-medium text-white">{meteorite.absolute_magnitude_h}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Info */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-purple-500/20">
          <div className="space-y-4 pt-4">
            {/* Detailed Stats */}
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Estadísticas Detalladas</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Diámetro mínimo:</span>
                  <span className="text-white">{meteorite.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Diámetro máximo:</span>
                  <span className="text-white">{meteorite.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ID de referencia:</span>
                  <span className="text-white font-mono text-xs">{meteorite.id}</span>
                </div>
              </div>
            </div>

            {/* Close Approach Data */}
            {latestApproach && (
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Último Acercamiento
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fecha:</span>
                    <span className="text-white">{formatDate(latestApproach.close_approach_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Velocidad:</span>
                    <span className="text-white">{velocity.toFixed(2)} km/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Distancia de fallo:</span>
                    <span className="text-white">{(missDistance / 1000).toFixed(2)} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Distancia astronómica:</span>
                    <span className="text-white">{parseFloat(latestApproach.miss_distance.astronomical).toFixed(6)} AU</span>
                  </div>
                </div>
              </div>
            )}

            {/* Size Comparison */}
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Comparación de Tamaño</h4>
              <div className="space-y-1 text-sm">
                {avgDiameter < 0.1 && (
                  <div className="text-gray-400">• Pequeño como una casa</div>
                )}
                {avgDiameter >= 0.1 && avgDiameter < 1 && (
                  <div className="text-gray-400">• Tamaño de un edificio</div>
                )}
                {avgDiameter >= 1 && avgDiameter < 10 && (
                  <div className="text-gray-400">• Tamaño de una montaña</div>
                )}
                {avgDiameter >= 10 && (
                  <div className="text-gray-400">• Tamaño de una ciudad</div>
                )}
                <div className="text-gray-400">• Velocidad: {velocity.toFixed(0)} km/s ({Math.round(velocity * 3.6)} km/h)</div>
              </div>
            </div>

            {/* NASA Link */}
            <div className="pt-2">
              <a
                href={`https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=${meteorite.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
              >
                <Info className="w-4 h-4" />
                Ver en NASA JPL
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
