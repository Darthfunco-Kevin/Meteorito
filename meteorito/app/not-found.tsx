"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Error() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 flex items-center justify-center p-6">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center gap-12">
        {/* Image on the left */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <img
            className="max-w-full max-h-[70vh] w-auto object-contain rounded-3xl shadow-2xl border border-white/10"
            src="/404-error.png"
            alt="Error 404 - Page Not Found"
          />
        </div>

        {/* Content on the right */}
        <div className="flex-1 text-white space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="inline-block px-4 py-2 bg-red-500/20 border border-red-400/30 rounded-full text-red-300 text-sm font-medium">
              Error 404
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Oops!
            </h1>

            <h2 className="text-2xl lg:text-3xl font-semibold text-blue-100">
              Page Not Found
            </h2>
          </div>

          <div className="space-y-4 text-blue-200">
            <p className="text-lg leading-relaxed">
              It looks like you&apos;ve gotten lost in space. The page you are
              looking for doesn&apos;t exist or has been moved to another
              galaxy.
            </p>

            <div className="bg-blue-900/30 backdrop-blur-sm border border-blue-700/50 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-3">
                What can you do?
              </h3>
              <ul className="space-y-2 text-sm text-blue-200">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                  Check that the URL is spelled correctly
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                  Go back to the previous page
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                  Go to the homepage and explore from there
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => router.back()}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
            >
              ← Go Back
            </button>

            <Link
              href="/"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl text-center inline-block"
            >
              🏠 Go to Home
            </Link>
          </div>

          {/* Additional info */}
          <div className="text-xs text-blue-300/60 pt-6">
            If you believe this is a system error, please contact technical
            support.
          </div>
        </div>
      </div>
    </div>
  );
}
