'use client';
import { useState, useEffect } from 'react';

export default function ImageDialogChanger() {
  const slides = [
    {
      image: "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif",
      dialog: "Narrator: The meteorite increasingly dictated the end for planet Earth, fear progressed and the capybaras remained firm and united. Each shot at the meteorite had a story, a value. News always happens and is reported."

    },
    {
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      dialog: "Scientist: Don't shoot, you're only regenerating the meteorite! The only salvation that exists is to go to space! The spaceship is still ready. In a few seconds I will launch a nuclear missile to weaken it."

    },
    {
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
      dialog: "Narrator: An unworthy ending for someone who tried to give it all, who watched as his companions escaped, while trying to find a solution. The nervous capybaras didn't know what to do, each ship had 4 explosive missiles from other galaxies, although the probability of success would increase, planet Earth would not be the same again for a long time."
    },
    {
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
      dialog: "Capybara: Long live you and everyone"
    },
    {
      image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800",
      dialog: "Narrator: Sometimes those we consider heroes can make critical decisions, regardless of the lives they carry with them on their journey. One life or millions of lives."
    },
    {
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
      dialog: "Narrator: Time passes, one by one they begin to leave, unable to bear that burden that always carries with them. Their legacy will be remembered as the heroes of the universe, although their conscience will not allow them to be recognized."
    },
    {
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
      dialog: "Narrator: The capybara who began with the hope of saving lives from meteorites, is now shattered, being unrecognizable for his great trajectory, not saving his planet led him to seek perfection, but by failing he only proved to be useless."
    },
    {
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
      dialog: "Capybara: Capybara... the planet destroyer"
    },
    {
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
      dialog: "Narrator: Capybara FOREVER"
    }

    
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // Función para reproducir audio con Text-to-Speech
  const speakDialog = (text) => {
    // Detener cualquier audio previo
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES'; // Español
    utterance.rate = 0.9; // Velocidad (0.1 a 10)
    utterance.pitch = 1; // Tono (0 a 2)
    utterance.volume = 1; // Volumen (0 a 1)
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(utterance);
  };

  // Función alternativa para usar archivos de audio personalizados
  const playCustomAudio = (audioUrl) => {
    // Detener audio anterior si existe
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    
    const audio = new Audio(audioUrl);
    setCurrentAudio(audio);
    
    audio.onplay = () => setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = (e) => {
      console.error('Error al cargar el audio:', e);
      console.log('Intentando con:', audioUrl);
      setIsPlaying(false);
    };
    
    audio.play().catch(err => {
      console.error('Error al reproducir:', err);
      setIsPlaying(false);
    });
  };

  // Reproducir automáticamente cuando cambia la escena
  useEffect(() => {
    if (autoPlay) {
      const currentSlide = slides[currentIndex];
      
      // Si hay audioUrl personalizado, usarlo; si no, usar text-to-speech
      if (currentSlide.audioUrl) {
        playCustomAudio(currentSlide.audioUrl);
      } else {
        speakDialog(currentSlide.dialog);
      }
    }
  }, [currentIndex, autoPlay]);

  const nextSlide = () => {
    setIsTransitioning(true);
    
    // Detener text-to-speech
    window.speechSynthesis.cancel();
    
    // Detener audio personalizado
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    
    setIsPlaying(false);
    
    setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex >= slides.length - 1) {
          return 0;
        }
        return prevIndex + 1;
      });
      setIsTransitioning(false);
    }, 150);
  };

  const toggleAudio = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      if (currentAudio) {
        currentAudio.pause();
      }
      setIsPlaying(false);
    } else {
      const currentSlide = slides[currentIndex];
      if (currentSlide.audioUrl) {
        playCustomAudio(currentSlide.audioUrl);
      } else {
        speakDialog(currentSlide.dialog);
      }
    }
  };

  const continueToNext = () => {
    window.speechSynthesis.cancel();
    if (currentAudio) {
      currentAudio.pause();
    }
    window.location.href = "https://www.ejemplo.com/siguiente-historia";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 flex items-center justify-center p-5">
      <style>{`
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 40px rgba(102, 126, 234, 0.4),
                        0 0 80px rgba(118, 75, 162, 0.3),
                        0 0 120px rgba(102, 126, 234, 0.2);
          }
          50% {
            box-shadow: 0 0 60px rgba(102, 126, 234, 0.6),
                        0 0 100px rgba(118, 75, 162, 0.4),
                        0 0 140px rgba(102, 126, 234, 0.3);
          }
        }
        .glow-container {
          animation: glow 3s ease-in-out infinite;
        }
        @keyframes pulse-wave {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        .audio-playing {
          animation: pulse-wave 1s ease-in-out infinite;
        }
      `}</style>
      
      <div className="glow-container bg-white rounded-3xl overflow-hidden max-w-2xl w-full border-4 border-purple-400/50">
        {/* Indicación superior */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-4 px-6 text-center font-semibold text-lg tracking-wide flex items-center justify-between">
          <div className="flex-1 text-center">
            👆 Haz clic en la imagen para continuar
          </div>
          
          {/* Control de audio automático */}
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className="ml-4 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-all"
            title={autoPlay ? "Desactivar audio automático" : "Activar audio automático"}
          >
            {autoPlay ? "🔊 Auto" : "🔇 Manual"}
          </button>
        </div>

        {/* Contenedor de imagen */}
        <div 
          onClick={nextSlide}
          className="w-full h-96 bg-gray-100 flex items-center justify-center cursor-pointer relative overflow-hidden active:scale-[0.98] transition-transform duration-100"
        >
          <img
            src={slides[currentIndex].image}
            alt={`Escena ${currentIndex + 1}`}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          />
          
          {/* Indicador de audio reproduciéndose */}
          {isPlaying && (
            <div className="absolute top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-full flex items-center gap-2 audio-playing">
              <span className="text-xl">🔊</span>
              <span className="text-sm font-medium">Reproduciendo...</span>
            </div>
          )}
        </div>

        {/* Caja de diálogo */}
        <div className="p-8 bg-gray-50">
          <div className="bg-white p-5 rounded-xl border-l-4 border-purple-600 min-h-[80px] flex items-center justify-between gap-4">
            <p className="text-lg leading-relaxed text-gray-800 flex-1">
              {slides[currentIndex].dialog}
            </p>
            
            {/* Botón para reproducir/pausar audio manualmente */}
            <button
              onClick={toggleAudio}
              className="flex-shrink-0 w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-all active:scale-95"
              title={isPlaying ? "Detener audio" : "Reproducir audio"}
            >
              {isPlaying ? (
                <span className="text-xl">⏸️</span>
              ) : (
                <span className="text-xl">▶️</span>
              )}
            </button>
          </div>

          {/* Info y botón */}
          <div className="flex items-center justify-between mt-4 p-4 bg-white rounded-xl">
            <div className="text-sm text-gray-600">
              <strong>Escena:</strong> {currentIndex + 1} de {slides.length}
            </div>
            <button
              onClick={continueToNext}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-300 active:scale-95"
            >
              Continuar →
            </button>
          </div>

          {/* Instrucción */}
          <div className="text-center mt-3 text-xs text-gray-400">
            💡 Haz clic en la imagen para avanzar o usa el botón ▶️ para escuchar
          </div>
        </div>
      </div>
    </div>
  );
}