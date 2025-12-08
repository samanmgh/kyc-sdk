import type { SVGProps } from "react";

export const MinusIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='3.5'
    strokeLinecap='round'
    strokeLinejoin='round'
    {...props}
  >
    <line x1='5' y1='12' x2='19' y2='12' />
  </svg>
);
