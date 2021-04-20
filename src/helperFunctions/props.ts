import { RefObject } from 'react';

// dropdown arrow direction
interface ArrowDirection {
  direction: string;
}
export const arrowDown: ArrowDirection = { direction: 'down' };
export const arrowUp: ArrowDirection = { direction: 'up' };

// add nav nav type for the mazes option
// active option not working when using same ref
// nav type
export const topNav = 'top_nav';
export const bottomNav = 'bottom_nav';

// Nav.tsx
export interface NavProps {
  navType: string;
  arrowDirection: ArrowDirection | string;
  mazesPatternButtonsRef: Array<RefObject<Array<HTMLButtonElement>>>;
  currentActiveMazeAndPattern: number
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
  clearPathNodes: () => void;
  clearWalls: () => void;
}
