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
interface SideNavProps {
  top: number;
  height: number;
}

// open side nav props
export interface OpenSideNavProps extends SideNavProps {
  sideNavRef: RefObject<HTMLDivElement> | null;
}

// side nav div props
export interface SideNavDivProps extends SideNavProps {
  addBomb: () => void;
  clearWalls: () => void;
}
