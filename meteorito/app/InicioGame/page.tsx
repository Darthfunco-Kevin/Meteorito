"use client";
import React from "react";
import Image from "next/image";

export default function CapybaraSpace() {
  const handleStart = () => {
    window.location.href = "historia1"; // Change this URL to the one you need
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-black text-white overflow-hidden relative">
      {/* Background Stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: Math.random() * 3 + "px",
              height: Math.random() * 3 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animationDelay: Math.random() * 3 + "s",
              animationDuration: Math.random() * 2 + 2 + "s",
            }}
          />
        ))}
      </div>

      {/* Decorative Planets */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-orange-400 to-red-600 rounded-full opacity-60 blur-sm" />
      <div className="absolute bottom-32 left-20 w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-40 blur-md" />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        <header className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Captain Capybara
          </h1>
          <p className="text-xl md:text-2xl text-purple-300">
            Explorer of the Infinite Cosmos
          </p>
        </header>

        <main className="max-w-4xl mx-auto">
          {/* Capybara Card */}
          <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-purple-500/30 mb-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Game Cover Illustration */}
              <div className="flex-shrink-0">
                <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
                  {/* Game Image */}
                  <Image
                    src="/ImagenParte2/PortadaJueg.png"
                    alt="Game Cover"
                    width={384}
                    height={384}
                    className="rounded-2xl shadow-2xl"
                    priority
                  />
                  {/* Stars around */}
                  <div className="absolute -top-4 -right-4 text-3xl animate-spin-slow">
                    ⭐
                  </div>
                  <div className="absolute -bottom-4 -left-4 text-2xl animate-spin-slow">
                    ✨
                  </div>
                  <div className="absolute top-1/2 -right-8 text-xl animate-bounce-slow">
                    🌟
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex-1 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-cyan-300 mb-4">
                  The Calmest Hero in the Universe
                </h2>
                <p className="text-lg text-purple-200 leading-relaxed">
                  In a remote corner of the galaxy, Captain Capybara navigates
                  among the stars with his characteristic relaxed style. Aboard
                  his spaceship "The Cosmic Orange", this intrepid
                  rodent has visited more than 100 planets, always carrying
                  with him his life philosophy: stay calm, even
                  in front of black holes.
                </p>
                <p className="text-lg text-purple-200 leading-relaxed">
                  His mission is not only to explore the cosmos, but to teach all
                  the civilizations he encounters the art of serenity.
                  Some call him the "Space Zen Master", others
                  simply know him as the coolest capybara in the
                  Milky Way.
                </p>

                {/* Achievements */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-indigo-800/30 rounded-lg p-4 border border-indigo-500/30">
                    <div className="text-3xl mb-2">🌍</div>
                    <div className="text-2xl font-bold text-cyan-400">100+</div>
                    <div className="text-sm text-purple-300">
                      Planets Visited
                    </div>
                  </div>
                  <div className="bg-indigo-800/30 rounded-lg p-4 border border-indigo-500/30">
                    <div className="text-3xl mb-2">🚀</div>
                    <div className="text-2xl font-bold text-cyan-400">∞</div>
                    <div className="text-sm text-purple-300">
                      Calm Level
                    </div>
                  </div>
                </div>

                {/* Start Button */}
                <div className="pt-6">
                  <button
                    onClick={handleStart}
                    className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xl rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50 active:scale-95"
                  >
                    🚀 Start the Adventure
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with space style */}
          <div className="text-center text-purple-400 text-sm">
            <p>
              🌌 Broadcasting from somewhere between Andromeda and your heart 🌌
            </p>
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}
