import { addRemoveWallNode } from '../helperFunctions/helperFunctions';
import {
  animateDrawWalls, drawSideWalls, wallSideDown, wallSideRightLeft, wallSideUp,
} from './animateDrawSideWalls';
import {
  chooseOrientation,
  divide,
  getStartXY, horizontal, offSetType, pushTimer, resetTimeouts,
} from './mazesAndPatternsHelper';

// VS for vertical skew
// H for helper
let nodesH: HTMLDivElement[] = [];
let noOfNodesH: number = 0;

const recursiveDivisionVerticalSkewHelper = (
  height: number, width: number,
  orientation: string, animations: number[], offset: offSetType,
) => {
  const startX = getStartXY(height, 'X');
  const startY = getStartXY(width, 'Y');
  const startPos = orientation === horizontal ? startX : startY;
  const length = orientation === horizontal ? width : height;

  if (width < 2 || height < 2) return;

  if (orientation === horizontal && typeof startX !== 'undefined') {
    divide(nodesH, noOfNodesH, startPos, length, orientation, animations, offset);
    const heightUp = startX - 1;
    const heightDown = height - startX;
    recursiveDivisionVerticalSkewHelper(
      heightUp, width,
      'vertical', animations, offset,
    );
    recursiveDivisionVerticalSkewHelper(
      heightDown, width,
      chooseOrientation(heightDown, width), animations, { x: offset.x, y: offset.y + startX },
    );
  } else if (orientation !== horizontal && typeof startY !== 'undefined') {
    divide(nodesH, noOfNodesH, startPos, length, orientation, animations, offset);
    const widthLeft = startY - 1;
    const widthRight = width - startY;
    recursiveDivisionVerticalSkewHelper(
      height, widthLeft,
      'vertical', animations, offset,
    );
    recursiveDivisionVerticalSkewHelper(
      height, widthRight,
      chooseOrientation(height, widthRight), animations, { x: offset.x + startY, y: offset.y },
    );
  }

  if (
    orientation !== horizontal && typeof startY === 'undefined'
    && typeof startX !== 'undefined' && width === 2
  ) {
    divide(nodesH, noOfNodesH, startX, width, horizontal, animations, offset);
    const heightUp = startX - 1;
    const heightDown = height - startX;
    recursiveDivisionVerticalSkewHelper(
      heightUp, width,
      'vertical', animations, offset,
    );
    recursiveDivisionVerticalSkewHelper(
      heightDown, width,
      'vertical', animations, { x: offset.x, y: offset.y + startX },
    );
  }
};

const animateRecursiveDivisionVS = (
  nodes: HTMLDivElement[], animations: number[], hideCover: () => void,
) => {
  resetTimeouts([]);
  for (let i = 0; i < animations.length; i += 1) {
    const timer = window.setTimeout(() => {
      const nodeIdx = animations[i];
      addRemoveWallNode(nodes[nodeIdx], nodeIdx);
      if (i === animations.length - 1) hideCover();
    }, i * 10);

    pushTimer(timer);
  }
};

const recursiveDivisionVerticalSkew = (
  nodes: HTMLDivElement[], noOfRows: number, noOfNodes: number, hideCover: () => void,
) => {
  nodesH = nodes;
  noOfNodesH = noOfNodes;
  const recursiveDivisionAnimations: number[] = [];
  recursiveDivisionVerticalSkewHelper(
    noOfRows - 2, noOfNodesH - 2,
    'vertical', recursiveDivisionAnimations, { x: 0, y: 0 },
  );

  let animations: (number | number[])[] = [];
  // up
  drawSideWalls(nodes, noOfRows, noOfNodes, wallSideUp, animations);
  // right left
  drawSideWalls(nodes, noOfRows, noOfNodes, wallSideRightLeft, animations);
  // down
  animations = drawSideWalls(nodes, noOfRows, noOfNodes, wallSideDown, animations);
  animateDrawWalls(
    animations, nodes, noOfNodes,
    recursiveDivisionAnimations, hideCover, animateRecursiveDivisionVS,
  );
};

export default recursiveDivisionVerticalSkew;
