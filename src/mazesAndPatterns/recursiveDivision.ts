/* eslint-disable no-unused-vars */
import {
  dataIsStartNode, dataIsTargetNode, dataIsBombNode, dataIsGapNode,
} from '../helperFunctions/customAttr';
import { getAttr, addRemoveWallNode, addGapNode } from '../helperFunctions/helperFunctions';
import {
  wallSideUp, wallSideDown, wallSideRightLeft, drawSideWalls, animateDrawWalls,
} from './animateDrawSideWalls';
import {
  chooseOrientation, horizontal, pushTimer, randomIndex, resetTimeouts,
} from './mazesAndPatternsHelper';

// H for helper
let nodesH: HTMLDivElement[] = [];
let noOfNodesH: number = 0;
let initialGap = 2;

interface offSetType {
  x: number;
  y: number;
}

// divide
const divide = (
  startPos: number, length: number,
  orientation: string, animations: number[], offset: offSetType,
) => {
  const tempAnimations: number[] = [];
  let isGapIndex = false;
  let gapIndex = 0;
  const { x, y } = offset;
  for (let i = 1; i < length + 1; i += 1) {
    const nodeIdx = orientation === horizontal ? ((startPos + y) * noOfNodesH) + i + x
      : ((i + y) * noOfNodesH) + startPos + x;
    const isStartNode = getAttr(nodesH[nodeIdx], dataIsStartNode);
    const isTargetNode = getAttr(nodesH[nodeIdx], dataIsTargetNode);
    const isBombNode = getAttr(nodesH[nodeIdx], dataIsBombNode);
    animations.push(nodeIdx);
    if (isStartNode === 'false' && isTargetNode === 'false' && isBombNode === 'false') {
      tempAnimations.push(nodeIdx);
    }

    if (i === 1) {
      const nodeIndex = orientation === horizontal ? nodeIdx - 1 : nodeIdx - noOfNodesH;
      const isGapNode = typeof nodesH[nodeIndex] === 'undefined' ? false
        : getAttr(nodesH[nodeIndex], dataIsGapNode);
      if (isGapNode === 'true') {
        isGapIndex = true;
        gapIndex = nodeIndex;
      }
      if (gapIndex !== 0) {
        const animationsNodeIndex = animations.indexOf(nodeIdx);
        if (animationsNodeIndex !== -1) animations.splice(animationsNodeIndex, 1);
        addGapNode(nodesH[nodeIdx], nodeIdx);
        gapIndex = 0;
      }
    }

    if (i === length) {
      const nodeIndex = orientation === horizontal ? nodeIdx + 1 : nodeIdx + noOfNodesH;
      const isGapNode = typeof nodesH[nodeIndex] === 'undefined' ? false
        : getAttr(nodesH[nodeIndex], dataIsGapNode);
      if (isGapNode === 'true') {
        isGapIndex = true;
        gapIndex = nodeIndex;
      }
      if (gapIndex !== 0) {
        const animationsNodeIndex = animations.indexOf(nodeIdx);
        if (animationsNodeIndex !== -1) animations.splice(animationsNodeIndex, 1);
        addGapNode(nodesH[nodeIdx], nodeIdx);
        gapIndex = 0;
      }
    }

    if (i === length && !isGapIndex) {
      const randomIdx = randomIndex(tempAnimations.length);
      const nodeIndex = tempAnimations[randomIdx];
      tempAnimations.splice(randomIdx, 1);
      const animationsNodeIndex = animations.indexOf(nodeIndex);
      if (animationsNodeIndex !== -1) animations.splice(animationsNodeIndex, 1);
      addGapNode(nodesH[nodeIndex], nodeIndex);
    }
  }
  initialGap = 0;
};

const getStartXY = (length: number, type: string) => {
  const startXOptions = [];
  const startYOptions = [];
  for (let i = 2; i < length; i += 1) {
    if (type === 'X') {
      startXOptions.push(i);
    }
    if (type === 'Y') {
      startYOptions.push(i);
    }
  }

  if (type === 'X' && startXOptions.length !== 0) {
    const startXIdx = randomIndex(startXOptions.length);
    return startXOptions[startXIdx];
  }
  const startYIdx = randomIndex(startYOptions.length);
  return startYOptions[startYIdx];
};

const recursiveDivisionHelper = (
  height: number, width: number,
  orientation: string, animations: number[], offset: offSetType,
) => {
  const startX = getStartXY(height, 'X');
  const startY = getStartXY(width, 'Y');
  const startPos = orientation === horizontal ? startX : startY;
  const length = orientation === horizontal ? width : height;

  if (width < 2 || height < 2) return;

  if (orientation === horizontal && typeof startX !== 'undefined') {
    divide(startPos, length, orientation, animations, offset);
    const heightUp = startX - 1;
    const heightDown = height - startX;
    recursiveDivisionHelper(
      heightUp, width,
      chooseOrientation(heightUp, width), animations, offset,
    );
    recursiveDivisionHelper(
      heightDown, width,
      chooseOrientation(heightDown, width), animations, { x: offset.x, y: offset.y + startX },
    );
  } else if (orientation !== horizontal && typeof startY !== 'undefined') {
    divide(startPos, length, orientation, animations, offset);
    const widthLeft = startY - 1;
    const widthRight = width - startY;
    recursiveDivisionHelper(
      height, widthLeft,
      chooseOrientation(height, widthLeft), animations, offset,
    );
    recursiveDivisionHelper(
      height, widthRight,
      chooseOrientation(height, widthRight), animations, { x: offset.x + startY, y: offset.y },
    );
  }
};

const animateRecursiveDivision = (
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

const recursiveDivision = (
  nodes: HTMLDivElement[], noOfRows: number, noOfNodes: number, hideCover: () => void,
) => {
  nodesH = nodes;
  noOfNodesH = noOfNodes;
  initialGap = 2;
  const recursiveDivisionAnimations: number[] = [];
  recursiveDivisionHelper(
    noOfRows - 2, noOfNodesH - 2,
    chooseOrientation(4, 4), recursiveDivisionAnimations, { x: 0, y: 0 },
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
    recursiveDivisionAnimations, hideCover, animateRecursiveDivision,
  );
};

export default recursiveDivision;
