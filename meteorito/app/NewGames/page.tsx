'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';

// Tipos de meteoritos con sus propiedades
const METEORITE_TYPES = [
  {
    color: 0xff0000,
    name: 'Rojo (Ferroso)',
    weapon: 'laser',
    hp: 3,
    description: 'Meteorito rico en hierro. Debil contra laseres de alta frecuencia.',
    weaponColor: 0x00ff00
  },
  {
    color: 0x0066ff,
    name: 'Azul (Helado)',
    weapon: 'plasma',
    hp: 4,
    description: 'Meteorito congelado. Vulnerable al plasma termico.',
    weaponColor: 0xff6600
  },
  {
    color: 0xffff00,
    name: 'Amarillo (Sulfurico)',
    weapon: 'misil',
    hp: 5,
    description: 'Meteorito con compuestos sulfuricos. Requiere impacto cinetico (misiles).',
    weaponColor: 0xff0000
  },
  {
    color: 0x00ff00,
    name: 'Verde (Organico)',
    weapon: 'laser',
    hp: 2,
    description: 'Meteorito con material organico. Facil de destruir con laser.',
    weaponColor: 0x00ff00
  },
  {
    color: 0x9400d3,
    name: 'Morado (Radioactivo)',
    weapon: 'plasma',
    hp: 6,
    description: 'Meteorito radiactivo. Altamente resistente, usar plasma intenso.',
    weaponColor: 0xff6600
  },
];

export default function MeteoriteShooter() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const [showInfo, setShowInfo] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [destroyed, setDestroyed] = useState(0);
  const [currentWeapon, setCurrentWeapon] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<'info' | 'playing' | 'won' | 'lost'>('info');

  // Refs para el juego
  const destroyedRef = useRef(0);
  const currentWeaponRef = useRef(0);
  const livesRef = useRef(3);
  const keysPressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!canvasRef.current || appRef.current || !gameStarted) return;

    const initPixi = async () => {
      const app = new PIXI.Application();
      await app.init({
        width: 900,
        height: 700,
        backgroundColor: 0x0a0e27,
        antialias: true,
      });

      if (canvasRef.current) {
        canvasRef.current.appendChild(app.canvas);
      }
      appRef.current = app;

      // Fondo de estrellas
      const starsContainer = new PIXI.Container();
      for (let i = 0; i < 200; i++) {
        const star = new PIXI.Graphics();
        star.beginFill(0xffffff);
        star.drawCircle(0, 0, Math.random() * 2 + 0.5);
        star.endFill();
        star.x = Math.random() * 900;
        star.y = Math.random() * 700;
        star.alpha = Math.random() * 0.5 + 0.5;
        starsContainer.addChild(star);
      }
      app.stage.addChild(starsContainer);

      // Nave espacial
      const shipTexture = await PIXI.Assets.load('/ImagenParte2/Nave2.png');
      const ship = new PIXI.Sprite(shipTexture);
      ship.anchor.set(0.5);
      ship.scale.set(0.15, -0.15); // Voltear horizontalmente con escala negativa en Y
      ship.rotation = -Math.PI / 2;
      ship.x = 100;
      ship.y = 350;
      app.stage.addChild(ship);

      // Contenedores
      const meteoritesContainer = new PIXI.Container();
      app.stage.addChild(meteoritesContainer);

      const projectilesContainer = new PIXI.Container();
      app.stage.addChild(projectilesContainer);

      const particlesContainer = new PIXI.Container();
      app.stage.addChild(particlesContainer);

      // Control de teclado
      const handleKeyDown = (e: KeyboardEvent) => {
        keysPressed.current.add(e.key.toLowerCase());

        // Cambio de arma
        if (e.key === '1') { currentWeaponRef.current = 0; setCurrentWeapon(0); }
        if (e.key === '2') { currentWeaponRef.current = 1; setCurrentWeapon(1); }
        if (e.key === '3') { currentWeaponRef.current = 2; setCurrentWeapon(2); }
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        keysPressed.current.delete(e.key.toLowerCase());
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      // Disparar con espacio
      let canShoot = true;
      const handleShoot = (e: KeyboardEvent) => {
        if (e.key === ' ' && canShoot) {
          canShoot = false;

          const weaponType = currentWeaponRef.current;
          const weapons = [
            { color: 0x00ff00, speed: 12, size: 4 }, // Laser
            { color: 0xff6600, speed: 10, size: 6 }, // Plasma
            { color: 0xff0000, speed: 8, size: 8 },  // Misil
          ];

          const weapon = weapons[weaponType];
          const projectile = new PIXI.Graphics() as PIXI.Graphics & { vx: number; vy: number; weaponType: number };
          projectile.beginFill(weapon.color);
          projectile.drawCircle(0, 0, weapon.size);
          projectile.endFill();
          projectile.x = ship.x + 30;
          projectile.y = ship.y;
          projectile.vx = weapon.speed;
          projectile.vy = 0;
          projectile.weaponType = weaponType;
          projectilesContainer.addChild(projectile);

          setTimeout(() => { canShoot = true; }, 200);
        }
      };

      window.addEventListener('keydown', handleShoot);

      // Generar meteoritos
      let meteoritesSpawned = 0;
      const spawnMeteorite = () => {
        if (meteoritesSpawned >= 60) return;

        const type = METEORITE_TYPES[Math.floor(Math.random() * METEORITE_TYPES.length)];
        const meteorite = new PIXI.Graphics() as PIXI.Graphics & {
          hp: number;
          maxHp: number;
          meteoriteType: typeof type;
          vx: number;
        };

        meteorite.beginFill(type.color);
        meteorite.drawCircle(0, 0, 25);
        meteorite.endFill();
        meteorite.x = 900;
        meteorite.y = Math.random() * 600 + 50;
        meteorite.hp = type.hp;
        meteorite.maxHp = type.hp;
        meteorite.meteoriteType = type;
        meteorite.vx = -2 - Math.random() * 2;

        meteoritesContainer.addChild(meteorite);
        meteoritesSpawned++;
      };

      const spawnInterval = setInterval(() => {
        spawnMeteorite();
        if (meteoritesSpawned >= 60) {
          clearInterval(spawnInterval);
        }
      }, 1500);

      // Loop de juego
      app.ticker.add(() => {
        // Movimiento de nave
        if (keysPressed.current.has('w') || keysPressed.current.has('arrowup')) {
          ship.y = Math.max(30, ship.y - 5);
        }
        if (keysPressed.current.has('s') || keysPressed.current.has('arrowdown')) {
          ship.y = Math.min(670, ship.y + 5);
        }
        if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) {
          ship.x = Math.max(30, ship.x - 5);
        }
        if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) {
          ship.x = Math.min(870, ship.x + 5);
        }

        // Movimiento de proyectiles
        projectilesContainer.children.forEach((proj) => {
          const p = proj as PIXI.Graphics & { vx: number; vy: number; weaponType: number };
          p.x += p.vx;
          if (p.x > 900) {
            projectilesContainer.removeChild(p);
          }
        });

        // Movimiento de meteoritos
        meteoritesContainer.children.forEach((met) => {
          const m = met as PIXI.Graphics & {
            hp: number;
            maxHp: number;
            meteoriteType: typeof METEORITE_TYPES[0];
            vx: number;
          };
          m.x += m.vx;
          m.rotation += 0.02;

          // Colision con la nave
          const dx = m.x - ship.x;
          const dy = m.y - ship.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 40) {
            meteoritesContainer.removeChild(m);
            livesRef.current--;
            setLives(livesRef.current);

            // Efecto visual de impacto
            for (let i = 0; i < 10; i++) {
              const particle = new PIXI.Graphics() as PIXI.Graphics & { vx: number; vy: number; life: number };
              particle.beginFill(0xff0000);
              particle.drawCircle(0, 0, 4);
              particle.endFill();
              particle.x = ship.x;
              particle.y = ship.y;
              const angle = Math.random() * Math.PI * 2;
              const speed = Math.random() * 6 + 3;
              particle.vx = Math.cos(angle) * speed;
              particle.vy = Math.sin(angle) * speed;
              particle.life = 30;
              particlesContainer.addChild(particle);
            }

            if (livesRef.current <= 0) {
              setGameState('lost');
            }
          }

          if (m.x < -50) {
            meteoritesContainer.removeChild(m);
          }
        });

        // Colisiones
        projectilesContainer.children.forEach((proj) => {
          const p = proj as PIXI.Graphics & { vx: number; vy: number; weaponType: number };

          meteoritesContainer.children.forEach((met) => {
            const m = met as PIXI.Graphics & {
              hp: number;
              maxHp: number;
              meteoriteType: typeof METEORITE_TYPES[0];
              vx: number;
            };

            const dx = p.x - m.x;
            const dy = p.y - m.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 30) {
              // Verificar si el arma es correcta
              const weaponNames = ['laser', 'plasma', 'misil'];
              const isCorrectWeapon = m.meteoriteType.weapon === weaponNames[p.weaponType];

              if (isCorrectWeapon) {
                m.hp -= 1;
              } else {
                m.hp -= 0.3; // Dano reducido con arma incorrecta
              }

              // Particulas
              for (let i = 0; i < 5; i++) {
                const particle = new PIXI.Graphics() as PIXI.Graphics & { vx: number; vy: number; life: number };
                particle.beginFill(m.meteoriteType.color);
                particle.drawCircle(0, 0, 3);
                particle.endFill();
                particle.x = m.x;
                particle.y = m.y;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4 + 2;
                particle.vx = Math.cos(angle) * speed;
                particle.vy = Math.sin(angle) * speed;
                particle.life = 30;
                particlesContainer.addChild(particle);
              }

              projectilesContainer.removeChild(p);

              if (m.hp <= 0) {
                meteoritesContainer.removeChild(m);
                destroyedRef.current++;
                setDestroyed(destroyedRef.current);

                if (destroyedRef.current >= 60) {
                  setGameState('won');
                }
              }
            }
          });
        });

        // Particulas
        particlesContainer.children.forEach((particle) => {
          const p = particle as PIXI.Graphics & { vx: number; vy: number; life: number };
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.03;
          p.life -= 1;
          if (p.life <= 0) {
            particlesContainer.removeChild(p);
          }
        });

        // Parpadeo estrellas
        starsContainer.children.forEach((star) => {
          star.alpha += (Math.random() - 0.5) * 0.05;
          star.alpha = Math.max(0.3, Math.min(1, star.alpha));
        });
      });

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('keydown', handleShoot);
        clearInterval(spawnInterval);
      };
    };

    initPixi();

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  }, [gameStarted]);

  const startGame = () => {
    setShowInfo(false);
    setGameStarted(true);
    setGameState('playing');
  };

  const resetGame = () => {
    setShowInfo(true);
    setGameStarted(false);
    setDestroyed(0);
    destroyedRef.current = 0;
    setCurrentWeapon(0);
    currentWeaponRef.current = 0;
    setLives(3);
    livesRef.current = 3;
    setGameState('info');

    if (appRef.current) {
      appRef.current.destroy(true, { children: true });
      appRef.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-indigo-950 to-purple-950 flex flex-col items-center justify-center p-8 pt-24">
      {/* Pantalla de informacion */}
      {showInfo && (
        <div className="max-w-4xl bg-black bg-opacity-80 border-4 border-cyan-500 rounded-2xl p-8 mb-6">
          <h1 className="text-5xl font-bold text-white mb-6 text-center">
            🚀 DESTRUCTOR DE METEORITOS 🌠
          </h1>

          <div className="bg-cyan-900 bg-opacity-40 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-cyan-300 mb-4">📋 TIPOS DE METEORITOS</h2>
            <div className="space-y-3">
              {METEORITE_TYPES.map((type, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-black bg-opacity-50 p-3 rounded-lg">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: `#${type.color.toString(16).padStart(6, '0')}` }}
                  ></div>
                  <div className="flex-1">
                    <p className="text-white font-bold">{type.name}</p>
                    <p className="text-gray-300 text-sm">{type.description}</p>
                    <p className="text-yellow-400 text-sm">Arma efectiva: {type.weapon.toUpperCase()} | HP: {type.hp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-purple-900 bg-opacity-40 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-purple-300 mb-4">🎮 CONTROLES</h2>
            <div className="grid grid-cols-2 gap-4 text-white">
              <div>
                <p className="font-bold text-cyan-400">Movimiento:</p>
                <p>W/↑ - Arriba</p>
                <p>S/↓ - Abajo</p>
                <p>A/← - Izquierda</p>
                <p>D/→ - Derecha</p>
              </div>
              <div>
                <p className="font-bold text-cyan-400">Armas:</p>
                <p>ESPACIO - Disparar</p>
                <p>1 - Laser (verde)</p>
                <p>2 - Plasma (naranja)</p>
                <p>3 - Misil (rojo)</p>
              </div>
            </div>
          </div>

          <div className="bg-red-900 bg-opacity-40 rounded-lg p-4 mb-6">
            <p className="text-yellow-300 text-center font-bold">
              ⚠️ OBJETIVO: Destruye 60 meteoritos usando el arma correcta para cada tipo
            </p>
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-2xl font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all"
          >
            🚀 INICIAR MISION
          </button>
        </div>
      )}

      {/* Juego activo */}
      {gameStarted && gameState === 'playing' && (
        <>
          {/* Guia rapida de meteoritos y armas */}
          <div className="bg-black bg-opacity-70 border-2 border-cyan-500 rounded-lg p-4 mb-4 max-w-4xl">
            <h3 className="text-cyan-300 font-bold text-center mb-2">GUIA RAPIDA - METEORITOS Y ARMAS</h3>
            <div className="grid grid-cols-5 gap-3 text-sm">
              <div className="text-center">
                <div className="w-6 h-6 rounded-full bg-red-600 mx-auto mb-1"></div>
                <p className="text-white text-xs font-bold">Rojo</p>
                <p className="text-green-400 text-xs">🟢 Laser</p>
              </div>
              <div className="text-center">
                <div className="w-6 h-6 rounded-full bg-blue-600 mx-auto mb-1"></div>
                <p className="text-white text-xs font-bold">Azul</p>
                <p className="text-orange-400 text-xs">🟠 Plasma</p>
              </div>
              <div className="text-center">
                <div className="w-6 h-6 rounded-full bg-yellow-400 mx-auto mb-1"></div>
                <p className="text-white text-xs font-bold">Amarillo</p>
                <p className="text-red-400 text-xs">🔴 Misil</p>
              </div>
              <div className="text-center">
                <div className="w-6 h-6 rounded-full bg-green-500 mx-auto mb-1"></div>
                <p className="text-white text-xs font-bold">Verde</p>
                <p className="text-green-400 text-xs">🟢 Laser</p>
              </div>
              <div className="text-center">
                <div className="w-6 h-6 rounded-full bg-purple-600 mx-auto mb-1"></div>
                <p className="text-white text-xs font-bold">Morado</p>
                <p className="text-orange-400 text-xs">🟠 Plasma</p>
              </div>
            </div>
          </div>

          <div className="flex gap-8 mb-4">
            <div className="bg-black bg-opacity-60 border-2 border-cyan-500 rounded-lg px-6 py-3">
              <p className="text-cyan-400 text-sm">METEORITOS DESTRUIDOS</p>
              <p className="text-white text-3xl font-bold text-center">{destroyed}/60</p>
            </div>

            <div className="bg-black bg-opacity-60 border-2 border-red-500 rounded-lg px-6 py-3">
              <p className="text-red-400 text-sm">VIDAS</p>
              <p className="text-white text-3xl font-bold text-center">
                {lives === 3 && '❤️❤️❤️'}
                {lives === 2 && '❤️❤️🖤'}
                {lives === 1 && '❤️🖤🖤'}
                {lives === 0 && '🖤🖤🖤'}
              </p>
            </div>

            <div className="bg-black bg-opacity-60 border-2 border-purple-500 rounded-lg px-6 py-3">
              <p className="text-purple-400 text-sm">ARMA ACTUAL</p>
              <p className="text-white text-2xl font-bold text-center">
                {currentWeapon === 0 && '🟢 LASER'}
                {currentWeapon === 1 && '🟠 PLASMA'}
                {currentWeapon === 2 && '🔴 MISIL'}
              </p>
            </div>
          </div>

          <div ref={canvasRef} className="rounded-xl shadow-2xl mb-4 border-4 border-cyan-600"></div>

          <div className="bg-black bg-opacity-60 border-2 border-cyan-500 rounded-lg p-4 max-w-2xl">
            <p className="text-cyan-300 text-center">
              💡 Usa WASD o flechas para mover | ESPACIO para disparar | 1/2/3 para cambiar arma
            </p>
          </div>
        </>
      )}

      {/* Victoria */}
      {gameState === 'won' && (
        <div className="text-center">
          <h1 className="text-6xl font-bold text-green-400 mb-6 animate-pulse">
            🎉 ¡VICTORIA! 🎉
          </h1>
          <p className="text-white text-2xl mb-8">
            Has destruido los 60 meteoritos y salvado la galaxia
          </p>
          <button
            onClick={resetGame}
            className="px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-2xl font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all"
          >
            🔄 JUGAR DE NUEVO
          </button>
        </div>
      )}

      {/* Derrota */}
      {gameState === 'lost' && (
        <div className="text-center">
          <h1 className="text-6xl font-bold text-red-400 mb-6 animate-pulse">
            💥 GAME OVER 💥
          </h1>
          <p className="text-white text-2xl mb-4">
            Demasiados meteoritos pasaron
          </p>
          <p className="text-cyan-300 text-lg mb-8">
            Meteoritos destruidos: {destroyed}/60
          </p>
          <button
            onClick={resetGame}
            className="px-10 py-5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-2xl font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all"
          >
            🔄 INTENTAR DE NUEVO
          </button>
        </div>
      )}
    </div>
  );
}
