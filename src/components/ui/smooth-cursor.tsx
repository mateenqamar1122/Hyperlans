"use client";

import { FC, JSX } from "react";

interface SmoothCursorProps {
  cursor?: JSX.Element;
}

const DefaultCursorSVG: FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={22}
      viewBox="0 0 50 54"
      fill="none"
    />
  );
};

export function SmoothCursor({
  cursor = <DefaultCursorSVG />,
}: SmoothCursorProps) {
  return (
    <div
      id="custom-cursor"
      style={{
        position: 'fixed',
        left: `${window.event?.clientX || 0}px`,
        top: `${window.event?.clientY || 0}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      {cursor}
    </div>
  );
}
