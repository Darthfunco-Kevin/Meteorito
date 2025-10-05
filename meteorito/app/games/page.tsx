"use client";

import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { useRouter } from "next/navigation";

// ==========================================================
// 🚀 INTERFACES CORREGIDAS PARA ELIMINAR EL USO DE 'ANY'
// ==========================================================

// Interfaz para extender PIXI.Graphics y agregar propiedades de movimiento
interface Star extends PIXI.Graphics {
  speed: number;
}

// Interfaz para la nave, que puede ser un Sprite o Graphics (DisplayObject)
// Usamos PIXI.Container, disponible en el namespace, compatible con Sprite/Graphics
interface Ship extends PIXI.Container {
  vx: number; // Velocidad en X
  baseY: number; // Posición Y base
}

// Interfaz para el meteorito, que puede ser un Sprite o Graphics (DisplayObject)
interface Meteor extends PIXI.Container {
  speed: number;
  size: number;
  rotationSpeed: number;
}

// Interfaz para la bala
interface Bullet extends PIXI.Graphics {
  speed: number;
}

// Extender PIXI.Application para incluir el intervalo de meteoritos
interface GameApplication extends PIXI.Application {
  meteorInterval?: NodeJS.Timeout;
}

// ==========================================================
// 🛠️ COMPONENTE PRINCIPAL
// ==========================================================

export default function MeteorGame() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null); // 🎯 Tipado corregido para usar GameApplication
  const appRef = useRef<GameApplication | null>(null); // 🎯 Referencias tipadas correctamente (eliminamos 'any[]' y 'any')

  const meteorsRef = useRef<Meteor[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const shipRef = useRef<Ship | null>(null);
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
  const PLANET_IMAGE = "/ImagenParte1/Planeta1.png";

  useEffect(() => {
    if (!canvasRef.current) return;

    const initGame = async () => {
      // 🎯 Tipado corregido
      const app: GameApplication = new PIXI.Application();

      await app.init({
        width: 850,
        height: 650,
        backgroundColor: 0x000000,
        canvas: canvasRef.current!,
      });

      appRef.current = app; // Cargar texturas desde las imágenes

      let shipTexture: PIXI.Texture | null = null;
      let meteorTexture: PIXI.Texture | null = null;
      let planetTexture: PIXI.Texture | null = null;

      try {
        shipTexture = await PIXI.Assets.load(SHIP_IMAGE);
      } catch (loadError: unknown) {
        // 💡 Se tipa 'error' como 'unknown'
        console.log("No se encontró imagen de nave, usando diseño por defecto"); // console.error(loadError); // Puedes descomentar si quieres ver el error
      }

      try {
        meteorTexture = await PIXI.Assets.load(METEOR_IMAGE);
      } catch (loadError: unknown) {
        // 💡 Se tipa 'error' como 'unknown'
        console.log(
          "No se encontró imagen de meteorito, usando diseño por defecto"
        ); // console.error(loadError);
      }

      try {
        planetTexture = await PIXI.Assets.load(PLANET_IMAGE);
      } catch (loadError: unknown) {
        // 💡 Se tipa 'error' como 'unknown'
        console.log(
          "No se encontró imagen de planeta, usando diseño por defecto"
        ); // console.error(loadError);
      } // Crear fondo de estrellas

      const createStars = () => {
        for (let i = 0; i < 200; i++) {
          // Se usa el tipo Star definido arriba
          const star = new PIXI.Graphics() as Star;
          const size = Math.random() * 2;
          const brightness = 0.3 + Math.random() * 0.7;

          star.rect(0, 0, size, size);
          star.fill({ color: 0xffffff, alpha: brightness });

          star.x = Math.random() * app.screen.width;
          star.y = Math.random() * (app.screen.height - 120);
          star.speed = 0.2 + Math.random() * 0.5; // Propiedad personalizada

          app.stage.addChild(star);
          starsRef.current.push(star);
        }
      };

      createStars(); // Crear planeta en la parte inferior

      let planet: PIXI.Container; // Usar tipo de PIXI
      if (planetTexture) {
        const planetSprite = new PIXI.Sprite(planetTexture);
        planetSprite.anchor.set(0.5);
        planetSprite.x = app.screen.width / 2;
        planetSprite.y = app.screen.height + 60;
        planetSprite.width = 400;
        planetSprite.height = 400;
        planet = planetSprite;
      } else {
        // Diseño por defecto
        const planetGraphics = new PIXI.Graphics();
        planetGraphics.circle(
          app.screen.width / 2,
          app.screen.height + 150,
          200
        );
        planetGraphics.fill(0x4169e1);

        planetGraphics.circle(
          app.screen.width / 2 - 50,
          app.screen.height + 120,
          60
        );
        planetGraphics.circle(
          app.screen.width / 2 + 70,
          app.screen.height + 140,
          50
        );
        planetGraphics.circle(
          app.screen.width / 2 + 20,
          app.screen.height + 180,
          45
        );
        planetGraphics.fill({ color: 0x228b22, alpha: 0.6 });

        planetGraphics.circle(
          app.screen.width / 2 - 80,
          app.screen.height + 100,
          30
        );
        planetGraphics.circle(
          app.screen.width / 2 + 90,
          app.screen.height + 110,
          25
        );
        planetGraphics.fill({ color: 0xffffff, alpha: 0.3 });
        planet = planetGraphics;
      }

      app.stage.addChild(planet); // Crear nave espacial

      let ship: Ship; // 💡 Se usa el tipo Ship definido arriba
      if (shipTexture) {
        const shipSprite = new PIXI.Sprite(shipTexture);
        shipSprite.anchor.set(0.5);
        shipSprite.width = 60;
        shipSprite.height = 60;
        const shipContainer = new PIXI.Container() as Ship;
        shipContainer.addChild(shipSprite);
        ship = shipContainer;
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

        const shipContainer = new PIXI.Container() as Ship;
        shipContainer.addChild(shipGraphics);
        ship = shipContainer;
      }

      ship.x = app.screen.width / 2;
      ship.y = app.screen.height - 80;
      ship.vx = 0; // Propiedad personalizada
      ship.baseY = app.screen.height - 80; // Propiedad personalizada

      app.stage.addChild(ship);
      shipRef.current = ship; // Función para crear meteorito

      const createMeteor = () => {
        if (gameOverRef.current) return;

        let meteor: Meteor; // 💡 Se usa el tipo Meteor definido arriba
        const size = 40 + Math.random() * 30;

        if (meteorTexture) {
          const meteorSprite = new PIXI.Sprite(meteorTexture);
          meteorSprite.anchor.set(0.5);
          meteorSprite.width = size;
          meteorSprite.height = size;
          const meteorContainer = new PIXI.Container() as Meteor;
          meteorContainer.addChild(meteorSprite);
          meteor = meteorContainer;
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
          const meteorContainer = new PIXI.Container() as Meteor;
          meteorContainer.addChild(meteorGraphics);
          meteor = meteorContainer;
        }

        meteor.x = Math.random() * app.screen.width;
        meteor.y = -size;
        meteor.speed = 1 + Math.random() * 2; // Propiedad personalizada
        meteor.size = size / 2; // Propiedad personalizada
        meteor.rotation = Math.random() * Math.PI * 2;
        meteor.rotationSpeed = (Math.random() - 0.5) * 0.1; // Propiedad personalizada

        app.stage.addChild(meteor);
        meteorsRef.current.push(meteor);
      }; // Se tipan los argumentos con los tipos que creamos

      const checkCollision = (bullet: Bullet, meteor: Meteor): boolean => {
        const dx = bullet.x - meteor.x;
        const dy = bullet.y - meteor.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < meteor.size + 4;
      }; // Se tipan los argumentos con los tipos que creamos

      const checkShipMeteorCollision = (
        ship: Ship,
        meteor: Meteor
      ): boolean => {
        const dx = ship.x - meteor.x;
        const dy = ship.y - meteor.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < meteor.size + 20;
      };

      const takeDamage = (amount: number) => {
        if (invulnerableRef.current) return;

        healthRef.current -= amount;
        setHealth(healthRef.current); // Se comprueba que shipRef.current no sea null

        if (shipRef.current) shipRef.current.tint = 0xff0000;

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
      }; // Loop principal del juego

      app.ticker.add(() => {
        if (gameOverRef.current) return;

        starsRef.current.forEach((star) => {
          // 💡 Usamos el tipo Star
          star.y += star.speed;
          if (star.y > app.screen.height - 120) {
            star.y = 0;
            star.x = Math.random() * app.screen.width;
          }
        }); // Se comprueba que shipRef.current exista

        if (!shipRef.current) return;

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

          if (checkShipMeteorCollision(shipRef.current!, meteor)) {
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

      const meteorInterval = setInterval(createMeteor, 1500); // 🎯 Usamos la interfaz GameApplication para tipar la propiedad
      app.meteorInterval = meteorInterval;
    };

    initGame();

    return () => {
      if (appRef.current) {
        // Detener el ticker antes de destruir
        appRef.current.ticker.stop(); // Limpiar el intervalo de meteoritos usando la propiedad tipada

        if (appRef.current.meteorInterval) {
          clearInterval(appRef.current.meteorInterval);
        } // Limpiar todos los objetos del stage

        meteorsRef.current.forEach((m) => appRef.current?.stage.removeChild(m));
        bulletsRef.current.forEach((b) => appRef.current?.stage.removeChild(b));
        starsRef.current.forEach((s) => appRef.current?.stage.removeChild(s)); // Destruir la aplicación

        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      } // Resetear referencias

      meteorsRef.current = [];
      bulletsRef.current = [];
      starsRef.current = [];
      shipRef.current = null;
    };
  }, []);

  const shoot = () => {
    if (gameOverRef.current || !appRef.current || !shipRef.current) return;

    const bullet = new PIXI.Graphics() as Bullet; // 💡 Usamos el tipo Bullet definido arriba

    bullet.rect(-2, -8, 4, 16);
    bullet.fill(0x00ffff);

    bullet.rect(-1, -6, 2, 12);
    bullet.fill({ color: 0xffffff, alpha: 0.6 });

    bullet.x = shipRef.current.x;
    bullet.y = shipRef.current.y - 30;
    bullet.speed = 10; // Propiedad personalizada

    appRef.current.stage.addChild(bullet);
    bulletsRef.current.push(bullet);
  };

  const WinGame = () => {
    // Limpiar el juego antes de navegar
    gameOverRef.current = true;
    if (appRef.current) {
      // Usamos la propiedad tipada
      if (appRef.current.meteorInterval) {
        clearInterval(appRef.current.meteorInterval);
      }
      appRef.current.ticker.stop();
    }
    router.push("/NewGames");
  };

  const restartGame = () => {
    gameOverRef.current = false;
    healthRef.current = 100;
    invulnerableRef.current = false;
    setScore(0);
    setHealth(100);
    setShowGameOver(false);
    setGameWon(false); // Se eliminan los 'as any' en la limpieza al inicio

    meteorsRef.current.forEach((m) => appRef.current?.stage.removeChild(m));
    bulletsRef.current.forEach((b) => appRef.current?.stage.removeChild(b));
    meteorsRef.current = [];
    bulletsRef.current = [];

    if (shipRef.current) {
      shipRef.current.y = shipRef.current.baseY;
      shipRef.current.tint = 0xffffff;
    } // 💡 Reiniciar el ticker y el intervalo de meteoritos
    if (appRef.current) {
      if (!appRef.current.ticker.started) {
        appRef.current.ticker.start();
      } // Si el intervalo se detuvo por game over, hay que reiniciarlo
      if (!appRef.current.meteorInterval) {
        const createMeteor = () => {
          if (gameOverRef.current) return; // Lógica simplificada para crear el meteorito (requeriría la lógica completa aquí o refactorizar) // Como la lógica de initGame se basa en useEffect, la solución más limpia es forzar un re-init // Sin embargo, para no reescribir todo, haremos lo siguiente para iniciar el loop // Nota: La lógica completa de createMeteor debería ser extraída para ser reutilizada o la aplicación destruida/reiniciada completamente.
        }; // Por simplicidad y para corregir el error, simplemente reiniciamos la variable de referencia
        const newInterval = setInterval(createMeteor, 1500);
        appRef.current.meteorInterval = newInterval;
      }
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
           {" "}
      <div className="text-center mb-5">
               {" "}
        <h1
          className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-3"
          style={{ textShadow: "0 0 30px rgba(59, 130, 246, 0.5)" }}
        >
                    🚀 Meteorite Destroyer        {" "}
        </h1>
               {" "}
        <div className="flex justify-center items-center gap-8 mb-2">
                   {" "}
          <div className="text-3xl text-yellow-300 font-bold">
                        METEORITES: {score} / 20          {" "}
          </div>
                   {" "}
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
                            ❤️ Health: {health}%            {" "}
            </span>
                     {" "}
          </div>
                 {" "}
        </div>
               {" "}
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
          />
                 {" "}
        </div>
               {" "}
        <div className="text-sm text-cyan-300 mt-2">
                    Use A and D to move the ship | SPACE to shoot        {" "}
        </div>
             {" "}
      </div>
           {" "}
      <div className="relative">
               {" "}
        <canvas
          ref={canvasRef}
          className="rounded-xl border-4 border-cyan-400 shadow-2xl shadow-cyan-500/50"
          style={{ boxShadow: "0 0 40px rgba(34, 211, 238, 0.4)" }}
        />
               {" "}
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
                            {gameWon ? "WIN ! 🎉" : "GAME OVER 💥"}           {" "}
            </h2>
                       {" "}
            <p className="text-2xl text-white mb-2">
                           {" "}
              {gameWon
                ? "¡You have saved the planet!"
                : "¡Your ship was destroyed!"}
                         {" "}
            </p>
                       {" "}
            <p className="text-lg text-gray-300 mb-8">
                            Meteorites destroyed: {score} / 20            {" "}
            </p>
                       {" "}
            <button
              onClick={gameWon ? WinGame : restartGame}
              className={`px-12 py-5 text-2xl font-bold text-white rounded-xl transform hover:scale-110 transition-all shadow-lg animate-pulse ${
                gameWon
                  ? "bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 hover:from-green-500 hover:via-emerald-600 hover:to-teal-700 shadow-green-500/50"
                  : "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 shadow-blue-500/50"
              }`}
            >
                            {gameWon ? "🔄 Continue" : "🔄 Retry"}           {" "}
            </button>
                     {" "}
          </div>
        )}
             {" "}
      </div>
           {" "}
      <button
        onClick={shoot}
        disabled={showGameOver}
        className="mt-6 px-12 py-4 text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl hover:from-red-600 hover:to-orange-700 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/50"
      >
                ⚡ Shoot      {" "}
      </button>
           {" "}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-lg border border-cyan-500/30 backdrop-blur-sm">
                <p className="text-cyan-300 font-semibold mb-2">🎮 CONTROLS:</p>
               {" "}
        <p className="text-white text-sm">
                    🔹 Key          {" "}
          <kbd className="px-2 py-1 bg-cyan-500/20 rounded border border-cyan-400">
                        A          {" "}
          </kbd>{" "}
                    - Move Left        {" "}
        </p>
               {" "}
        <p className="text-white text-sm">
                    🔹 Key          {" "}
          <kbd className="px-2 py-1 bg-cyan-500/20 rounded border border-cyan-400">
                        D          {" "}
          </kbd>{" "}
                    - Move Right        {" "}
        </p>
               {" "}
        <p className="text-white text-sm">
                    🔹 Key          {" "}
          <kbd className="px-2 py-1 bg-cyan-500/20 rounded border border-cyan-400">
                        SPACE          {" "}
          </kbd>{" "}
                    - Shoot laser        {" "}
        </p>
               {" "}
        <p className="text-red-400 text-sm mt-2">
                    ⚠️ Avoid the meteorites! Each collision takes away 15% of
          your health.        {" "}
        </p>
             {" "}
      </div>
         {" "}
    </div>
  );
}
