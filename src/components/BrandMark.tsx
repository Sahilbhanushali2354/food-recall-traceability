export default function BrandMark({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Recall Traceability"
      style={{ display: "block", flexShrink: 0 }}
    >
      <rect width="32" height="32" rx="7" fill="#0F6E6E" />
      <path
        d="M8.5 21.5 L16 11.5 L23.5 21.5"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
      <circle cx="8.5" cy="21.5" r="3.5" fill="#FFFFFF" />
      <circle cx="16" cy="11.5" r="3.5" fill="#FFFFFF" />
      <circle cx="23.5" cy="21.5" r="3.5" fill="#F0B429" />
    </svg>
  );
}
