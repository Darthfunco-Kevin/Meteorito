"use client";

import { useState } from "react";
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

export default function ControlPanel({
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

  return (
    <div className="absolute top-4 right-4 z-20 w-80 bg-slate-800/90 backdrop-blur-sm rounded-lg border border-purple-500/20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-400" />
          Controles
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4">
          {/* Tabs */}
          <div className="flex mb-4 bg-slate-700/50 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('meteorites')}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'meteorites'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Meteoritos
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'appearance'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Palette className="w-4 h-4 inline mr-1" />
              Apariencia
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'materials'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 inline mr-1" />
              Materiales
            </button>
          </div>

          {/* Meteorites Tab */}
          {activeTab === 'meteorites' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">Seleccionar Meteorito</h3>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {neoData.map((meteorite) => (
                  <button
                    key={meteorite.id}
                    onClick={() => onMeteoriteSelect(meteorite)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedMeteorite?.id === meteorite.id
                        ? 'border-purple-400 bg-purple-600/20'
                        : 'border-gray-600 bg-slate-700/50 hover:bg-slate-600/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-white text-sm">
                        {meteorite.name}
                      </span>
                      {meteorite.is_potentially_hazardous_asteroid && (
                        <span className="text-red-400 text-xs">⚠️</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      Diámetro: {(
                        (meteorite.estimated_diameter.kilometers.estimated_diameter_min + 
                         meteorite.estimated_diameter.kilometers.estimated_diameter_max) / 2
                      ).toFixed(2)} km
                    </div>
                    <div className="text-xs text-gray-400">
                      Magnitud: {meteorite.absolute_magnitude_h}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">Apariencia</h3>
              
              {/* Scale */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Escala: {scale.toFixed(2)}x
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
                  Color Base
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
                  Color de Brillo
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
              <h3 className="text-lg font-semibold text-white mb-3">Propiedades del Material</h3>
              
              {/* Metalness */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Metalicidad: {metalness.toFixed(2)}
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
                  Rugosidad: {roughness.toFixed(2)}
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
                  Intensidad de Brillo: {emissiveIntensity.toFixed(2)}
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
                    onClick={() => {
                      setMetalness(0.8);
                      setRoughness(0.2);
                      setEmissiveIntensity(0.1);
                    }}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white text-sm transition-colors"
                  >
                    Metálico
                  </button>
                  <button
                    onClick={() => {
                      setMetalness(0.1);
                      setRoughness(0.9);
                      setEmissiveIntensity(0.3);
                    }}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white text-sm transition-colors"
                  >
                    Rocoso
                  </button>
                  <button
                    onClick={() => {
                      setMetalness(0.6);
                      setRoughness(0.4);
                      setEmissiveIntensity(0.8);
                    }}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white text-sm transition-colors"
                  >
                    Fundido
                  </button>
                  <button
                    onClick={() => {
                      setMetalness(0.3);
                      setRoughness(0.7);
                      setEmissiveIntensity(0.2);
                    }}
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
}
