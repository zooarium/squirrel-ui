import React from 'react';

const generateMatrixRainDrops = () => {
  return Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}vw`,
    top: `${Math.random() * 100}vh`,
    animationDuration: `${Math.random() * 2 + 3}s`,
    animationDelay: `-${Math.random() * 5}s`,
    character: String.fromCharCode(0x30a0 + Math.random() * 96),
  }));
};

const matrixRainDrops = generateMatrixRainDrops();

const LoginPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4 font-mono text-green-400">
      <div className="absolute top-0 left-0 -z-10 h-full w-full overflow-hidden">
        {/* Matrix Rain Effect - Simplified for illustration */}
        <div className="matrix-rain absolute inset-0 opacity-20 pointer-events-none">
          {matrixRainDrops.map((drop) => (
            <span
              key={drop.id}
              className="absolute text-xs text-shadow-glow"
              style={{
                left: drop.left,
                top: drop.top,
                animation: `matrix-fall ${drop.animationDuration} linear infinite`,
                animationDelay: drop.animationDelay,
              }}
            >
              {drop.character}
            </span>
          ))}
        </div>
      </div>

      <header className="mb-8 text-center relative z-10">
        <h1 className="animate-pulse text-5xl font-bold tracking-widest uppercase text-shadow-glow">Vyaya-UI</h1>
        <p className="mt-2 text-sm text-green-500 font-bold">Unlocking the digital realm.</p>
      </header>

      <main className="bg-black/80 w-full max-w-md rounded-lg border border-green-600 p-8 shadow-[0_0_15px_rgba(34,197,94,0.3)] backdrop-blur-sm relative z-10">
        <h2 className="mb-6 text-center text-3xl font-semibold text-green-400 text-shadow-glow">Login</h2>
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-bold text-green-400">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="focus:shadow-[0_0_10px_rgba(34,197,94,0.5)] w-full appearance-none rounded border border-green-600 bg-black px-4 py-3 leading-tight text-green-300 shadow focus:border-green-400 focus:outline-none transition-shadow duration-300"
              placeholder="neo@matrix.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-bold text-green-400">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="focus:shadow-[0_0_10px_rgba(34,197,94,0.5)] w-full appearance-none rounded border border-green-600 bg-black px-4 py-3 leading-tight text-green-300 shadow focus:border-green-400 focus:outline-none transition-shadow duration-300"
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="focus:shadow-[0_0_15px_rgba(34,197,94,0.6)] transform rounded bg-green-700 px-6 py-3 font-bold text-black transition duration-300 ease-in-out hover:scale-105 hover:bg-green-600 focus:outline-none uppercase tracking-wider"
            >
              Enter the Matrix
            </button>
            <a
              href="#"
              className="inline-block align-baseline text-sm font-bold text-green-400 hover:text-green-200 transition-colors"
            >
              Forgot Password?
            </a>
          </div>
        </form>
      </main>

      <footer className="mt-8 text-center text-xs text-green-500 opacity-80 relative z-10">
        <p>&copy; {new Date().getFullYear()} Phoenix Code Labs. All rights reserved.</p>
        <p>A journey into the digital consciousness.</p>
      </footer>
    </div>
  );
};

export default LoginPage;

