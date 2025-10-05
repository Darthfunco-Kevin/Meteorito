"use client";
import { useState } from "react";
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

export default function ImageDialogChanger() {
  // Define la estructura de cada slide sin la propiedad de audio
  type Slide = {
    image: string;
    dialog: string;
  };

  // 1. ELIMINACIÓN DE audioUrl DE LOS SLIDES
  const slides: Slide[] = [
    {
      image: "Lineal/1.png",
      dialog:
        "Narrator: The most dangerous meteor in the universe had been located once again — this time, heading straight for the Milky Way, specifically toward planet Earth, home of the human race.",
    },
    {
      image: "Lineal/4.gif",
      dialog:
        "Narrator: The capybara knew this mission would be different. It wasn’t just about saving another planet — it was about ending the meteor that had destroyed countless lives. ",
    },
    {
      image: "Lineal/Tierra.gif",
      dialog: "Capybara: “Cool Capybara!” ",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  // 2. ELIMINACIÓN DE ESTADOS RELACIONADOS CON AUDIO
  // const [isPlaying, setIsPlaying] = useState(false);
  // const [autoPlay, setAutoPlay] = useState(true);
  // const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // 3. ELIMINACIÓN DE LÓGICA DE AUDIO (useEffect y funciones)

  // Función de navegación para avanzar (al hacer click en la imagen)
  const nextSlide = () => {
    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        // Redireccionar al llegar al final de la historia
        if (prevIndex >= slides.length - 1) {
          window.location.href = "/NewGames"; // Redirección final al juego
          return 0; // Fallback (aunque la redirección debería ocurrir)
        }
        return prevIndex + 1;
      });
      setIsTransitioning(false);
    }, 150);
  };

  // Función de navegación para retroceder
  const prevSlide = () => {
    if (currentIndex === 0) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setIsTransitioning(false);
    }, 150);
  };

  // Función para el botón "Continue" (va a la misma redirección final)
  const continueToNext = () => {
    window.location.href = "/NewGames";
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-5 bg-black">
      {/* 4. AJUSTE DE DISEÑO: Estilos CSS In-line */}
      <style>{`
        @keyframes starfield {
          0% { transform: translateY(0) translateX(0); }
          100% { transform: translateY(100vh) translateX(10vw); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes cosmic-glow {
          0%, 100% {
            box-shadow: 0 0 40px rgba(147, 51, 234, 0.4),
                        0 0 80px rgba(79, 70, 229, 0.3),
                        0 0 120px rgba(59, 130, 246, 0.2),
                        inset 0 0 60px rgba(139, 92, 246, 0.1);
          }
          50% {
            box-shadow: 0 0 60px rgba(147, 51, 234, 0.6),
                        0 0 100px rgba(79, 70, 229, 0.5),
                        0 0 140px rgba(59, 130, 246, 0.4),
                        inset 0 0 80px rgba(139, 92, 246, 0.2);
          }
        }
        .space-background {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, #0a0118, #1a0b2e, #2d1b4e, #1a0b2e, #0a0118);
        }
        .stars {
          position: absolute;
          width: 3px;
          height: 3px;
          background: white;
          border-radius: 50%;
          animation: starfield linear infinite, twinkle ease-in-out infinite;
          box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
        }
        .nebula {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px); 
            opacity: 0.4;
        }
        .glow-container {
          animation: cosmic-glow 4s ease-in-out infinite;
          position: relative;
          z-index: 10;
        }
      `}</style>

      {/* Fondo espacial */}
      <div className="space-background"></div>

      {/* Nebulosas */}
      <div
        className="nebula"
        style={{
          top: "10%",
          left: "15%",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(147, 51, 234, 0.4), transparent)",
          animationDuration: "8s",
        }}
      ></div>
      <div
        className="nebula"
        style={{
          top: "60%",
          right: "10%",
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(79, 70, 229, 0.3), transparent)",
          animationDuration: "10s",
          animationDelay: "2s",
        }}
      ></div>

      {/* Estrellas dinámicas */}
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="stars"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${15 + Math.random() * 20}s, ${
              2 + Math.random() * 3
            }s`,
            animationDelay: `${Math.random() * 5}s, ${Math.random() * 2}s`,
            opacity: Math.random() * 0.7 + 0.3,
          }}
        ></div>
      ))}

      {/* Contenedor principal de la Historia */}
      <div className="glow-container bg-slate-900/95 rounded-xl overflow-hidden max-w-4xl w-full border-4 border-purple-400/50 shadow-2xl backdrop-blur-sm">
        {/* Indicación superior */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white py-3 px-6 text-center font-bold text-xl tracking-wider flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
          MISSION EARTH: IMPACTOR
          <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
        </div>

        {/* Contenedor de imagen */}
        <div
          onClick={nextSlide}
          className="w-full h-[450px] bg-slate-800 flex items-center justify-center cursor-pointer relative overflow-hidden transition-all duration-200 group"
        >
          <img
            src={slides[currentIndex].image}
            alt={`Scene ${currentIndex + 1}`}
            className={`w-full h-full object-contain transition-opacity duration-300 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>

        {/* Caja de diálogo y controles */}
        <div className="p-4 sm:p-6 bg-slate-900 border-t border-purple-500/30">
          {/* Diálogo */}
          <div className="bg-slate-700/50 p-4 sm:p-5 rounded-lg border-l-4 border-cyan-400 min-h-[90px] flex items-center">
            <p className="text-xl leading-relaxed text-gray-100 font-medium">
              {slides[currentIndex].dialog}
            </p>
          </div>

          {/* Navegación y Progreso */}
          <div className="flex items-center justify-between mt-4 gap-4">
            {/* Botones de navegación */}
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className={`p-3 rounded-full transition-all duration-200 ${
                  currentIndex === 0
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white active:scale-95 shadow-md shadow-purple-500/30"
                }`}
                title="Previous Scene"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full active:scale-95 transition-all duration-200 shadow-md shadow-purple-500/30"
                title="Next Scene"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Info y botón Continue */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400 font-mono tracking-widest">
                Scene: {currentIndex + 1} / {slides.length}
              </div>

              {/* Botón Continue (solo visible en la última escena para ser más claro) */}
              {currentIndex === slides.length - 1 && (
                <button
                  onClick={continueToNext}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-bold transition-all duration-300 active:scale-95 shadow-lg shadow-green-500/30"
                >
                  Prepare for Battle →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
