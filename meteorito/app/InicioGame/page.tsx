import React from 'react';

export default function CapybaraSpace() {
  const handleStart = () => {
    window.location.href = 'https://example.com'; // Cambia este URL al que necesites
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-black text-white overflow-hidden relative">
      {/* Estrellas de fondo */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: Math.random() * 3 + 'px',
              height: Math.random() * 3 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 2 + 2 + 's'
            }}
          />
        ))}
      </div>

      {/* Planetas decorativos */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-orange-400 to-red-600 rounded-full opacity-60 blur-sm" />
      <div className="absolute bottom-32 left-20 w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-40 blur-md" />

      {/* Contenido principal */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        <header className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Capitán Capybara
          </h1>
          <p className="text-xl md:text-2xl text-purple-300">
            Explorador del Cosmos Infinito
          </p>
        </header>

        <main className="max-w-4xl mx-auto">
          {/* Card del Capybara */}
          <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-purple-500/30 mb-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Ilustración del Capybara Astronauta */}
              <div className="flex-shrink-0">
                <div className="relative w-64 h-64 flex items-center justify-center">
                  {/* Estrellas alrededor */}
                  <div className="absolute -top-4 -right-4 text-3xl animate-spin-slow">⭐</div>
                  <div className="absolute -bottom-4 -left-4 text-2xl animate-spin-slow">✨</div>
                  <div className="absolute top-1/2 -right-8 text-xl animate-bounce-slow">🌟</div>
                </div>
              </div>

              {/* Descripción */}
              <div className="flex-1 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-cyan-300 mb-4">
                  El Héroe más Tranquilo del Universo
                </h2>
                <p className="text-lg text-purple-200 leading-relaxed">
                  En un rincón remoto de la galaxia, el Capitán Capybara navega entre las estrellas con su característico estilo relajado. A bordo de su nave espacial "La Naranja Cósmica", este intrépido roedor ha visitado más de 100 planetas, siempre llevando consigo su filosofía de vida: mantener la calma, incluso frente a agujeros negros.
                </p>
                <p className="text-lg text-purple-200 leading-relaxed">
                  Su misión no es solo explorar el cosmos, sino enseñar a todas las civilizaciones que encuentra el arte de la serenidad. Algunos lo llaman el "Zen Master del Espacio", otros simplemente lo conocen como el carpincho más cool de la Vía Láctea.
                </p>

                {/* Logros */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-indigo-800/30 rounded-lg p-4 border border-indigo-500/30">
                    <div className="text-3xl mb-2">🌍</div>
                    <div className="text-2xl font-bold text-cyan-400">100+</div>
                    <div className="text-sm text-purple-300">Planetas Visitados</div>
                  </div>
                  <div className="bg-indigo-800/30 rounded-lg p-4 border border-indigo-500/30">
                    <div className="text-3xl mb-2">🚀</div>
                    <div className="text-2xl font-bold text-cyan-400">∞</div>
                    <div className="text-sm text-purple-300">Nivel de Calma</div>
                  </div>
                </div>

                {/* Botón Comenzar */}
                <div className="pt-6">
                  <button
                    onClick={handleStart}
                    className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xl rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50 active:scale-95"
                  >
                    🚀 Comenzar la Aventura
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer con estilo espacial */}
          <div className="text-center text-purple-400 text-sm">
            <p>🌌 Transmitiendo desde algún lugar entre Andrómeda y tu corazón 🌌</p>
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
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes bounce {
          0%, 100% {
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