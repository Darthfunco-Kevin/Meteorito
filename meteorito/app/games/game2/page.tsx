"use client";
import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { useRouter } from "next/navigation";

// ====== INTERFACES CORREGIDAS ======
interface Laser extends PIXI.Graphics {
  speed: number;
}

interface Particle extends PIXI.Graphics {
  vx: number;
  vy: number;
  life: number;
}

// ====== IMAGE PATHS ======
const IMAGE_PATHS = {
  ship: "/ImagenParte2/Nave2.png", // Path is relative to the 'public' folder
  meteorite: "/ImagenParte2/Impactor.png", // Path is relative to the 'public' folder
};

// ====== DESIGN CONFIGURATION (CUSTOMIZABLE) ======
const DESIGN_CONFIG = {
  // Space colors
  spaceBackground: 0x0a0e27,
  starsColor: 0xffffff,
  nebulaPurple: 0x6b2d5c,
  nebulaBlue: 0x1e3a5f, // Ship design (attacker)

  shipBodyColor: 0x4a9eff,
  shipWindowColor: 0x00ffff,
  shipEngineColor: 0xff4500,
  shipWingColor: 0x2e6db5,
  shipSize: 0.085, // Scale adjusted for the ship image (four times smaller) // Meteorite design (target)

  meteoriteMainColor: 0x8b4513,
  meteoriteCraterColor: 0x654321,
  meteoriteHighlight: 0xa0522d,
  meteoriteSize: 0.25, // Scale adjusted for the meteorite image (four times smaller) // Effects

  laserColor: 0x00ff00,
  explosionColors: [0xff6b35, 0xf7931e, 0xfdc830, 0xff4500], // Earth planet in the background

  earthColor: 0x4a90e2,
  earthContinents: 0x2d5016,
  earthClouds: 0xffffff,
};
// ====================================================

export default function DestructionGame() {
  const router = useRouter();
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameState, setGameState] = useState("playing");
  const [gameStarted, setGameStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const clicksRef = useRef(0);
  const gameStateRef = useRef("playing");
  const gameStartedRef = useRef(false);
  const gameOverRef = useRef(false);

  useEffect(() => {
    if (!canvasRef.current || appRef.current) return;

    const initPixi = async () => {
      // 1. Load image textures
      // Utilizamos Promise.all para cargar las texturas de forma concurrente.
      let shipTexture: PIXI.Texture;
      let meteoriteTexture: PIXI.Texture;

      try {
        [shipTexture, meteoriteTexture] = await Promise.all([
          PIXI.Assets.load(IMAGE_PATHS.ship),
          PIXI.Assets.load(IMAGE_PATHS.meteorite),
        ]);
      } catch (loadError: unknown) {
        console.error("Error loading textures:", loadError); // Se utiliza una textura de placeholder si la carga falla
        shipTexture = PIXI.Texture.WHITE;
        meteoriteTexture = PIXI.Texture.WHITE;
      }

      const app = new PIXI.Application();
      await app.init({
        width: 900,
        height: 700,
        backgroundColor: DESIGN_CONFIG.spaceBackground,
        antialias: true,
      });

      if (canvasRef.current) {
        canvasRef.current.appendChild(app.canvas);
      }
      appRef.current = app; // ===== SPACE BACKGROUND (unchanged logic) ===== // Create stars

      const starsContainer = new PIXI.Container();
      for (let i = 0; i < 200; i++) {
        const star = new PIXI.Graphics();
        const size = Math.random() * 2 + 0.5;
        star.beginFill(DESIGN_CONFIG.starsColor);
        star.drawCircle(0, 0, size);
        star.endFill();
        star.x = Math.random() * 900;
        star.y = Math.random() * 700;
        star.alpha = Math.random() * 0.5 + 0.5;
        starsContainer.addChild(star);
      }
      app.stage.addChild(starsContainer); // Earth planet in the background

      const earth = new PIXI.Graphics();
      earth.beginFill(DESIGN_CONFIG.earthColor);
      earth.drawCircle(0, 0, 80);
      earth.endFill();
      earth.beginFill(DESIGN_CONFIG.earthContinents);
      earth.drawCircle(-30, -20, 25);
      earth.drawCircle(20, 30, 20);
      earth.drawCircle(-10, 40, 15);
      earth.endFill();
      earth.beginFill(DESIGN_CONFIG.earthClouds, 0.3);
      earth.drawCircle(10, -30, 20);
      earth.drawCircle(-40, 10, 15);
      earth.endFill();
      earth.x = 750;
      earth.y = 150;
      earth.alpha = 0.6;
      app.stage.addChild(earth); // Background Nebula

      const nebula = new PIXI.Graphics();
      nebula.beginFill(DESIGN_CONFIG.nebulaPurple, 0.2);
      nebula.drawCircle(200, 500, 150);
      nebula.endFill();
      nebula.beginFill(DESIGN_CONFIG.nebulaBlue, 0.15);
      nebula.drawCircle(700, 600, 120);
      nebula.endFill();
      app.stage.addChild(nebula); // ===== SPACESHIP (ATTACKER) - USING IMAGE =====

      const shipContainer = new PIXI.Container();

      const shipSprite = new PIXI.Sprite(shipTexture);
      shipSprite.anchor.set(0.5); // Center the anchor
      shipSprite.rotation = Math.PI / 2; // Rotate 90 degrees to make it horizontal and point right

      shipContainer.addChild(shipSprite);
      shipContainer.x = 150;
      shipContainer.y = 350;
      shipContainer.scale.set(DESIGN_CONFIG.shipSize);
      app.stage.addChild(shipContainer); // ===== METEORITE (TARGET) - USING IMAGE =====

      const meteoriteContainer = new PIXI.Container();

      const meteoriteSprite = new PIXI.Sprite(meteoriteTexture);
      meteoriteSprite.anchor.set(0.5); // Center the anchor

      meteoriteContainer.addChild(meteoriteSprite);
      meteoriteContainer.x = 700;
      meteoriteContainer.y = 350;
      meteoriteContainer.scale.set(DESIGN_CONFIG.meteoriteSize);
      meteoriteContainer.eventMode = "static";
      meteoriteContainer.cursor = "pointer";
      app.stage.addChild(meteoriteContainer); // HP Text

      const hpText = new PIXI.Text("HP: 225", {
        fontFamily: "Arial",
        fontSize: 28,
        fill: 0xffffff,
        fontWeight: "bold",
        stroke: 0x000000,
      });
      hpText.x = 620;
      hpText.y = 50;
      app.stage.addChild(hpText); // Effects containers

      const lasersContainer = new PIXI.Container();
      app.stage.addChild(lasersContainer);

      const particlesContainer = new PIXI.Container();
      app.stage.addChild(particlesContainer); // ===== CLICK EVENT =====

      meteoriteContainer.on("pointerdown", () => {
        if (gameStateRef.current !== "playing" || !gameStartedRef.current)
          return;

        clicksRef.current += 1;
        setClicks(clicksRef.current);

        const remainingHP = 225 - clicksRef.current;
        hpText.text = `HP: ${remainingHP > 0 ? remainingHP : 0}`; // Create laser // 💡 Usando la interfaz Laser

        const laser = new PIXI.Graphics() as Laser;
        laser.beginFill(DESIGN_CONFIG.laserColor);
        laser.drawRect(0, -2, 40, 4);
        laser.endFill(); // Adjust laser start position to the ship's nose
        const shipScaledHeight = shipSprite.height * shipContainer.scale.y;
        laser.x = shipContainer.x + shipScaledHeight / 2 - 20;
        laser.y = shipContainer.y;
        laser.speed = 15; // Propiedad tipada
        lasersContainer.addChild(laser); // Create explosion particles

        const colors = DESIGN_CONFIG.explosionColors;
        for (let i = 0; i < 8; i++) {
          // 💡 Usando la interfaz Particle
          const particle = new PIXI.Graphics() as Particle;
          particle.beginFill(colors[Math.floor(Math.random() * colors.length)]);
          particle.drawCircle(0, 0, Math.random() * 4 + 3);
          particle.endFill();
          particle.x = meteoriteContainer.x;
          particle.y = meteoriteContainer.y;

          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 5 + 3;
          particle.vx = Math.cos(angle) * speed; // Propiedad tipada
          particle.vy = Math.sin(angle) * speed; // Propiedad tipada
          particle.life = 40; // Propiedad tipada

          particlesContainer.addChild(particle);
        } // Meteorite shake effect

        meteoriteContainer.x += Math.random() * 12 - 6;
        meteoriteContainer.y += Math.random() * 12 - 6;
        meteoriteContainer.rotation += (Math.random() - 0.5) * 0.2;

        setTimeout(() => {
          meteoriteContainer.x = 700;
          meteoriteContainer.y = 350;
        }, 80);
      }); // ===== ANIMATION LOOP (TICKER) =====

      app.ticker.add(() => {
        // Animate stars (twinkle)
        starsContainer.children.forEach((star) => {
          star.alpha += (Math.random() - 0.5) * 0.05;
          star.alpha = Math.max(0.3, Math.min(1, star.alpha));
        }); // Rotate Earth slowly

        earth.rotation += 0.001; // Ship engine pulse

        const enginePulse = 1 + Math.sin(Date.now() * 0.01) * 0.3; // Apply pulse to both scales since the ship is rotated
        shipContainer.scale.x =
          DESIGN_CONFIG.shipSize * (0.98 + enginePulse * 0.02);
        shipContainer.scale.y =
          DESIGN_CONFIG.shipSize * (0.98 + enginePulse * 0.02); // Slow meteorite rotation

        meteoriteContainer.rotation += 0.005; // Animate lasers

        lasersContainer.children.forEach((laser) => {
          const l = laser as Laser; // 💡 Usando interfaz Laser para tipado
          l.x += l.speed;
          if (l.x > 900) {
            lasersContainer.removeChild(l);
          }
        }); // Animate particles

        particlesContainer.children.forEach((particle) => {
          const p = particle as Particle; // 💡 Usando interfaz Particle para tipado
          if (p.vx !== undefined && p.vy !== undefined) {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.025;
            p.life -= 1;

            if (p.life <= 0) {
              particlesContainer.removeChild(p);
            }
          }
        });
      });
    };

    initPixi();

    return () => {
      if (appRef.current) {
        // Detener el ticker antes de destruir
        appRef.current.ticker.stop();
        appRef.current.destroy(true, { children: true });
        appRef.current = null; // Clean up assets
        PIXI.Assets.unload(IMAGE_PATHS.ship);
        PIXI.Assets.unload(IMAGE_PATHS.meteorite);
      }
    };
  }, []); // Sync refs with states

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    gameStartedRef.current = gameStarted;
  }, [gameStarted]); // Game Timer

  useEffect(() => {
    if (gameStarted && gameState === "playing") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Verificamos si hay un timer activo antes de intentar limpiarlo
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            setGameState(clicksRef.current >= 225 ? "won" : "lost");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null; // Limpiar la referencia al desmontar
      }
    };
  }, [gameStarted, gameState]); // Check for victory

  useEffect(() => {
    if (clicks >= 225 && gameState === "playing") {
      setGameState("won");
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [clicks, gameState]);

  const startGame = () => {
    setGameStarted(true);
    setGameState("playing");
    setClicks(0);
    clicksRef.current = 0;
    setTimeLeft(45);
  }; // Renamed from WinGame to follow English naming convention

  const endGameWin = () => {
    // Clean up before navigating
    gameOverRef.current = true;
    if (appRef.current) {
      // No se requiere limpiar meteorInterval aquí ya que no existe en este juego
      appRef.current.ticker.stop();
    }
    router.push("/");
  };

  const resetGame = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-indigo-950 to-purple-950 flex flex-col items-center justify-center p-8">
           {" "}
      <h1 className="text-5xl font-bold text-white mb-4 tracking-wider">
                🚀 SPACE BATTLE 🌠      {" "}
      </h1>
           {" "}
      <p className="text-cyan-300 text-lg mb-6">
                Destroy the meteorite before it&apos;s too late      {" "}
      </p>
           {" "}
      <div className="bg-black bg-opacity-60 rounded-lg p-6 mb-6 shadow-2xl border-2 border-cyan-500">
               {" "}
        <div className="flex gap-8 text-white text-xl mb-4">
                   {" "}
          <div className="flex flex-col items-center">
                       {" "}
            <span className="text-cyan-400 text-sm uppercase tracking-wider">
                            IMPACTS            {" "}
            </span>
                       {" "}
            <span className="text-4xl font-bold text-green-400">
                            {clicks}/225            {" "}
            </span>
                     {" "}
          </div>
                   {" "}
          <div className="flex flex-col items-center">
                       {" "}
            <span className="text-cyan-400 text-sm uppercase tracking-wider">
                            TIME LEFT            {" "}
            </span>
                       {" "}
            <span
              className={`text-4xl font-bold ${
                timeLeft <= 10
                  ? "text-red-400 animate-pulse"
                  : "text-yellow-400"
              }`}
            >
                            {timeLeft}s            {" "}
            </span>
                     {" "}
          </div>
                 {" "}
        </div>
               {" "}
        <div className="w-full bg-gray-900 rounded-full h-5 mb-2 border-2 border-cyan-700">
                   {" "}
          <div
            className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${(clicks / 225) * 100}%` }}
          ></div>
                 {" "}
        </div>
               {" "}
        <p className="text-cyan-300 text-xs text-center">
                    Destruction Progress        {" "}
        </p>
             {" "}
      </div>
           {" "}
      <div
        ref={canvasRef}
        className="rounded-xl shadow-2xl mb-6 border-4 border-cyan-600"
      ></div>
           {" "}
      {!gameStarted && gameState === "playing" && (
        <button
          onClick={startGame}
          className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-2xl font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all border-2 border-white"
        >
                    🚀 START MISSION        {" "}
        </button>
      )}
           {" "}
      {gameState === "won" && (
        <div className="text-center">
                   {" "}
          <button
            onClick={endGameWin}
            className="px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-2xl font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all mb-4 border-2 border-white animate-pulse"
          >
                        ✅ GOOD ENDING          {" "}
          </button>
                   {" "}
          <p className="text-green-400 text-2xl font-bold">
                        🎉 MISSION ACCOMPLISHED! 🎉          {" "}
          </p>
                   {" "}
          <p className="text-cyan-300 text-lg mt-2">
                        The meteorite has been destroyed          {" "}
          </p>
                 {" "}
        </div>
      )}
           {" "}
      {gameState === "lost" && (
        <div className="text-center">
                   {" "}
          <button
            onClick={resetGame}
            className="px-10 py-5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-2xl font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all mb-4 border-2 border-white"
          >
                        ❌ BAD ENDING          {" "}
          </button>
                   {" "}
          <p className="text-red-400 text-2xl font-bold">
                        💥 MISSION FAILED 💥          {" "}
          </p>
                   {" "}
          <p className="text-cyan-300 text-lg mt-2">
                        You only managed {clicks} impacts out of 225          {" "}
          </p>
                 {" "}
        </div>
      )}
           {" "}
      <div className="text-cyan-200 mt-6 text-center max-w-2xl bg-black bg-opacity-40 p-4 rounded-lg border border-cyan-700">
               {" "}
        <p className="text-lg">
                    ⚡ Quickly click on the meteorite to destroy it        {" "}
        </p>
               {" "}
        <p className="text-sm mt-2 text-cyan-400">
                    Your ship will automatically fire lasers with every click  
               {" "}
        </p>
             {" "}
      </div>
         {" "}
    </div>
  );
}
