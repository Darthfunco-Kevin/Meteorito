"use client";
import { useState, useEffect } from "react";

export default function ImageDialogChanger() {
  type Slide = {
    image: string;
    dialog: string;
    audioUrl?: string;
  };

  const slides: Slide[] = [
    {
      image: "Lineal/H1.png",
      dialog:
        "Narrator: The story begins somewhere in space, specifically in the galaxy NGC 6744.",
      //audioUrl:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      // Opcional: puedes agregar una URL de audio personalizado
      // audioUrl: "/audios/escena1.mp3"
    },
    {
      image:
        "Lineal/H2.png",
      dialog:
        "Narrator: A civilization was celebrating its traditions, unaware that a catastrophic meteor shower was soon to strike their planet. ",
    },
    {
      image:
        "Lineal/H3.png",
      dialog:
        "Narrator: It was too late when they realized the dreadful truth. Without wasting another second, they tried to find a possible solution — but their greatest fear was the meteor known as IMPACTOR.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
      dialog:
        "Narrator: The day came — the day that would determine the survival of their civilization. Despite their efforts to divert it, it wasn’t enough.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800",
      dialog:
        "Narrator: Their civilization, their ancestors, their history, their culture… all vanished from the face of the universe.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
      dialog:
        "Narrator: Time flowed like a single drop of water. That simple story slowly faded from memory — forgotten by the universe, as new generations focused only on their own struggles, ignoring the lessons of the past.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
      dialog:
        "Narrator: However, one capybara, upon learning of this tragedy, reflected deeply on the consequences for those without the means to defend themselves. His civilization, unlike others, had the technology and strength to make a difference.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
      dialog:
        "Narrator: It was a mission that could cost him his life. Yet, the capybara was ready to follow his destiny, his purpose — his reason for being — even though his family opposed his decision.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
      dialog:
        "Narrator: It was hard to leave behind everyone he loved. So, he left a farewell letter, promising to return one day.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
      dialog:
        "Capybara: If the universe forgets, I will remember. I’ll return when the sky and space are safe again",
    },
    {
      image:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
      dialog:
        "Capybara: Hold on… I’ll be there in a few minutes.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
      dialog:
        "Capybara: Scientist: I thought your existence was just a rumor, sir…",
    },
     {
      image:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
      dialog:
        "Capybara: Capybara forever!",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );

  // Función para reproducir audio con Text-to-Speech
  const speakDialog = (text: string) => {
    // Detener cualquier audio previo
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; // Inglés
    utterance.rate = 0.9; // Velocidad (0.1 a 10)
    utterance.pitch = 0.8; // Tono (0 a 2)
    utterance.volume = 1; // Volumen (0 a 1)

    // Intentar seleccionar una voz masculina en inglés
    const voices = window.speechSynthesis.getVoices();
    const englishVoice =
      voices.find(
        (voice) =>
          (voice.lang.includes("en-US") || voice.lang.includes("en_US")) &&
          (voice.name.includes("Male") ||
            voice.name.includes("David") ||
            voice.name.includes("Mark"))
      ) ||
      voices.find(
        (voice) => voice.lang.includes("en-US") || voice.lang.includes("en_US")
      );

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  // Función alternativa para usar archivos de audio personalizados
  const playCustomAudio = (audioUrl: string) => {
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
      console.error("Error al cargar el audio:", e);
      console.log("Intentando con:", audioUrl);
      setIsPlaying(false);
    };

    audio.play().catch((err) => {
      console.error("Error al reproducir:", err);
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
    window.location.href = "/games"; // Cambia esto a la URL deseada
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-5">
      <style>{`
        @keyframes starfield {
          0% { transform: translateY(0) translateX(0); }
          100% { transform: translateY(100vh) translateX(10vw); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes nebula-float {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { transform: translate(50px, 30px) scale(1.1); opacity: 0.5; }
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
          filter: blur(60px);
          animation: nebula-float ease-in-out infinite;
        }
        .glow-container {
          animation: cosmic-glow 4s ease-in-out infinite;
          position: relative;
          z-index: 10;
        }
        @keyframes pulse-wave {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        .audio-playing {
          animation: pulse-wave 1s ease-in-out infinite;
        }
      `}</style>

      {/* Fondo espacial */}
      <div className="space-background"></div>

      {/* Nebulosas */}
      <div className="nebula" style={{
        top: '10%',
        left: '15%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4), transparent)',
        animationDuration: '8s'
      }}></div>
      <div className="nebula" style={{
        top: '60%',
        right: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(79, 70, 229, 0.3), transparent)',
        animationDuration: '10s',
        animationDelay: '2s'
      }}></div>
      <div className="nebula" style={{
        bottom: '20%',
        left: '30%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2), transparent)',
        animationDuration: '12s',
        animationDelay: '4s'
      }}></div>

      {/* Estrellas dinámicas */}
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="stars"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${15 + Math.random() * 20}s, ${2 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 5}s, ${Math.random() * 2}s`,
            opacity: Math.random() * 0.7 + 0.3
          }}
        ></div>
      ))}

      <div className="glow-container bg-white rounded-3xl overflow-hidden max-w-2xl w-full border-4 border-purple-400/50">
        {/* Indicación superior */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-4 px-6 text-center font-semibold text-lg tracking-wide flex items-center justify-between">
          <div className="flex-1 text-center">
            👆 Click on the image to continue
          </div>

          {/* Control de audio automático */}
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className="ml-4 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-all"
            title={
              autoPlay
                ? "Desactivar audio automático"
                : "Activar audio automático"
            }
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
            className={`w-full h-full object-contain transition-opacity duration-300 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* Indicador de audio reproduciéndose */}
          {isPlaying && (
            <div className="absolute top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-full flex items-center gap-2 audio-playing">
              <span className="text-xl">🔊</span>
              <span className="text-sm font-medium">Playing...</span>
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
              <strong>Scene:</strong> {currentIndex + 1} de {slides.length}
            </div>
            <button
              onClick={continueToNext}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-300 active:scale-95"
            >
              Continue →
            </button>
          </div>

          {/* Instrucción */}
          <div className="text-center mt-3 text-xs text-gray-400">
            💡Click on the image to advance or use the ▶️ button to listen.
          </div>
        </div>
      </div>
    </div>
  );
}
