import React from 'react';

const MatrixRain = () => {
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

  return (
    <div className="absolute top-0 left-0 -z-10 h-full w-full overflow-hidden">
      <div className="matrix-rain pointer-events-none absolute inset-0 opacity-20">
        {matrixRainDrops.map((drop) => (
          <span
            key={drop.id}
            className="text-shadow-glow absolute text-xs"
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
  );
};

export default MatrixRain;
