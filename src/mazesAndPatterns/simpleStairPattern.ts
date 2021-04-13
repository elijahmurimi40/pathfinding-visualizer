import { addRemoveWallNode } from '../helperFunctions/helperFunctions';
import { resetTimeouts, pushTimer } from './mazesAndPatternsHelper';

const simpleStairPattern = (
  nodes: HTMLDivElement[],
  noOfRows: number,
  noOfNodes: number,
  hideCover: () => void,
) => {
  const startRow = Math.floor(noOfRows / 2);
  const startCol = Math.floor(noOfNodes / 2);
  const startNode = (startRow * noOfNodes) + startCol;
  const stairLength = Math.floor(noOfRows / 4);
  // const endColLeft = startCol;
  const endColRIght = noOfNodes % 2 === 0 ? startCol - 1 : startCol;
  addRemoveWallNode(nodes[startNode], startNode);

  // actual startNode
  const startNodeA = (startRow * noOfNodes) + Math.floor(noOfNodes / 4);
  // actual targetNode
  const targetNodeA = (startRow * noOfNodes) + noOfNodes - Math.floor(noOfNodes / 4) - 1;

  let stairLengthH = 0;
  let status = 'increment';
  resetTimeouts([]);
  const animations: number[] = [];
  for (let i = 1; i < startCol; i += 1) {
    if (stairLengthH === stairLength) status = 'decrement';
    if (stairLengthH === 0) status = 'increment';
    if (stairLengthH < stairLength && status === 'increment') {
      stairLengthH += 1;
    } else {
      stairLengthH -= 1;
    }

    const upNodeLeftIdx = ((startRow - stairLengthH) * noOfNodes) + (startCol - i);
    const downNodeLeftIdx = ((startRow + stairLengthH) * noOfNodes) + (startCol - i);
    const downNodeLeftIdxRow = Math.floor(downNodeLeftIdx / noOfNodes);
    const upNodeRightIdx = ((startRow - stairLengthH) * noOfNodes) + (startCol + i);
    const downNodeRightIdx = ((startRow + stairLengthH) * noOfNodes) + (startCol + i);
    const downNodeRightIdxRow = Math.floor(downNodeRightIdx / noOfNodes);

    animations.push(upNodeLeftIdx);
    if (downNodeLeftIdxRow !== startRow) {
      animations.push(downNodeLeftIdx);
    }
    if (downNodeLeftIdxRow === startRow && downNodeLeftIdx < startNodeA) {
      animations.push(downNodeLeftIdx);
    }

    if (i < endColRIght) {
      animations.push(upNodeRightIdx);
      if (downNodeRightIdxRow !== startRow) {
        animations.push(downNodeRightIdx);
      }
      if (downNodeRightIdxRow === startRow && downNodeRightIdx > targetNodeA) {
        animations.push(downNodeRightIdx);
      }
    }
  }

  for (let i = 0; i < animations.length; i += 1) {
    const timer = window.setTimeout(() => {
      const nodeIdx = animations[i];
      addRemoveWallNode(nodes[nodeIdx], nodeIdx);
      if (i === animations.length - 1) hideCover();
    }, i * 20);

    pushTimer(timer);
  }
};

export default simpleStairPattern;
