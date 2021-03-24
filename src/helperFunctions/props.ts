import { RefObject } from 'react';

// dropdown arrow direction
interface ArrowDirection {
  direction: string;
}
export const arrowDown: ArrowDirection = { direction: 'down' };
export const arrowUp: ArrowDirection = { direction: 'up' };

// Nav.tsx
export interface NavProps {
  arrowDirection: ArrowDirection | string;
  mazesPatternButtonsRef: RefObject<Array<HTMLButtonElement>>;
  // eslint-disable-next-line no-unused-vars
  animateMazesAndPatterns: (maze: string, idx: number) => void;
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
