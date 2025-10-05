"use client";

import { useEffect, useState } from "react";
import { Star, Sparkles, Globe, Code } from "lucide-react"; // Importaciones no usadas (Rocket, Zap, ArrowRight, Palette) eliminadas
import SpaceScene from "./Components/SpaceScene";
import Link from "next/link";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 relative overflow-hidden">
      {/* 3D Space Scene with Meteorites */}
      <SpaceScene />

      {/* Animated Galaxy Background */}
      <div className="absolute inset-0">
        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(200)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Larger Stars */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Nebula Clouds - Enhanced */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute top-40 right-20 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-40 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "3s" }}
          ></div>
        </div>

        {/* Meteorite Trail */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="meteorite-trail absolute top-20 left-1/4 w-1 h-1 bg-white rounded-full animate-ping"></div>
          <div
            className="meteorite-trail absolute top-40 right-1/4 w-0.5 h-0.5 bg-cyan-300 rounded-full animate-ping"
            style={{ animationDelay: "1.5s" }}
          ></div>
          <div
            className="meteorite-trail absolute top-60 left-1/2 w-1 h-1 bg-purple-300 rounded-full animate-ping"
            style={{ animationDelay: "3s" }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-7xl mx-auto">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-sm font-semibold text-purple-300">
              Exploring the Digital Space
            </span>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          </div>

          {/* Main Title - Enhanced */}
          <div className="mb-10">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">
                Welcome to
              </span>
              <span className="block bg-gradient-to-r from-cyan-200 via-purple-200 to-pink-200 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
                Impactor 2025
              </span>
            </h1>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-500" />
              <Star
                className="w-6 h-6 text-yellow-400 animate-spin"
                style={{ animationDuration: "4s" }}
              />
              <Star className="w-4 h-4 text-blue-400 animate-pulse" />
              <Star
                className="w-5 h-5 text-purple-400 animate-pulse"
                style={{ animationDelay: "1s" }}
              />
              <Star
                className="w-4 h-4 text-cyan-400 animate-pulse"
                style={{ animationDelay: "2s" }}
              />
              <Star
                className="w-6 h-6 text-pink-400 animate-spin"
                style={{ animationDuration: "4s", animationDelay: "2s" }}
              />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500" />
            </div>
          </div>

          {/* Subtitle - Enhanced */}
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            We invite you to discover the truth about asteroid threats, as well
            as their impacts and consequences. Here, you&apos;ll find the
            essential tools and information to understand these risks and learn
            how we can mitigate them together.{" "}
          </p>
          {/* Projects Showcase */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-white mb-8">
              <span className="bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Featured Portals
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Meteorito Project */}
              <Link href="/Simulacion/Meteorito">
                <div className="group relative p-6 bg-gradient-to-br from-slate-900/90 to-orange-900/90 backdrop-blur-xl border border-orange-500/30 rounded-2xl hover:border-orange-400/60 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 cursor-pointer overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/50">
                        <Globe className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Meteorite Simulator
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Real-Time 3D Meteorite Explorer (Powered by NASA Data)
                    </p>
                  </div>
                </div>
              </Link>

              {/* Juego Project */}
              <Link href="/Informacion">
                <div className="group relative p-6 bg-gradient-to-br from-slate-900/90 to-green-900/90 backdrop-blur-xl border border-green-500/30 rounded-2xl hover:border-green-400/60 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 cursor-pointer overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/50">
                        <Code className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Meteorite Information
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Discover comprehensive information on meteorite types and
                      characteristics here.
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Feature Cards - Enhanced */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            <Link href="/Infometeorito">
              <div className="w-full group relative p-8 bg-gradient-to-br from-slate-900/80 to-cyan-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl hover:border-cyan-400/60 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-cyan-500/50">
                    <Sparkles
                      className="w-8 h-8 text-white group-hover:animate-spin"
                      style={{ animationDuration: "2s" }}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Participant Information
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Find out who the participants are
                  </p>
                  <div className="mt-4 h-1 w-0 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-500 rounded-full" />
                </div>
              </div>
            </Link>

            <Link href="/InicioGame">
              <div className="w-full group relative p-8 bg-gradient-to-br from-slate-900/80 to-purple-900/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl hover:border-purple-400/60 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-cyan-500/50">
                    <Sparkles
                      className="w-8 h-8 text-white group-hover:animate-spin"
                      style={{ animationDuration: "2s" }}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Games</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Asteroid Mini-Games
                  </p>
                  <div className="mt-4 h-1 w-0 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-500 rounded-full" />
                </div>
              </div>
            </Link>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-5 w-16 h-16 bg-cyan-500/20 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>
      </div>

      {/* Custom CSS for meteorite trails */}
      <style jsx>{`
        @keyframes meteorite {
          0% {
            transform: translateX(-100px) translateY(-100px);
            opacity: 1;
          }
          100% {
            transform: translateX(100vw) translateY(100vh);
            opacity: 0;
          }
        }

        .meteorite-trail {
          animation: meteorite 3s linear infinite;
        }

        .meteorite-trail::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100px;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            currentColor,
            transparent
          );
          transform: translateX(-100px);
        }
      `}</style>
    </div>
  );
}
