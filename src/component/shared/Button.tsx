import type { ReactNode } from "react";

export default function Button({
  children,
  className,
  onClick,
  ariaLabel,
}: {
  className: string;
  children: ReactNode;
  onClick?: () => void;
  ariaLabel: string;
}) {
  return (
    <button className={className} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
