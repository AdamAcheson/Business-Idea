export function LogoMark({ className }: { className?: string }) {
  const spokes = [
    { x1: 64, y1: 50, x2: 90, y2: 50 },
    { x1: 62.1, y1: 57, x2: 84.6, y2: 70 },
    { x1: 57, y1: 62.1, x2: 70, y2: 84.6 },
    { x1: 50, y1: 64, x2: 50, y2: 90 },
    { x1: 43, y1: 62.1, x2: 30, y2: 84.6 },
    { x1: 37.9, y1: 57, x2: 15.4, y2: 70 },
    { x1: 36, y1: 50, x2: 10, y2: 50 },
    { x1: 37.9, y1: 43, x2: 15.4, y2: 30 },
    { x1: 43, y1: 37.9, x2: 30, y2: 15.4 },
    { x1: 50, y1: 36, x2: 50, y2: 10 },
    { x1: 57, y1: 37.9, x2: 70, y2: 15.4 },
    { x1: 62.1, y1: 43, x2: 84.6, y2: 30 },
  ];

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {spokes.map((s, i) => (
        <g key={i}>
          <line
            x1={s.x1}
            y1={s.y1}
            x2={s.x2}
            y2={s.y2}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx={s.x2} cy={s.y2} r="3.5" fill="currentColor" />
        </g>
      ))}
      <circle cx="50" cy="50" r="9" fill="currentColor" />
    </svg>
  );
}
