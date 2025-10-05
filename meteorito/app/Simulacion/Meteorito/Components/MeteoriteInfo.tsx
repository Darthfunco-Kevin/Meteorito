"use client";

import { useState, memo, useMemo } from "react";
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

const MeteoriteInfo = memo(function MeteoriteInfo({ meteorite }: MeteoriteInfoProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Memoize calculations
  const avgDiameter = useMemo(() =>
    (meteorite.estimated_diameter.kilometers.estimated_diameter_min +
     meteorite.estimated_diameter.kilometers.estimated_diameter_max) / 2,
    [meteorite]
  );

  const latestApproach = useMemo(() => meteorite.close_approach_data[0], [meteorite]);

  const velocity = useMemo(() =>
    parseFloat(latestApproach.relative_velocity.kilometers_per_second),
    [latestApproach]
  );

  const missDistance = useMemo(() =>
    parseFloat(latestApproach.miss_distance.kilometers),
    [latestApproach]
  );

  // Memoize risk level
  const risk = useMemo(() => {
    if (meteorite.is_potentially_hazardous_asteroid) {
      return { level: "HIGH", color: "text-red-400", bgColor: "bg-red-500/20" };
    } else if (avgDiameter > 1) {
      return { level: "MEDIUM", color: "text-yellow-400", bgColor: "bg-yellow-500/20" };
    } else {
      return { level: "LOW", color: "text-green-400", bgColor: "bg-green-500/20" };
    }
  }, [meteorite.is_potentially_hazardous_asteroid, avgDiameter]);

  // Memoize formatted date
  const formattedDate = useMemo(() =>
    new Date(latestApproach.close_approach_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    [latestApproach.close_approach_date]
  );

  return (
    <div className="absolute bottom-6 left-6 z-20 w-96 bg-slate-800/95 backdrop-blur-lg rounded-2xl border-2 border-cyan-500/30 shadow-2xl shadow-cyan-900/30">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b-2 border-cyan-500/30 bg-gradient-to-r from-cyan-900/30 to-blue-900/30">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Info className="w-6 h-6 text-cyan-400 drop-shadow-lg" />
          <span className="drop-shadow-lg">Information</span>
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white transition-all duration-200 hover:scale-110 active:scale-95"
        >
          {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
        </button>
      </div>

      {/* Basic Info (Always visible) */}
      <div className="p-5">
        <div className="space-y-4">
          {/* Name and Risk */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white drop-shadow-lg">{meteorite.name}</h3>
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 ${risk.bgColor} ${risk.color} shadow-lg`}>
              {risk.level}
            </span>
          </div>

          {/* Hazard Warning */}
          {meteorite.is_potentially_hazardous_asteroid && (
            <div className="flex items-center gap-2 p-3 bg-red-500/30 border-2 border-red-500/50 rounded-xl shadow-lg shadow-red-500/20">
              <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
              <span className="text-red-300 text-sm font-bold">⚠️ Potentially Dangerous</span>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl border border-cyan-500/30 shadow-lg">
              <Ruler className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-400 font-semibold">Diameter</div>
                <div className="text-base font-bold text-white">{avgDiameter.toFixed(2)} km</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl border border-cyan-500/30 shadow-lg">
              <Gauge className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-400 font-semibold">Magnitude</div>
                <div className="text-base font-bold text-white">{meteorite.absolute_magnitude_h.toFixed(1)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Info */}
      {isExpanded && (
        <div className="px-5 pb-5 border-t-2 border-cyan-500/30">
          <div className="space-y-4 pt-5">
            {/* Detailed Stats */}
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Detailed Statistics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Minimum diameter:</span>
                  <span className="text-white">{meteorite.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Maximum diameter:</span>
                  <span className="text-white">{meteorite.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Reference ID:</span>
                  <span className="text-white font-mono text-xs">{meteorite.id}</span>
                </div>
              </div>
            </div>

            {/* Close Approach Data */}
            {latestApproach && (
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Latest Approach
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date:</span>
                    <span className="text-white">{formattedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Velocity:</span>
                    <span className="text-white">{velocity.toFixed(2)} km/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Miss distance:</span>
                    <span className="text-white">{(missDistance / 1000).toFixed(2)} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Astronomical distance:</span>
                    <span className="text-white">{parseFloat(latestApproach.miss_distance.astronomical).toFixed(6)} AU</span>
                  </div>
                </div>
              </div>
            )}

            {/* Size Comparison */}
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Size Comparison</h4>
              <div className="space-y-1 text-sm">
                {avgDiameter < 0.1 && (
                  <div className="text-gray-400">• Small as a house</div>
                )}
                {avgDiameter >= 0.1 && avgDiameter < 1 && (
                  <div className="text-gray-400">• Size of a building</div>
                )}
                {avgDiameter >= 1 && avgDiameter < 10 && (
                  <div className="text-gray-400">• Size of a mountain</div>
                )}
                {avgDiameter >= 10 && (
                  <div className="text-gray-400">• Size of a city</div>
                )}
                <div className="text-gray-400">• Velocity: {velocity.toFixed(0)} km/s ({Math.round(velocity * 3.6)} km/h)</div>
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
                View on NASA JPL
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default MeteoriteInfo;
