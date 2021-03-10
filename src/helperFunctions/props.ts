import { RefObject } from 'react';

// dropdown arrow direction
interface ArrowDirection {
  direction: string;
}
export const arrowDown: ArrowDirection = { direction: 'down' };
export const arrowUp: ArrowDirection = { direction: 'up' };

// Nav.tsx
export interface NavProps {
  arrowDirection: ArrowDirection;
}

// side nav props
export interface SideNavProps {
  top: number;
  height: number;
  sideNavRef: RefObject<HTMLDivElement> | null;
}
