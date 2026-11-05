export default function Logo({
  size = 40,
  ...props
}: {
  size?: number;
} & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Nishit Khatri logo"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="64" height="64" rx="16" fill="var(--accent-color, #6C8BFF)" />
      <g
        fill="none"
        stroke="var(--bg-color, #0C0C0E)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 46V18L33 46V18" />
        <path d="M42 18V46M53 18L42 33M45.5 30L53 46" />
      </g>
    </svg>
  );
}

