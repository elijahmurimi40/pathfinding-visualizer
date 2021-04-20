import { addRemoveWallNode } from '../helperFunctions/helperFunctions';
import { resetTimeouts, pushTimer } from './mazesAndPatternsHelper';

// side of wall being drawn
export const wallSideUp = 'up';
export const wallSideDown = 'down';
export const wallSideRightLeft = 'left';

export const drawSideWalls = (
  nodes: HTMLDivElement[], noOfRows: number, noOfNodes: number,
  wallSide: string, animations: (number | number[])[],
) => {
  let init = 0;
  let condition = 0;
  let final = 0;

  switch (wallSide) {
    case wallSideUp:
      init = 0;
      condition = noOfNodes;
      final = 1;
      break;
    case wallSideDown:
      init = (noOfRows - 1) * noOfNodes;
      condition = noOfRows * noOfNodes;
      final = 1;
      break;
    default:
      init = noOfNodes;
      condition = noOfNodes * (noOfRows - 1);
      final = noOfNodes;
  }

  for (let i = init; i < condition; i += final) {
    if (wallSide === wallSideRightLeft) {
      animations.push([i, i + noOfNodes - 1]);
    } else {
      animations.push(i);
    }
  }

  return animations;
};

export const animateDrawWalls = (
  animations: (number | number[])[], nodes: HTMLDivElement[], noOfNodes: number,
  recursiveDivisionAnimations: number[], hideCover: () => void,
  animateRecursiveDivision: (
    // H for helper
    // eslint-disable-next-line no-unused-vars
    nodesH: HTMLDivElement[], animationsH: number[], hideCoverH: () => void,
  ) => void,
) => {
  resetTimeouts([]);

  for (let i = 0; i < animations.length; i += 1) {
    const timer = window.setTimeout(() => {
      const idx = animations[i];
      if (i >= noOfNodes && i < animations.length - noOfNodes) {
        const leftIdx = (idx as number[])[0];
        const rightIdx = (idx as number[])[1];
        addRemoveWallNode(nodes[leftIdx], leftIdx);
        addRemoveWallNode(nodes[rightIdx], rightIdx);
      } else {
        addRemoveWallNode(nodes[idx as number], idx as number);
      }

      if (i === animations.length - 1) {
        animateRecursiveDivision(nodes, recursiveDivisionAnimations, hideCover);
      }
    }, i * 20);

    pushTimer(timer);
  }
};
