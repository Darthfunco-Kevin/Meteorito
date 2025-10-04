"use client";

import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { useRouter } from "next/navigation";

export default function MeteorGame() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const meteorsRef = useRef<any[]>([]);
  const bulletsRef = useRef<any[]>([]);
  const shipRef = useRef<any>(null);
  const gameOverRef = useRef(false);
  const keysRef = useRef({ a: false, d: false });
  const starsRef = useRef<any[]>([]);
  const healthRef = useRef(100);
  const invulnerableRef = useRef(false);

  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // RUTAS DE TUS IMÁGENES - Colócalas en la carpeta public/images/
  const SHIP_IMAGE = "/ImagenParte1/nave.png";
  const METEOR_IMAGE = "/ImagenParte1/meteorito.png";
  const PLANET_IMAGE = "/ImagenParte1/Planeta1.png";

  useEffect(() => {
    if (!canvasRef.current) return;

    const initGame = async () => {
      const app = new PIXI.Application();

      await app.init({
        width: 850,
        height: 650,
        backgroundColor: 0x000000,
        canvas: canvasRef.current!,
      });

      appRef.current = app;

      // Cargar texturas desde las imágenes
      let shipTexture: PIXI.Texture | null = null;
      let meteorTexture: PIXI.Texture | null = null;
      let planetTexture: PIXI.Texture | null = null;

      try {
        // Intentar cargar las imágenes personalizadas
        shipTexture = await PIXI.Assets.load(SHIP_IMAGE);
      } catch (error) {
        console.log("No se encontró imagen de nave, usando diseño por defecto");
      }

      try {
        meteorTexture = await PIXI.Assets.load(METEOR_IMAGE);
      } catch (error) {
        console.log(
          "No se encontró imagen de meteorito, usando diseño por defecto"
        );
      }

      try {
        planetTexture = await PIXI.Assets.load(PLANET_IMAGE);
      } catch (error) {
        console.log(
          "No se encontró imagen de planeta, usando diseño por defecto"
        );
      }

      // Crear fondo de estrellas
      const createStars = () => {
        for (let i = 0; i < 200; i++) {
          const star = new PIXI.Graphics();
          const size = Math.random() * 2;
          const brightness = 0.3 + Math.random() * 0.7;

          star.rect(0, 0, size, size);
          star.fill({ color: 0xffffff, alpha: brightness });

          star.x = Math.random() * app.screen.width;
          star.y = Math.random() * (app.screen.height - 120);
          (star as any).speed = 0.2 + Math.random() * 0.5;

          app.stage.addChild(star);
          starsRef.current.push(star);
        }
      };

      createStars();

      // Crear planeta en la parte inferior
      let planet: any;
      if (planetTexture) {
        planet = new PIXI.Sprite(planetTexture);
        planet.anchor.set(0.5);
        planet.x = app.screen.width / 2;
        planet.y = app.screen.height + 60;
        planet.width = 400;
        planet.height = 400;
      } else {
        // Diseño por defecto
        planet = new PIXI.Graphics();
        planet.circle(app.screen.width / 2, app.screen.height + 150, 200);
        planet.fill(0x4169e1);

        planet.circle(app.screen.width / 2 - 50, app.screen.height + 120, 60);
        planet.circle(app.screen.width / 2 + 70, app.screen.height + 140, 50);
        planet.circle(app.screen.width / 2 + 20, app.screen.height + 180, 45);
        planet.fill({ color: 0x228b22, alpha: 0.6 });

        planet.circle(app.screen.width / 2 - 80, app.screen.height + 100, 30);
        planet.circle(app.screen.width / 2 + 90, app.screen.height + 110, 25);
        planet.fill({ color: 0xffffff, alpha: 0.3 });
      }

      app.stage.addChild(planet);

      // Crear nave espacial
      let ship: any;
      if (shipTexture) {
        ship = new PIXI.Sprite(shipTexture);
        ship.anchor.set(0.5);
        ship.width = 60;
        ship.height = 60;
      } else {
        // Diseño por defecto
        ship = new PIXI.Graphics();
        ship.moveTo(0, -25);
        ship.lineTo(-18, 15);
        ship.lineTo(-8, 10);
        ship.lineTo(0, 12);
        ship.lineTo(8, 10);
        ship.lineTo(18, 15);
        ship.closePath();
        ship.fill(0x00ffff);

        ship.circle(0, -5, 6);
        ship.fill(0x0080ff);

        ship.circle(0, -5, 3);
        ship.fill({ color: 0xffff00, alpha: 0.8 });

        ship.moveTo(-18, 15);
        ship.lineTo(-22, 18);
        ship.moveTo(18, 15);
        ship.lineTo(22, 18);
        ship.stroke({ width: 2, color: 0x00ff00 });
      }

      ship.x = app.screen.width / 2;
      ship.y = app.screen.height - 80;
      (ship as any).vx = 0;
      (ship as any).baseY = app.screen.height - 80;

      app.stage.addChild(ship);
      shipRef.current = ship;

      // Función para crear meteorito
      const createMeteor = () => {
        if (gameOverRef.current) return;

        let meteor: any;
        const size = 40 + Math.random() * 30;

        if (meteorTexture) {
          meteor = new PIXI.Sprite(meteorTexture);
          meteor.anchor.set(0.5);
          meteor.width = size;
          meteor.height = size;
        } else {
          // Diseño por defecto
          meteor = new PIXI.Graphics();
          meteor.circle(0, 0, size / 2);
          meteor.fill(0xff4500);

          meteor.circle(-size / 6, -size / 6, size / 4);
          meteor.fill(0x8b0000);

          meteor.circle(size / 8, size / 8, size / 6);
          meteor.fill(0xff6347);

          meteor.circle(-size / 8, -size / 8, size / 8);
          meteor.fill({ color: 0xff8c00, alpha: 0.5 });
        }

        meteor.x = Math.random() * app.screen.width;
        meteor.y = -size;
        (meteor as any).speed = 1 + Math.random() * 2;
        (meteor as any).size = size / 2;
        meteor.rotation = Math.random() * Math.PI * 2;
        (meteor as any).rotationSpeed = (Math.random() - 0.5) * 0.1;

        app.stage.addChild(meteor);
        meteorsRef.current.push(meteor);
      };

      const checkCollision = (bullet: any, meteor: any) => {
        const dx = bullet.x - meteor.x;
        const dy = bullet.y - meteor.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < meteor.size + 4;
      };

      const checkShipMeteorCollision = (ship: any, meteor: any) => {
        const dx = ship.x - meteor.x;
        const dy = ship.y - meteor.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < meteor.size + 20;
      };

      const takeDamage = (amount: number) => {
        if (invulnerableRef.current) return;

        healthRef.current -= amount;
        setHealth(healthRef.current);

        shipRef.current.tint = 0xff0000;
        setTimeout(() => {
          if (shipRef.current) shipRef.current.tint = 0xffffff;
        }, 200);

        invulnerableRef.current = true;
        setTimeout(() => {
          invulnerableRef.current = false;
        }, 1000);

        if (healthRef.current <= 0) {
          gameOverRef.current = true;
          setGameWon(false);
          setShowGameOver(true);
        }
      };

      // Loop principal del juego
      app.ticker.add(() => {
        if (gameOverRef.current) return;

        starsRef.current.forEach((star) => {
          star.y += (star as any).speed;
          if (star.y > app.screen.height - 120) {
            star.y = 0;
            star.x = Math.random() * app.screen.width;
          }
        });

        if (keysRef.current.a) {
          shipRef.current.vx = -6;
        } else if (keysRef.current.d) {
          shipRef.current.vx = 6;
        } else {
          shipRef.current.vx *= 0.9;
        }

        shipRef.current.x += shipRef.current.vx;

        if (shipRef.current.x < 30) shipRef.current.x = 30;
        if (shipRef.current.x > app.screen.width - 30)
          shipRef.current.x = app.screen.width - 30;

        if (shipRef.current.y > shipRef.current.baseY + 10) {
          takeDamage(20);
          shipRef.current.y = shipRef.current.baseY;
        }

        meteorsRef.current.forEach((meteor, index) => {
          meteor.y += meteor.speed;
          meteor.rotation += meteor.rotationSpeed;

          if (checkShipMeteorCollision(shipRef.current, meteor)) {
            takeDamage(15);

            const explosion = new PIXI.Graphics();
            explosion.circle(0, 0, meteor.size * 1.5);
            explosion.fill({ color: 0xff0000, alpha: 0.8 });
            explosion.x = meteor.x;
            explosion.y = meteor.y;
            app.stage.addChild(explosion);

            setTimeout(() => {
              app.stage.removeChild(explosion);
            }, 150);

            app.stage.removeChild(meteor);
            meteorsRef.current.splice(index, 1);
            return;
          }

          if (meteor.y > app.screen.height + meteor.size) {
            app.stage.removeChild(meteor);
            meteorsRef.current.splice(index, 1);
          }
        });

        bulletsRef.current.forEach((bullet, bIndex) => {
          bullet.y -= bullet.speed;

          if (bullet.y < -10) {
            app.stage.removeChild(bullet);
            bulletsRef.current.splice(bIndex, 1);
            return;
          }

          meteorsRef.current.forEach((meteor, mIndex) => {
            if (checkCollision(bullet, meteor)) {
              const explosion = new PIXI.Graphics();
              explosion.circle(0, 0, meteor.size * 1.5);
              explosion.fill({ color: 0xffff00, alpha: 0.8 });
              explosion.x = meteor.x;
              explosion.y = meteor.y;
              app.stage.addChild(explosion);

              setTimeout(() => {
                app.stage.removeChild(explosion);
              }, 100);

              app.stage.removeChild(meteor);
              app.stage.removeChild(bullet);
              meteorsRef.current.splice(mIndex, 1);
              bulletsRef.current.splice(bIndex, 1);

              setScore((prev) => {
                const newScore = prev + 1;
                if (newScore >= 20) {
                  gameOverRef.current = true;
                  setGameWon(true);
                  setShowGameOver(true);
                }
                return newScore;
              });
            }
          });
        });
      });

      const meteorInterval = setInterval(createMeteor, 1500);
      (appRef.current as any).meteorInterval = meteorInterval;
    };

    initGame();

    return () => {
      if (appRef.current) {
        // Detener el ticker antes de destruir
        appRef.current.ticker.stop();

        // Limpiar el intervalo de meteoritos
        if ((appRef.current as any).meteorInterval) {
          clearInterval((appRef.current as any).meteorInterval);
        }

        // Limpiar todos los objetos del stage
        meteorsRef.current.forEach((m) => appRef.current?.stage.removeChild(m));
        bulletsRef.current.forEach((b) => appRef.current?.stage.removeChild(b));
        starsRef.current.forEach((s) => appRef.current?.stage.removeChild(s));

        // Destruir la aplicación
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      }

      // Resetear referencias
      meteorsRef.current = [];
      bulletsRef.current = [];
      starsRef.current = [];
      shipRef.current = null;
    };
  }, []);

  const shoot = () => {
    if (gameOverRef.current || !appRef.current) return;

    const bullet = new PIXI.Graphics();

    bullet.rect(-2, -8, 4, 16);
    bullet.fill(0x00ffff);

    bullet.rect(-1, -6, 2, 12);
    bullet.fill({ color: 0xffffff, alpha: 0.6 });

    bullet.x = shipRef.current.x;
    bullet.y = shipRef.current.y - 30;
    (bullet as any).speed = 10;

    appRef.current.stage.addChild(bullet);
    bulletsRef.current.push(bullet);
  };

  const WinGame = () => {
    // Limpiar el juego antes de navegar
    gameOverRef.current = true;
    if (appRef.current) {
      if ((appRef.current as any).meteorInterval) {
        clearInterval((appRef.current as any).meteorInterval);
      }
      appRef.current.ticker.stop();
    }
    router.push("/historia1/historia2");
  };

  const restartGame = () => {
    gameOverRef.current = false;
    healthRef.current = 100;
    invulnerableRef.current = false;
    setScore(0);
    setHealth(100);
    setShowGameOver(false);
    setGameWon(false);

    meteorsRef.current.forEach((m) => appRef.current?.stage.removeChild(m));
    bulletsRef.current.forEach((b) => appRef.current?.stage.removeChild(b));
    meteorsRef.current = [];
    bulletsRef.current = [];

    if (shipRef.current) {
      shipRef.current.y = shipRef.current.baseY;
      shipRef.current.tint = 0xffffff;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "a" || e.key === "A") keysRef.current.a = true;
      if (e.key === "d" || e.key === "D") keysRef.current.d = true;
      if (e.code === "Space" && !gameOverRef.current) {
        e.preventDefault();
        shoot();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "a" || e.key === "A") keysRef.current.a = false;
      if (e.key === "d" || e.key === "D") keysRef.current.d = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black via-indigo-950 to-purple-950 p-4">
      <div className="text-center mb-5">
        <h1
          className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-3"
          style={{ textShadow: "0 0 30px rgba(59, 130, 246, 0.5)" }}
        >
          🚀 DESTRUCTOR DE METEORITOS
        </h1>
        <div className="flex justify-center items-center gap-8 mb-2">
          <div className="text-3xl text-yellow-300 font-bold">
            Meteoritos: {score} / 20
          </div>
          <div className="text-3xl font-bold">
            <span
              className={
                health > 50
                  ? "text-green-400"
                  : health > 25
                  ? "text-yellow-400"
                  : "text-red-500"
              }
            >
              ❤️ Salud: {health}%
            </span>
          </div>
        </div>
        <div className="w-80 mx-auto h-6 bg-gray-800 rounded-full overflow-hidden border-2 border-gray-600">
          <div
            className={`h-full transition-all duration-300 ${
              health > 50
                ? "bg-gradient-to-r from-green-400 to-green-600"
                : health > 25
                ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                : "bg-gradient-to-r from-red-500 to-red-700"
            }`}
            style={{ width: `${health}%` }}
          />
        </div>
        <div className="text-sm text-cyan-300 mt-2">
          Usa A y D para mover la nave | ESPACIO para disparar
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="rounded-xl border-4 border-cyan-400 shadow-2xl shadow-cyan-500/50"
          style={{ boxShadow: "0 0 40px rgba(34, 211, 238, 0.4)" }}
        />

        {showGameOver && (
          <div
            className="absolute inset-0 bg-black bg-opacity-95 flex flex-col items-center justify-center rounded-xl border-4"
            style={{
              backdropFilter: "blur(10px)",
              borderColor: gameWon ? "#fcd34d" : "#ef4444",
            }}
          >
            <h2
              className={`text-6xl font-bold text-transparent bg-clip-text mb-5 animate-pulse ${
                gameWon
                  ? "bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500"
                  : "bg-gradient-to-r from-red-500 via-red-600 to-red-700"
              }`}
            >
              {gameWon ? "¡VICTORIA! 🎉" : "GAME OVER 💥"}
            </h2>
            <p className="text-2xl text-white mb-2">
              {gameWon ? "¡Has salvado el planeta!" : "¡Tu nave fue destruida!"}
            </p>
            <p className="text-lg text-gray-300 mb-8">
              Meteoritos destruidos: {score} / 20
            </p>
            <button
              onClick={gameWon ? WinGame : restartGame}
              className={`px-12 py-5 text-2xl font-bold text-white rounded-xl transform hover:scale-110 transition-all shadow-lg animate-pulse ${
                gameWon
                  ? "bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 hover:from-green-500 hover:via-emerald-600 hover:to-teal-700 shadow-green-500/50"
                  : "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 shadow-blue-500/50"
              }`}
            >
              {gameWon ? "🔄 Continuar" : "🔄 Reintentar"}
            </button>
          </div>
        )}
      </div>

      <button
        onClick={shoot}
        disabled={showGameOver}
        className="mt-6 px-12 py-4 text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl hover:from-red-600 hover:to-orange-700 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/50"
      >
        ⚡ DISPARAR
      </button>

      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-lg border border-cyan-500/30 backdrop-blur-sm">
        <p className="text-cyan-300 font-semibold mb-2">🎮 CONTROLES:</p>
        <p className="text-white text-sm">
          🔹 Tecla{" "}
          <kbd className="px-2 py-1 bg-cyan-500/20 rounded border border-cyan-400">
            A
          </kbd>{" "}
          - Mover izquierda
        </p>
        <p className="text-white text-sm">
          🔹 Tecla{" "}
          <kbd className="px-2 py-1 bg-cyan-500/20 rounded border border-cyan-400">
            D
          </kbd>{" "}
          - Mover derecha
        </p>
        <p className="text-white text-sm">
          🔹 Tecla{" "}
          <kbd className="px-2 py-1 bg-cyan-500/20 rounded border border-cyan-400">
            ESPACIO
          </kbd>{" "}
          - Disparar láser
        </p>
        <p className="text-red-400 text-sm mt-2">
          ⚠️ ¡Evita los meteoritos! Cada colisión quita 15% de salud
        </p>
        <p className="text-red-400 text-sm">
          ⚠️ ¡No toques el suelo! Pierdes 20% de salud
        </p>
      </div>
    </div>
  );
}
