import {
  dataIsBombNode, dataIsGapNode, dataIsStartNode, dataIsTargetNode,
} from '../helperFunctions/customAttr';
import { addGapNode, getAttr } from '../helperFunctions/helperFunctions';

const randomNumber = (min: number, max: number) => Math.random() * (max - min + 1) + min;
export const randomIntFromInterval = (
  min: number, max: number,
) => Math.floor(randomNumber(min, max));

// which way to bisect when making mazes
export const horizontal = 'horizontal';
export const vertical = 'vertical';

export const randomIndex = (length: number) => Math.floor(Math.random() * length);

// vertically or horizontally
export const chooseOrientation = (height: number, width: number): string => {
  if (width < height) return horizontal;
  if (height < width) return vertical;
  const orientation = [horizontal, vertical];
  const randomIdx = randomIndex(orientation.length);
  return orientation[randomIdx];
};

// timeouts
let timeouts: number[] = [];

export const clearTimeouts = () => {
  timeouts.forEach((timeout: number) => {
    clearTimeout(timeout);
  });
};

export const pushTimer = (timer: number) => {
  timeouts.push(timer);
};

export const resetTimeouts = (newTimeouts: number[]) => {
  timeouts = newTimeouts;
};

// export const consoleLogTimeouts = () => {
//   console.log(timeouts);
// };

// for recursive division
export interface offSetType {
  x: number;
  y: number;
}

// divide
export const divide = (
  nodes: HTMLDivElement[], noOfNodes: number,
  startPos: number, length: number,
  orientation: string, animations: number[], offset: offSetType,
) => {
  const tempAnimations: number[] = [];
  let isGapIndex = false;
  let gapIndex = 0;
  const { x, y } = offset;
  for (let i = 1; i < length + 1; i += 1) {
    const nodeIdx = orientation === horizontal ? ((startPos + y) * noOfNodes) + i + x
      : ((i + y) * noOfNodes) + startPos + x;
    const isStartNode = getAttr(nodes[nodeIdx], dataIsStartNode);
    const isTargetNode = getAttr(nodes[nodeIdx], dataIsTargetNode);
    const isBombNode = getAttr(nodes[nodeIdx], dataIsBombNode);
    animations.push(nodeIdx);
    if (isStartNode === 'false' && isTargetNode === 'false' && isBombNode === 'false') {
      tempAnimations.push(nodeIdx);
    }

    if (i === 1) {
      const nodeIndex = orientation === horizontal ? nodeIdx - 1 : nodeIdx - noOfNodes;
      const isGapNode = typeof nodes[nodeIndex] === 'undefined' ? false
        : getAttr(nodes[nodeIndex], dataIsGapNode);
      if (isGapNode === 'true') {
        isGapIndex = true;
        gapIndex = nodeIndex;
      }
      if (gapIndex !== 0) {
        const animationsNodeIndex = animations.indexOf(nodeIdx);
        if (animationsNodeIndex !== -1) animations.splice(animationsNodeIndex, 1);
        addGapNode(nodes[nodeIdx], nodeIdx);
        gapIndex = 0;
      }
    }

    if (i === length) {
      const nodeIndex = orientation === horizontal ? nodeIdx + 1 : nodeIdx + noOfNodes;
      const isGapNode = typeof nodes[nodeIndex] === 'undefined' ? false
        : getAttr(nodes[nodeIndex], dataIsGapNode);
      if (isGapNode === 'true') {
        isGapIndex = true;
        gapIndex = nodeIndex;
      }
      if (gapIndex !== 0) {
        const animationsNodeIndex = animations.indexOf(nodeIdx);
        if (animationsNodeIndex !== -1) animations.splice(animationsNodeIndex, 1);
        addGapNode(nodes[nodeIdx], nodeIdx);
        gapIndex = 0;
      }
    }

    if (i === length && !isGapIndex) {
      const randomIdx = randomIndex(tempAnimations.length);
      const nodeIndex = tempAnimations[randomIdx];
      tempAnimations.splice(randomIdx, 1);
      const animationsNodeIndex = animations.indexOf(nodeIndex);
      if (animationsNodeIndex !== -1) animations.splice(animationsNodeIndex, 1);
      addGapNode(nodes[nodeIndex], nodeIndex);
    }
  }
};

// get startXY for recursive division
export const getStartXY = (length: number, type: string) => {
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
