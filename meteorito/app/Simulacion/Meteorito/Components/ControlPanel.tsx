"use client";

import { useState, memo, useCallback } from "react";
import { ChevronDown, ChevronUp, Settings, Palette, Zap } from "lucide-react";

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

interface ControlPanelProps {
  neoData: NEOData[];
  selectedMeteorite: NEOData | null;
  onMeteoriteSelect: (meteorite: NEOData) => void;
  scale: number;
  setScale: (scale: number) => void;
  color: string;
  setColor: (color: string) => void;
  emissiveColor: string;
  setEmissiveColor: (color: string) => void;
  metalness: number;
  setMetalness: (metalness: number) => void;
  roughness: number;
  setRoughness: (roughness: number) => void;
  emissiveIntensity: number;
  setEmissiveIntensity: (intensity: number) => void;
}

const ControlPanel = memo(function ControlPanel({
  neoData,
  selectedMeteorite,
  onMeteoriteSelect,
  scale,
  setScale,
  color,
  setColor,
  emissiveColor,
  setEmissiveColor,
  metalness,
  setMetalness,
  roughness,
  setRoughness,
  emissiveIntensity,
  setEmissiveIntensity
}: ControlPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'meteorites' | 'appearance' | 'materials'>('meteorites');

  // Memoize preset handlers
  const handleMetallicPreset = useCallback(() => {
    setMetalness(0.8);
    setRoughness(0.2);
    setEmissiveIntensity(0.1);
  }, [setMetalness, setRoughness, setEmissiveIntensity]);

  const handleRockyPreset = useCallback(() => {
    setMetalness(0.1);
    setRoughness(0.9);
    setEmissiveIntensity(0.3);
  }, [setMetalness, setRoughness, setEmissiveIntensity]);

  const handleMoltenPreset = useCallback(() => {
    setMetalness(0.6);
    setRoughness(0.4);
    setEmissiveIntensity(0.8);
  }, [setMetalness, setRoughness, setEmissiveIntensity]);

  const handleNaturalPreset = useCallback(() => {
    setMetalness(0.3);
    setRoughness(0.7);
    setEmissiveIntensity(0.2);
  }, [setMetalness, setRoughness, setEmissiveIntensity]);

  return (
    <div className="absolute top-52 right-6 z-20 w-96 bg-slate-800/95 backdrop-blur-lg rounded-2xl border-2 border-purple-500/30 shadow-2xl shadow-purple-900/30">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b-2 border-purple-500/30 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-purple-400 drop-shadow-lg" />
          <span className="drop-shadow-lg">Control Panel</span>
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white transition-all duration-200 hover:scale-110 active:scale-95"
        >
          {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-5">
          {/* Tabs */}
          <div className="flex mb-5 bg-slate-900/60 rounded-xl p-1.5 shadow-inner">
            <button
              onClick={() => setActiveTab('meteorites')}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                activeTab === 'meteorites'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              🌠 Meteorites
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                activeTab === 'appearance'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Palette className="w-4 h-4 inline mr-1" />
              Color
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                activeTab === 'materials'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Zap className="w-4 h-4 inline mr-1" />
              Material
            </button>
          </div>

          {/* Meteorites Tab */}
          {activeTab === 'meteorites' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">Select Meteorite</h3>
                <span className="text-xs text-gray-400 bg-slate-700/50 px-2 py-1 rounded">
                  {neoData.length} available
                </span>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
                {neoData.map((meteorite) => {
                  const avgDiameter = (
                    meteorite.estimated_diameter.kilometers.estimated_diameter_min +
                    meteorite.estimated_diameter.kilometers.estimated_diameter_max
                  ) / 2;

                  const velocity = meteorite.close_approach_data[0]?.relative_velocity.kilometers_per_second
                    ? parseFloat(meteorite.close_approach_data[0].relative_velocity.kilometers_per_second)
                    : 0;

                  const approachDate = meteorite.close_approach_data[0]?.close_approach_date || 'N/A';

                  return (
                    <button
                      key={meteorite.id}
                      onClick={() => onMeteoriteSelect(meteorite)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all transform hover:scale-[1.02] ${
                        selectedMeteorite?.id === meteorite.id
                          ? 'border-purple-500 bg-gradient-to-br from-purple-600/30 to-blue-600/20 shadow-lg shadow-purple-500/20'
                          : 'border-gray-600/50 bg-slate-700/40 hover:bg-slate-600/50 hover:border-purple-400/30'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <span className="font-bold text-white text-sm block mb-1 leading-tight">
                            {meteorite.name}
                          </span>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              meteorite.is_potentially_hazardous_asteroid
                                ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                                : 'bg-green-500/20 text-green-300 border border-green-500/50'
                            }`}>
                              {meteorite.is_potentially_hazardous_asteroid ? 'Dangerous' : 'Safe'}
                            </span>
                            {avgDiameter > 1 && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/50">
                                Large
                              </span>
                            )}
                          </div>
                        </div>
                        {meteorite.is_potentially_hazardous_asteroid && (
                          <span className="text-red-400 text-lg">⚠️</span>
                        )}
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div className="bg-slate-800/60 rounded-lg p-2 border border-slate-700/50">
                          <div className="text-xs text-gray-400 mb-0.5">Diameter</div>
                          <div className="text-sm font-bold text-white">
                            {avgDiameter.toFixed(3)} km
                          </div>
                        </div>

                        <div className="bg-slate-800/60 rounded-lg p-2 border border-slate-700/50">
                          <div className="text-xs text-gray-400 mb-0.5">Magnitude</div>
                          <div className="text-sm font-bold text-white">
                            {meteorite.absolute_magnitude_h.toFixed(1)}
                          </div>
                        </div>

                        <div className="bg-slate-800/60 rounded-lg p-2 border border-slate-700/50">
                          <div className="text-xs text-gray-400 mb-0.5">Velocity</div>
                          <div className="text-sm font-bold text-cyan-400">
                            {velocity.toFixed(1)} km/s
                          </div>
                        </div>

                        <div className="bg-slate-800/60 rounded-lg p-2 border border-slate-700/50">
                          <div className="text-xs text-gray-400 mb-0.5">Date</div>
                          <div className="text-xs font-semibold text-white">
                            {new Date(approachDate).toLocaleDateString('en-US', {
                              day: '2-digit',
                              month: 'short'
                            })}
                          </div>
                        </div>
                      </div>

                      {/* ID Reference */}
                      <div className="mt-2 pt-2 border-t border-slate-600/50">
                        <div className="text-xs text-gray-500 font-mono truncate">
                          ID: {meteorite.id}
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {selectedMeteorite?.id === meteorite.id && (
                        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-purple-400 font-semibold">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                          Selected
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">Appearance</h3>

              {/* Scale */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Scale: {scale.toFixed(2)}x
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Base Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 rounded border border-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-700 border border-gray-600 rounded text-white text-sm"
                    placeholder="#8B4513"
                  />
                </div>
              </div>

              {/* Emissive Color */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Glow Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={emissiveColor}
                    onChange={(e) => setEmissiveColor(e.target.value)}
                    className="w-10 h-10 rounded border border-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={emissiveColor}
                    onChange={(e) => setEmissiveColor(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-700 border border-gray-600 rounded text-white text-sm"
                    placeholder="#FF4500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Materials Tab */}
          {activeTab === 'materials' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">Material Properties</h3>

              {/* Metalness */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Metalness: {metalness.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={metalness}
                  onChange={(e) => setMetalness(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Roughness */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Roughness: {roughness.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={roughness}
                  onChange={(e) => setRoughness(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Emissive Intensity */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Glow Intensity: {emissiveIntensity.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.01"
                  value={emissiveIntensity}
                  onChange={(e) => setEmissiveIntensity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleMetallicPreset}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white text-sm transition-colors"
                  >
                    Metallic
                  </button>
                  <button
                    onClick={handleRockyPreset}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white text-sm transition-colors"
                  >
                    Rocky
                  </button>
                  <button
                    onClick={handleMoltenPreset}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white text-sm transition-colors"
                  >
                    Molten
                  </button>
                  <button
                    onClick={handleNaturalPreset}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white text-sm transition-colors"
                  >
                    Natural
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default ControlPanel;
