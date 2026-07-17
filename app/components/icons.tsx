import type { SVGProps } from "react";

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.7h2.6l.4-3h-3v-1.9c0-.87.24-1.46 1.5-1.46H16.6V4.14C16.3 4.1 15.32 4 14.17 4c-2.4 0-4.05 1.47-4.05 4.16v2.14H7.5v3h2.62V21h3.38Z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.15" cy="6.85" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.94 8.5H3.94V20h3v-11.5ZM5.44 7.15a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5ZM20.06 20h-3v-6.1c0-1.46-.03-3.34-2.04-3.34-2.04 0-2.35 1.6-2.35 3.23V20h-3V8.5h2.88v1.57h.04c.4-.76 1.38-1.57 2.84-1.57 3.04 0 3.6 2 3.6 4.6V20Z" />
    </svg>
  );
}
