"use client";

import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { Assets } from "pixi.js";
import { useRouter } from "next/navigation";

// Interfaces para tipar los objetos del juego
type GameSprite = (PIXI.Sprite | PIXI.Graphics) & {
  vx?: number;
  baseY?: number;
  speed?: number;
  size?: number;
  rotationSpeed?: number;
};

interface Star extends PIXI.Graphics {
  speed: number;
}

// 💡 Interfaz para extender PIXI.Application y tipar la propiedad personalizada
interface GameApplication extends PIXI.Application {
  meteorInterval?: NodeJS.Timeout;
}

export default function MeteorGame() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<GameApplication | null>(null);
  const meteorsRef = useRef<GameSprite[]>([]);
  const bulletsRef = useRef<GameSprite[]>([]);
  const shipRef = useRef<GameSprite | null>(null);
  const gameOverRef = useRef(false);
  const keysRef = useRef({ a: false, d: false });
  const starsRef = useRef<Star[]>([]);
  const healthRef = useRef(100);
  const invulnerableRef = useRef(false);

  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false); // RUTAS DE TUS IMÁGENES - Colócalas en la carpeta public/images/

  const SHIP_IMAGE = "/ImagenParte1/nave.png";
  const METEOR_IMAGE = "/ImagenParte1/meteorito.png";
  const Entorno_IMAGE = "/ImagenParte1/Fondo2.png";

  useEffect(() => {
    if (!canvasRef.current) return;

    const initGame = async () => {
      // 🛑 CORRECCIÓN DE ERROR DE COMPILACIÓN:
      // Las opciones de PIXI.Application se pasan al constructor, no a .init()
      const app: GameApplication = new PIXI.Application({
        width: 850,
        height: 650,
        backgroundColor: 0x000000,
      });

      // Replace the generated canvas with your ref canvas
      if (canvasRef.current) {
        canvasRef.current.replaceWith(app.view);
        // Optionally, update the ref to point to the new canvas
        canvasRef.current = app.view as HTMLCanvasElement;
      }
      // El 'await app.init({...})' ya NO es necesario y fue eliminado.

      appRef.current = app; // Cargar texturas desde las imágenes

      let shipTexture: PIXI.Texture | null = null;
      let meteorTexture: PIXI.Texture | null = null;
      let entornoTexture: PIXI.Texture | null = null;

      try {
        shipTexture = await Assets.load(SHIP_IMAGE); // ✅ Corregido
      } catch (error) {}

      try {
        meteorTexture = await Assets.load(METEOR_IMAGE);
      } catch (error) {
        // ⚠️ Corregido: 'loadError' eliminado
        console.log(
          "No se encontró imagen de meteorito, usando diseño por defecto"
        );
      }

      try {
        entornoTexture = await Assets.load(Entorno_IMAGE);
      } catch (error) {
        // ⚠️ Corregido: 'loadError' eliminado
        console.log(
          "No se encontró imagen de fondo, usando diseño por defecto"
        );
      } // Crear fondo (entorno)

      if (entornoTexture) {
        const entorno = new PIXI.Sprite(entornoTexture);
        entorno.anchor.set(0);
        entorno.width = 850;
        entorno.height = 650;
        app.stage.addChild(entorno);
      } // Crear nave espacial

      let ship: GameSprite;
      if (shipTexture) {
        const shipSprite = new PIXI.Sprite(shipTexture);
        shipSprite.anchor.set(0.5);
        shipSprite.width = 120;
        shipSprite.height = 120; // Casting directo: PIXI.Sprite es un DisplayObject y cumple con GameSprite
        ship = shipSprite as GameSprite;
      } else {
        // Diseño por defecto
        const shipGraphics = new PIXI.Graphics();
        shipGraphics.moveTo(0, -25);
        shipGraphics.lineTo(-18, 15);
        shipGraphics.lineTo(-8, 10);
        shipGraphics.lineTo(0, 12);
        shipGraphics.lineTo(8, 10);
        shipGraphics.lineTo(18, 15);
        shipGraphics.closePath();
        shipGraphics.fill(0x00ffff);

        shipGraphics.circle(0, -5, 6);
        shipGraphics.fill(0x0080ff);

        shipGraphics.circle(0, -5, 3);
        shipGraphics.fill({ color: 0xffff00, alpha: 0.8 });

        shipGraphics.moveTo(-18, 15);
        shipGraphics.lineTo(-22, 18);
        shipGraphics.moveTo(18, 15);
        shipGraphics.lineTo(22, 18);
        shipGraphics.stroke({ width: 2, color: 0x00ff00 });
        ship = shipGraphics as GameSprite;
      }

      ship.x = app.screen.width / 2;
      ship.y = app.screen.height - 80;
      ship.vx = 0;
      ship.baseY = app.screen.height - 80;

      app.stage.addChild(ship);
      shipRef.current = ship; // Función para crear meteorito

      const createMeteor = () => {
        if (gameOverRef.current) return;

        let meteor: GameSprite;
        const size = 40 + Math.random() * 30;

        if (meteorTexture) {
          const meteorSprite = new PIXI.Sprite(meteorTexture);
          meteorSprite.anchor.set(0.5);
          meteorSprite.width = size;
          meteorSprite.height = size;
          meteor = meteorSprite as GameSprite;
        } else {
          // Diseño por defecto
          const meteorGraphics = new PIXI.Graphics();
          meteorGraphics.circle(0, 0, size / 2);
          meteorGraphics.fill(0xff4500);

          meteorGraphics.circle(-size / 6, -size / 6, size / 4);
          meteorGraphics.fill(0x8b0000);

          meteorGraphics.circle(size / 8, size / 8, size / 6);
          meteorGraphics.fill(0xff6347);

          meteorGraphics.circle(-size / 8, -size / 8, size / 8);
          meteorGraphics.fill({ color: 0xff8c00, alpha: 0.5 });
          meteor = meteorGraphics as GameSprite;
        }

        meteor.x = Math.random() * app.screen.width;
        meteor.y = -size;
        meteor.speed = 1 + Math.random() * 2;
        meteor.size = size / 2;
        meteor.rotation = Math.random() * Math.PI * 2;
        meteor.rotationSpeed = (Math.random() - 0.5) * 0.1;

        app.stage.addChild(meteor);
        meteorsRef.current.push(meteor);
      };

      const checkCollision = (
        bullet: GameSprite,
        meteor: GameSprite
      ): boolean => {
        const dx = bullet.x - meteor.x;
        const dy = bullet.y - meteor.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (meteor.size || 0) + 4;
      };

      const checkShipMeteorCollision = (
        ship: GameSprite,
        meteor: GameSprite
      ): boolean => {
        const dx = ship.x - meteor.x;
        const dy = ship.y - meteor.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (meteor.size || 0) + 20;
      }; // 💡 Función para detener el juego (para evitar duplicación)

      const stopGameResources = () => {
        app.ticker.stop();
        if (app.meteorInterval) {
          clearInterval(app.meteorInterval);
          delete app.meteorInterval;
        }
      };

      const takeDamage = (amount: number) => {
        if (invulnerableRef.current || !shipRef.current) return;

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
          stopGameResources(); // Detener recursos al perder
        }
      }; // Loop principal del juego

      app.ticker.add(() => {
        if (gameOverRef.current || !shipRef.current) return;

        starsRef.current.forEach((star) => {
          star.y += star.speed;
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
          shipRef.current.vx = (shipRef.current.vx || 0) * 0.9;
        }

        shipRef.current.x += shipRef.current.vx || 0;

        if (shipRef.current.x < 30) shipRef.current.x = 30;
        if (shipRef.current.x > app.screen.width - 30)
          shipRef.current.x = app.screen.width - 30;

        if (
          shipRef.current.baseY &&
          shipRef.current.y > shipRef.current.baseY + 10
        ) {
          takeDamage(20);
          shipRef.current.y = shipRef.current.baseY;
        }

        meteorsRef.current.forEach((meteor, index) => {
          meteor.y += meteor.speed || 0;
          meteor.rotation += meteor.rotationSpeed || 0;

          if (
            shipRef.current &&
            checkShipMeteorCollision(shipRef.current, meteor)
          ) {
            takeDamage(15);

            const explosion = new PIXI.Graphics();
            explosion.circle(0, 0, (meteor.size || 20) * 1.5);
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

          if (meteor.y > app.screen.height + (meteor.size || 0)) {
            app.stage.removeChild(meteor);
            meteorsRef.current.splice(index, 1);
          }
        });

        bulletsRef.current.forEach((bullet, bIndex) => {
          bullet.y -= bullet.speed || 0;

          if (bullet.y < -10) {
            app.stage.removeChild(bullet);
            bulletsRef.current.splice(bIndex, 1);
            return;
          }

          meteorsRef.current.forEach((meteor, mIndex) => {
            if (checkCollision(bullet, meteor)) {
              const explosion = new PIXI.Graphics();
              explosion.circle(0, 0, (meteor.size || 20) * 1.5);
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
                  stopGameResources(); // Detener recursos al ganar
                }
                return newScore;
              });
            }
          });
        });
      });

      const meteorInterval = setInterval(createMeteor, 1500); // 💡 Ahora la propiedad está tipada
      app.meteorInterval = meteorInterval;
    };

    initGame();

    return () => {
      if (appRef.current) {
        // 💡 Limpieza de intervalo tipada
        if (appRef.current.meteorInterval) {
          clearInterval(appRef.current.meteorInterval);
        }
        appRef.current.destroy(true);
      }
    };
  }, []);

  const shoot = () => {
    if (gameOverRef.current || !appRef.current || !shipRef.current) return;

    const bulletGraphics = new PIXI.Graphics();

    bulletGraphics.rect(-2, -8, 4, 16);
    bulletGraphics.fill(0x00ffff);

    bulletGraphics.rect(-1, -6, 2, 12);
    bulletGraphics.fill({ color: 0xffffff, alpha: 0.6 });

    bulletGraphics.x = shipRef.current.x;
    bulletGraphics.y = shipRef.current.y - 30;
    (bulletGraphics as unknown as GameSprite).speed = 10;

    appRef.current.stage.addChild(bulletGraphics);
    bulletsRef.current.push(bulletGraphics as unknown as GameSprite);
  };

  const WinGame = () => {
    // Se asegura que el juego ya fue detenido en el PIXI.ticker antes de navegar
    router.push("/historia1/historia2/historia3");
  };

  const restartGame = () => {
    // Detener la aplicación actual (esto es vital para reiniciar PIXI)
    if (appRef.current) {
      appRef.current.destroy(true);
      appRef.current = null;
    }

    gameOverRef.current = false;
    healthRef.current = 100;
    invulnerableRef.current = false;
    setScore(0);
    setHealth(100);
    setShowGameOver(false);
    setGameWon(false); // Al re-renderizar, el useEffect con [] llamará a initGame() de nuevo, // reinicializando el juego por completo.
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
      {" "}
      <div className="text-center mb-5">
        {" "}
        <h1
          className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-3"
          style={{ textShadow: "0 0 30px rgba(59, 130, 246, 0.5)" }}
        >
          {" "}
          🚀 DESTRUCTOR DE METEORITOS
        </h1>{" "}
        <div className="flex justify-center items-center gap-8 mb-2">
          {" "}
          <div className="text-3xl text-yellow-300 font-bold">
            {" "}
            Meteoritos: {score} / 20
          </div>{" "}
          <div className="text-3xl font-bold">
            {" "}
            <span
              className={
                health > 50
                  ? "text-green-400"
                  : health > 25
                  ? "text-yellow-400"
                  : "text-red-500"
              }
            >
              {" "}
              ❤️ Salud: {health}%
            </span>{" "}
          </div>{" "}
        </div>{" "}
        <div className="w-80 mx-auto h-6 bg-gray-800 rounded-full overflow-hidden border-2 border-gray-600">
          {" "}
          <div
            className={`h-full transition-all duration-300 ${
              health > 50
                ? "bg-gradient-to-r from-green-400 to-green-600"
                : health > 25
                ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                : "bg-gradient-to-r from-red-500 to-red-700"
            }`}
            style={{ width: `${health}%` }}
          />{" "}
        </div>{" "}
        <div className="text-sm text-cyan-300 mt-2">
          {" "}
          Usa A y D para mover la nave | ESPACIO para disparar
        </div>{" "}
      </div>{" "}
      <div className="relative">
        {" "}
        <canvas
          ref={canvasRef}
          className="rounded-xl border-4 border-cyan-400 shadow-2xl shadow-cyan-500/50"
          style={{ boxShadow: "0 0 40px rgba(34, 211, 238, 0.4)" }}
        />{" "}
        {showGameOver && (
          <div
            className="absolute inset-0 bg-black bg-opacity-95 flex flex-col items-center justify-center rounded-xl border-4"
            style={{
              backdropFilter: "blur(10px)",
              borderColor: gameWon ? "#fcd34d" : "#ef4444",
            }}
          >
            {" "}
            <h2
              className={`text-6xl font-bold text-transparent bg-clip-text mb-5 animate-pulse ${
                gameWon
                  ? "bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500"
                  : "bg-gradient-to-r from-red-500 via-red-600 to-red-700"
              }`}
            >
              {" "}
              {gameWon ? "¡VICTORIA! 🎉" : "GAME OVER 💥"}
            </h2>{" "}
            <p className="text-2xl text-white mb-2">
              {" "}
              {gameWon
                ? "¡Has salvado el planeta!"
                : "¡Tu nave fue destruida!"}{" "}
            </p>{" "}
            <p className="text-lg text-gray-300 mb-8">
              {" "}
              Meteoritos destruidos: {score} / 20
            </p>{" "}
            <button
              onClick={gameWon ? WinGame : restartGame}
              className={`px-12 py-5 text-2xl font-bold text-white rounded-xl transform hover:scale-110 transition-all shadow-lg animate-pulse ${
                gameWon
                  ? "bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 hover:from-green-500 hover:via-emerald-600 hover:to-teal-700 shadow-green-500/50"
                  : "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 shadow-blue-500/50"
              }`}
            >
              {" "}
              {gameWon ? "🔄 Continuar" : "🔄 Reintentar"}
            </button>{" "}
          </div>
        )}{" "}
      </div>{" "}
      <button
        onClick={shoot}
        disabled={showGameOver}
        className="mt-6 px-12 py-4 text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl hover:from-red-600 hover:to-orange-700 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/50"
      >
        {" "}
        ⚡ DISPARAR
      </button>{" "}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-lg border border-cyan-500/30 backdrop-blur-sm">
        {" "}
        <p className="text-cyan-300 font-semibold mb-2">🎮 CONTROLES:</p>{" "}
        <p className="text-white text-sm">
          {" "}
          🔹 Tecla{" "}
          <kbd className="px-2 py-1 bg-cyan-500/20 rounded border border-cyan-400">
            {" "}
            A{" "}
          </kbd>{" "}
          - Mover izquierda{" "}
        </p>{" "}
        <p className="text-white text-sm">
          {" "}
          🔹 Tecla{" "}
          <kbd className="px-2 py-1 bg-cyan-500/20 rounded border border-cyan-400">
            {" "}
            D{" "}
          </kbd>{" "}
          - Mover derecha{" "}
        </p>{" "}
        <p className="text-white text-sm">
          {" "}
          🔹 Tecla{" "}
          <kbd className="px-2 py-1 bg-cyan-500/20 rounded border border-cyan-400">
            {" "}
            ESPACIO{" "}
          </kbd>{" "}
          - Disparar láser{" "}
        </p>{" "}
        <p className="text-red-400 text-sm mt-2">
          {" "}
          ⚠️ ¡Evita los meteoritos! Cada colisión quita 15% de salud
        </p>{" "}
        <p className="text-red-400 text-sm">
          {" "}
          ⚠️ ¡No toques el suelo! Pierdes 20% de salud{" "}
        </p>{" "}
      </div>{" "}
    </div>
  );
}
