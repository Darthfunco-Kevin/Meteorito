"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Home, Github, Sparkles, Code2, Globe } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/90 backdrop-blur-xl border-b border-purple-500/30 shadow-lg shadow-purple-500/10"
          : "bg-slate-950/70 backdrop-blur-md border-b border-purple-500/20"
      }`}
    >
      {/* Enhanced starfield background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-pulse ${
              i % 3 === 0
                ? "w-1 h-1 bg-white"
                : i % 3 === 1
                ? "w-0.5 h-0.5 bg-blue-300"
                : "w-0.5 h-0.5 bg-purple-300"
            }`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-cyan-600/5 pointer-events-none" />

      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Enhanced */}
          <Link href="/" className="flex-shrink-0 flex items-center group">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
              {/* Logo */}
              <img
                className="w-14 h-14 rounded-full border-2 border-purple-500/30 group-hover:border-cyan-500/50 transition-all duration-300 relative z-10 object-cover shadow-lg"
                src="/Logo.jpg"
                alt="The Vibe Coders Logo"
              />
              {/* Rotating ring */}
              <div
                className="absolute inset-0 border-2 border-transparent group-hover:border-purple-400/50 rounded-full animate-spin-slow"
                style={{ animationDuration: "3s" }}
              />
            </div>
            <div className="ml-3 hidden sm:block">
              <span className="text-xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:via-blue-300 group-hover:to-cyan-300 transition-all duration-300 drop-shadow-lg">
                The Vibe Coders
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
                <span className="text-xs text-gray-400 font-medium">
                  Digital Space
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Enhanced */}
          <div className="hidden md:block">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className={`px-4 py-2 text-sm font-semibold transition-all duration-300 relative group rounded-xl ${
                  isActive("/")
                    ? "text-white bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border border-purple-500/50"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Home
                </span>
                {!isActive("/") && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300 group-hover:w-full rounded-full" />
                  </>
                )}
              </Link>

              <Link
                href="/Simulacion/Meteorito"
                className={`px-4 py-2 text-sm font-semibold transition-all duration-300 relative group rounded-xl ${
                  isActive("/Meteorito") || isActive("/impacto")
                    ? "text-white bg-gradient-to-r from-orange-600/30 to-red-600/30 border border-orange-500/50"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Meteorites
                </span>
                {!isActive("/Meteorito") && !isActive("/impacto") && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300 group-hover:w-full rounded-full" />
                  </>
                )}
              </Link>

              <Link
                href="/InicioGame"
                className={`px-4 py-2 text-sm font-semibold transition-all duration-300 relative group rounded-xl ${
                  isActive("/games")
                    ? "text-white bg-gradient-to-r from-green-600/30 to-emerald-600/30 border border-green-500/50"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  Game
                </span>
                {!isActive("/InicioGame") && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300 group-hover:w-full rounded-full" />
                  </>
                )}
              </Link>

              <Link
                href="https://github.com/Darthfunco-Kevin/Meteorito"
                target="_blank"
                className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-all duration-300 relative group rounded-xl"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  GitHub
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 to-gray-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-slate-400 to-gray-400 transition-all duration-300 group-hover:w-full rounded-full" />
              </Link>
            </div>
          </div>

          {/* Desktop CTA Button - Removed */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cosmic indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
              <span className="text-xs text-gray-300 font-medium">Online</span>
            </div>
          </div>

          {/* Mobile menu button - Enhanced */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="relative p-2.5 rounded-xl text-gray-300 hover:text-white transition-all duration-300 group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-purple-500/30" />
              {isMenuOpen ? (
                <X
                  size={24}
                  className="relative z-10 transform rotate-0 transition-transform duration-300 group-hover:rotate-90"
                />
              ) : (
                <Menu size={24} className="relative z-10" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Enhanced */}
        <div
          className={`md:hidden transition-all duration-500 ease-in-out ${
            isMenuOpen
              ? "max-h-[500px] opacity-100 visible"
              : "max-h-0 opacity-0 invisible overflow-hidden"
          }`}
        >
          <div className="px-3 pt-3 pb-4 space-y-2 bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-xl border-t border-purple-500/30 rounded-b-2xl mt-2 shadow-xl shadow-purple-500/10">
            <Link
              href="/"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                isActive("/")
                  ? "text-white bg-gradient-to-r from-purple-600/40 to-cyan-600/40 border border-purple-500/50"
                  : "text-gray-300 hover:text-white hover:bg-purple-600/20 border border-transparent hover:border-purple-500/30"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>

            <Link
              href="/Meteorito"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                isActive("/Meteorito") || isActive("/impacto")
                  ? "text-white bg-gradient-to-r from-orange-600/40 to-red-600/40 border border-orange-500/50"
                  : "text-gray-300 hover:text-white hover:bg-orange-600/20 border border-transparent hover:border-orange-500/30"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Globe className="w-5 h-5" />
              <span>Meteorites</span>
            </Link>

            <Link
              href="games"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                isActive("/games")
                  ? "text-white bg-gradient-to-r from-green-600/40 to-emerald-600/40 border border-green-500/50"
                  : "text-gray-300 hover:text-white hover:bg-green-600/20 border border-transparent hover:border-green-500/30"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Code2 className="w-5 h-5" />
              <span>Game</span>
            </Link>

            <Link
              href="https://github.com/Darthfunco-Kevin/Meteorito"
              target="_blank"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-gray-300 hover:text-white hover:bg-slate-600/20 border border-transparent hover:border-slate-500/30 transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </Link>

            {/* Status indicator */}
            <div className="pt-3 mt-3 border-t border-purple-500/20">
              <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-xl">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                <span className="text-sm text-gray-300 font-medium">
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
