"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Shield,
  AlertTriangle,
  Telescope,
  Lightbulb,
  Satellite,
  BookOpen,
} from "lucide-react";

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

function CollapsibleSection({
  title,
  icon,
  children,
  defaultExpanded = false,
}: SectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-slate-800/95 backdrop-blur-lg rounded-2xl border-2 border-cyan-500/30 shadow-2xl shadow-cyan-900/30 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-slate-700/50 transition-all duration-200"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            {icon}
          </div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-6 h-6 text-cyan-400" />
        ) : (
          <ChevronDown className="w-6 h-6 text-cyan-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 border-t-2 border-cyan-500/30">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Informacion() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-b from-black/70 via-black/50 to-transparent backdrop-blur-lg border-b border-cyan-500/30 shadow-2xl shadow-cyan-900/20">
        <div className="max-w-7xl mx-auto px-6 py-8 mt-16">
          <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 drop-shadow-2xl">
            Meteorite Information
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl">
            Learn about meteorites, Near-Earth Objects (NEOs), mitigation
            strategies, and planetary defense systems.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-6">
          {/* What are Meteorites */}
          <CollapsibleSection
            title="What are Meteorites?"
            icon={<BookOpen className="w-6 h-6 text-white" />}
            defaultExpanded={true}
          >
            <div className="mt-6 space-y-4 text-gray-300">
              <p className="text-lg leading-relaxed">
                <strong className="text-cyan-400">Meteorites</strong> are
                fragments of space rock that survive passage through Earth's
                atmosphere and reach the surface. Most disintegrate before
                reaching the ground, becoming meteors or shooting stars.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl border border-cyan-500/30">
                  <h3 className="text-lg font-bold text-cyan-400 mb-2">
                    Meteoroid
                  </h3>
                  <p className="text-sm text-gray-400">
                    Object in space before entering the atmosphere
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl border border-cyan-500/30">
                  <h3 className="text-lg font-bold text-cyan-400 mb-2">
                    Meteor
                  </h3>
                  <p className="text-sm text-gray-400">
                    The luminous phenomenon when it burns up in the atmosphere
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl border border-cyan-500/30">
                  <h3 className="text-lg font-bold text-cyan-400 mb-2">
                    Meteorite
                  </h3>
                  <p className="text-sm text-gray-400">
                    The fragment that reaches Earth's surface
                  </p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl border-2 border-purple-500/30">
                <h3 className="text-xl font-bold text-purple-400 mb-3">
                  NEOs - Near-Earth Objects
                </h3>
                <p className="text-gray-300 mb-4">
                  <strong>NEOs (Near-Earth Objects)</strong> are asteroids and
                  comets whose orbits bring them close to Earth. They are
                  classified according to their minimum approach distance:
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>
                      <strong>Atens:</strong> Orbit primarily inside Earth's
                      orbit
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>
                      <strong>Apollos:</strong> Cross Earth's orbit from the
                      outside
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>
                      <strong>Amors:</strong> Approach Earth's orbit but don't
                      cross it
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </CollapsibleSection>

          {/* Mitigation Strategies */}
          <CollapsibleSection
            title="Mitigation Strategies"
            icon={<Shield className="w-6 h-6 text-white" />}
          >
            <div className="mt-6 space-y-6">
              <p className="text-gray-300 text-lg">
                Planetary defense against asteroid impacts includes several
                strategies based on the object's size and available warning
                time.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Kinetic Impactor */}
                <div className="p-6 bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-xl border-2 border-red-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🚀</span>
                    </div>
                    <h3 className="text-xl font-bold text-red-400">
                      Kinetic Impact
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-3">
                    Involves sending a spacecraft at high speed to impact the
                    asteroid and change its trajectory.
                  </p>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div>
                      <strong className="text-red-400">Advantages:</strong>{" "}
                      Proven technology (DART mission 2022)
                    </div>
                    <div>
                      <strong className="text-red-400">Limitations:</strong>{" "}
                      Requires years of advance notice
                    </div>
                  </div>
                </div>

                {/* Gravity Tractor */}
                <div className="p-6 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-xl border-2 border-blue-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🛸</span>
                    </div>
                    <h3 className="text-xl font-bold text-blue-400">
                      Gravity Tractor
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-3">
                    A spacecraft orbits near the asteroid, using its gravity to
                    gradually alter the object's orbit.
                  </p>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div>
                      <strong className="text-blue-400">Advantages:</strong>{" "}
                      Precise and controllable
                    </div>
                    <div>
                      <strong className="text-blue-400">Limitations:</strong>{" "}
                      Very slow, requires decades
                    </div>
                  </div>
                </div>

                {/* Nuclear Option */}
                <div className="p-6 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-xl border-2 border-yellow-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">⚛️</span>
                    </div>
                    <h3 className="text-xl font-bold text-yellow-400">
                      Nuclear Blast
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-3">
                    Detonate a nuclear device near the asteroid to partially
                    vaporize it and change its trajectory.
                  </p>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div>
                      <strong className="text-yellow-400">Advantages:</strong>{" "}
                      Effective for large objects
                    </div>
                    <div>
                      <strong className="text-yellow-400">Limitations:</strong>{" "}
                      Last resort, political risks
                    </div>
                  </div>
                </div>

                {/* Evacuation */}
                <div className="p-6 bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-xl border-2 border-green-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🚨</span>
                    </div>
                    <h3 className="text-xl font-bold text-green-400">
                      Evacuation
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-3">
                    For small objects or when there isn't enough time,
                    evacuating probable impact areas can save lives.
                  </p>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div>
                      <strong className="text-green-400">Advantages:</strong>{" "}
                      Applicable short-term
                    </div>
                    <div>
                      <strong className="text-green-400">Limitations:</strong>{" "}
                      Only for small objects
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-xl border-2 border-cyan-500/30">
                <h3 className="text-xl font-bold text-cyan-400 mb-3">
                  DART Mission - Historic Success
                </h3>
                <p className="text-gray-300">
                  In September 2022, NASA's{" "}
                  <strong>DART (Double Asteroid Redirection Test)</strong>{" "}
                  mission successfully impacted the asteroid Dimorphos, changing
                  its orbital period by 32 minutes. This was the first
                  demonstration of planetary defense through kinetic impact.
                </p>
              </div>
            </div>
          </CollapsibleSection>

          {/* Risk Assessment */}
          <CollapsibleSection
            title="Risk Assessment"
            icon={<AlertTriangle className="w-6 h-6 text-white" />}
          >
            <div className="mt-6 space-y-6">
              <p className="text-gray-300 text-lg">
                Not all asteroids pose the same threat. Risk assessment depends
                on size, composition, velocity, and impact probability.
              </p>

              <div className="space-y-4">
                {/* High Risk */}
                <div className="p-6 bg-gradient-to-r from-red-900/30 to-red-800/30 rounded-xl border-l-4 border-red-500">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <h3 className="text-2xl font-bold text-red-400">
                      HIGH RISK
                    </h3>
                  </div>
                  <div className="space-y-2 text-gray-300">
                    <div>
                      <strong>Size:</strong> Greater than 140 meters in diameter
                    </div>
                    <div>
                      <strong>Classification:</strong> PHA (Potentially
                      Hazardous Asteroid)
                    </div>
                    <div>
                      <strong>Potential damage:</strong> Regional destruction,
                      millions of casualties
                    </div>
                    <div>
                      <strong>Frequency:</strong> Approximately every 10,000
                      years
                    </div>
                    <div className="text-sm text-gray-400 mt-3">
                      Objects of this size are constantly monitored. There are
                      approximately 2,000 known PHAs.
                    </div>
                  </div>
                </div>

                {/* Medium Risk */}
                <div className="p-6 bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 rounded-xl border-l-4 border-yellow-500">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                    <h3 className="text-2xl font-bold text-yellow-400">
                      MEDIUM RISK
                    </h3>
                  </div>
                  <div className="space-y-2 text-gray-300">
                    <div>
                      <strong>Size:</strong> 25-140 meters in diameter
                    </div>
                    <div>
                      <strong>Potential damage:</strong> Local/city destruction,
                      thousands of casualties
                    </div>
                    <div>
                      <strong>Frequency:</strong> Every 100-1,000 years
                    </div>
                    <div className="text-sm text-gray-400 mt-3">
                      The Chelyabinsk event (2013) was caused by an
                      approximately 20m object that exploded in the atmosphere.
                    </div>
                  </div>
                </div>

                {/* Low Risk */}
                <div className="p-6 bg-gradient-to-r from-green-900/30 to-green-800/30 rounded-xl border-l-4 border-green-500">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <h3 className="text-2xl font-bold text-green-400">
                      LOW RISK
                    </h3>
                  </div>
                  <div className="space-y-2 text-gray-300">
                    <div>
                      <strong>Size:</strong> Less than 25 meters in diameter
                    </div>
                    <div>
                      <strong>Potential damage:</strong> Generally disintegrate
                      in the atmosphere
                    </div>
                    <div>
                      <strong>Frequency:</strong> Several per year
                    </div>
                    <div className="text-sm text-gray-400 mt-3">
                      Most completely vaporize before reaching the ground. They
                      can create luminous spectacles.
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl border-2 border-purple-500/30">
                <h3 className="text-xl font-bold text-purple-400 mb-3">
                  Measurement Scales
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-purple-300 mb-2">
                      Torino Scale
                    </h4>
                    <p className="text-sm text-gray-400">
                      Classifies impact risk from 0 (no risk) to 10 (certain
                      collision with global consequences).
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-300 mb-2">
                      Palermo Scale
                    </h4>
                    <p className="text-sm text-gray-400">
                      Technical logarithmic scale that compares risk with
                      average background risk.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Protection Systems */}
          <CollapsibleSection
            title="Planetary Protection Systems"
            icon={<Satellite className="w-6 h-6 text-white" />}
          >
            <div className="mt-6 space-y-6">
              <p className="text-gray-300 text-lg">
                Multiple organizations and programs work 24/7 to detect, track,
                and catalog Near-Earth Objects.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* NASA PDCO */}
                <div className="p-6 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl border-2 border-blue-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🇺🇸</span>
                    </div>
                    <h3 className="text-xl font-bold text-blue-400">
                      NASA PDCO
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-3">
                    <strong>Planetary Defense Coordination Office</strong> -
                    Coordinates NEO detection and mitigation efforts.
                  </p>
                  <div className="text-sm text-gray-400 space-y-2">
                    <div>Center for NEO Studies (CNEOS)</div>
                    <div>Database of known objects</div>
                    <div>Development of defense missions</div>
                  </div>
                </div>

                {/* ESA SSA */}
                <div className="p-6 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl border-2 border-purple-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🇪🇺</span>
                    </div>
                    <h3 className="text-xl font-bold text-purple-400">
                      ESA SSA
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-3">
                    <strong>Space Situational Awareness</strong> - European
                    space surveillance program.
                  </p>
                  <div className="text-sm text-gray-400 space-y-2">
                    <div>Network of tracking telescopes</div>
                    <div>NEO Coordination Centre program</div>
                    <div>International collaboration</div>
                  </div>
                </div>

                {/* Survey Programs */}
                <div className="p-6 bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl border-2 border-green-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Telescope className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-green-400">
                      Survey Programs
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-3">
                    Ground-based telescopes dedicated to NEO search
                  </p>
                  <div className="text-sm text-gray-400 space-y-2">
                    <div>
                      <strong>Catalina Sky Survey</strong> - Arizona, USA
                    </div>
                    <div>
                      <strong>Pan-STARRS</strong> - Hawaii
                    </div>
                    <div>
                      <strong>ATLAS</strong> - Early warning system
                    </div>
                    <div>
                      <strong>NEOCam</strong> - Infrared space telescope
                    </div>
                  </div>
                </div>

                {/* International Cooperation */}
                <div className="p-6 bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl border-2 border-orange-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🌍</span>
                    </div>
                    <h3 className="text-xl font-bold text-orange-400">
                      International Cooperation
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-3">
                    Organizations coordinating global efforts
                  </p>
                  <div className="text-sm text-gray-400 space-y-2">
                    <div>
                      <strong>IAWN</strong> - International Asteroid Warning
                      Network
                    </div>
                    <div>
                      <strong>SMPAG</strong> - Space Mission Planning Advisory
                      Group
                    </div>
                    <div>
                      <strong>UN COPUOS</strong> - United Nations Committee
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Fun Facts */}
          <CollapsibleSection
            title="Interesting Facts"
            icon={<Lightbulb className="w-6 h-6 text-white" />}
          >
            <div className="mt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-xl border border-cyan-500/30">
                  <div className="text-3xl mb-3">🌠</div>
                  <h3 className="text-lg font-bold text-cyan-400 mb-2">
                    Daily rain
                  </h3>
                  <p className="text-gray-300">
                    Approximately <strong>100 tons</strong> of space dust and
                    small meteoroids fall to Earth every day.
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/30">
                  <div className="text-3xl mb-3">🦕</div>
                  <h3 className="text-lg font-bold text-purple-400 mb-2">
                    Dinosaur extinction
                  </h3>
                  <p className="text-gray-300">
                    The Chicxulub impact <strong>65 million years ago</strong>{" "}
                    was caused by an asteroid approximately 10 km in diameter.
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-xl border border-green-500/30">
                  <div className="text-3xl mb-3">💎</div>
                  <h3 className="text-lg font-bold text-green-400 mb-2">
                    Valuable resources
                  </h3>
                  <p className="text-gray-300">
                    Asteroids contain precious metals, water, and rare minerals
                    valued at <strong>trillions of dollars</strong>.
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-xl border border-orange-500/30">
                  <div className="text-3xl mb-3">🎯</div>
                  <h3 className="text-lg font-bold text-orange-400 mb-2">
                    DART Mission
                  </h3>
                  <p className="text-gray-300">
                    In 2022, NASA <strong>successfully deflected</strong> an
                    asteroid for the first time in human history.
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-xl border border-blue-500/30">
                  <div className="text-3xl mb-3">⚡</div>
                  <h3 className="text-lg font-bold text-blue-400 mb-2">
                    Extreme velocity
                  </h3>
                  <p className="text-gray-300">
                    Meteorites can enter the atmosphere at speeds of up to{" "}
                    <strong>72 km/s</strong> (259,200 km/h).
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-xl border border-yellow-500/30">
                  <div className="text-3xl mb-3">🔥</div>
                  <h3 className="text-lg font-bold text-yellow-400 mb-2">
                    Tunguska Event
                  </h3>
                  <p className="text-gray-300">
                    In 1908, an airburst from a meteorite in Siberia devastated{" "}
                    <strong>2,000 km²</strong> of forest.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl border-2 border-indigo-500/30">
                <h3 className="text-2xl font-bold text-indigo-400 mb-4">
                  The future of planetary defense
                </h3>
                <p className="text-gray-300 mb-4">
                  Humanity is developing increasingly sophisticated technologies
                  to protect our planet
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400">•</span>
                    <span>
                      Infrared space telescopes to detect dark asteroids
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400">•</span>
                    <span>
                      Characterization missions to study asteroid composition
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400">•</span>
                    <span>
                      Early warning systems with decades of advance notice
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400">•</span>
                    <span>
                      International collaboration for coordinated response
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </CollapsibleSection>
        </div>

        {/* Footer */}
        <div className="mt-12 p-8 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-lg rounded-2xl border-2 border-cyan-500/30 shadow-2xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Planetary defense is everyone's responsibility
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto mb-6">
              Although the probability of a catastrophic impact is low,
              preparation is essential. Thanks to scientific advances and
              international cooperation, we are better equipped than ever to
              protect our planet.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://cneos.jpl.nasa.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-blue-500/50"
              >
                NASA CNEOS
              </a>
              <a
                href="https://www.esa.int/Safety_Security/Planetary_Defence"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-purple-500/50"
              >
                ESA Planetary Defence
              </a>
              <a
                href="https://www.minorplanetcenter.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-cyan-500/50"
              >
                Minor Planet Center
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
