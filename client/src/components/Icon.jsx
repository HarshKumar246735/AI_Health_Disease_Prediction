// Small stroke-icon set. Add a path here to make a new icon available everywhere.
const PATHS = {
  heart: 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z',
  drop: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  gauge: 'M4 16a8 8 0 1 1 16 0 M12 16l4-5 M7 16h.01 M17 16h.01 M12 8v.01',
  liver: 'M4 10c0-3 3-5 7-5 5 0 9 3 9 7 0 3-3 5-6 5-2 0-3-1-4-2-2 1-6 0-6-5z',
  kidney: 'M14 4c-4 0-7 3-7 8s3 8 7 8c2 0 3-2 2-3-1-1-3-1-3-5s2-4 3-5c1-1 0-3-2-3z',
  brain: 'M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1z M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1',
  thyroid: 'M12 8c-1-2-4-3-6-2-2 1-2 4 0 6s4 3 6 3 4-1 6-3 2-5 0-6c-2-1-5 0-6 2z M12 8v9',
  wind: 'M3 8h10a3 3 0 1 0-3-3 M3 12h15a3 3 0 1 1-3 3 M3 16h7',
  lungs: 'M9 5v8c0 3-2 5-4 5-1 0-2-1-2-2 0-4 2-9 6-11z M15 5v8c0 3 2 5 4 5 1 0 2-1 2-2 0-4-2-9-6-11z M12 4v7',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  chart: 'M4 20V10 M10 20V4 M16 20v-7 M2 20h20',
  layers: 'M12 3l9 5-9 5-9-5z M3 13l9 5 9-5',
  clock: 'M12 7v5l3 2 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z',
  file: 'M7 3h7l5 5v13H7z M14 3v5h5 M10 13h6 M10 17h6',
  lock: 'M6 11h12v9H6z M8 11V8a4 4 0 0 1 8 0v3',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 20c0-4 4-6 8-6s8 2 8 6',
  mail: 'M3 6h18v12H3z M3 7l9 6 9-6',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  eyeOff: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M4 4l16 16',
  check: 'M5 12l5 5 9-10',
  alert: 'M12 4l9 16H3z M12 10v4 M12 17h.01',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 11v5 M12 8h.01',
  x: 'M6 6l12 12 M18 6L6 18',
  menu: 'M4 7h16 M4 12h16 M4 17h16',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M20 20l-4-4',
};

export default function Icon({ name, size = 20, className = '', ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      <path d={PATHS[name] || PATHS.info} />
    </svg>
  );
}
