import { getStartNodeIdx, getTargetNodeIdx } from '../App.Functions';
import {
  dataIsStartNode, dataIsTargetNode, dataIsWallNode, dataIsBombNode,
  dataIsFirstCol, dataIsLastCol, dataIsFirstRow, dataIsLastRow,
} from '../helperFunctions/customAttr';
import {
  getAttr, addRemoveWallNode, getNodeStartInfo, getNodeTargetInfo, getNodeBombInfo,
} from '../helperFunctions/helperFunctions';

// const up = 'up';
// const right = 'right';
const down = 'down';
const left = 'left';

// H for helper
let nodesH: HTMLDivElement[] = [];
let noOfRowsH : number = 0;
let noOfNodesH: number = 0;

const checkAndAddRemoveWallNode = (idx: number) => {
  console.log(idx);
  console.log(nodesH[idx]);
  const isStartNode = getAttr(nodesH[idx], dataIsStartNode);
  const isTargetNode = getAttr(nodesH[idx], dataIsTargetNode);
  const isBombNode = getAttr(nodesH[idx], dataIsBombNode);
  const isFirstCol = getAttr(nodesH[idx], dataIsFirstCol);
  const isLastCol = getAttr(nodesH[idx], dataIsLastCol);
  const isFirstRow = getAttr(nodesH[idx], dataIsFirstRow);
  const isLastRow = getAttr(nodesH[idx], dataIsLastRow);

  if (isStartNode === 'true') getNodeStartInfo().isWallNode = 'true';
  if (isTargetNode === 'true') getNodeTargetInfo().isWallNode = 'true';
  if (isBombNode === 'true') getNodeBombInfo().isWallNode = 'true';
  if (
    isStartNode !== 'true'
    && isTargetNode !== 'true'
    && isBombNode !== 'true'
    && isFirstCol !== 'true'
    && isLastCol !== 'true'
    && isFirstRow !== 'true'
    && isLastRow !== 'true'
  ) {
    addRemoveWallNode(nodesH[idx], idx);
  }
};

// direction is [down, left], [down, right], [up, left], [up, right]
const drawWall = (
  row: number,
  column: number,
  direction: string[],
  startNodeIdx: number,
  targetNodeIdx: number,
) => {
  let nodeIndex = 0;
  if (direction[0] === down) {
    switch (direction[1]) {
      case left:
        nodeIndex = (noOfNodesH * (row + 1) + (column - 1));
        break;
      default:
        nodeIndex = (noOfNodesH * (row + 1) + (column + 1));
    }
  } else {
    switch (direction[1]) {
      case left:
        nodeIndex = (noOfNodesH * (row - 1) + (column - 1));
        break;
      default:
        nodeIndex = (noOfNodesH * (row - 1) + (column + 1));
    }
  }

  const isWallNode = getAttr(nodesH[nodeIndex], dataIsWallNode);
  if (
    isWallNode === 'false'
    && nodeIndex > startNodeIdx
    && nodeIndex < targetNodeIdx
  ) checkAndAddRemoveWallNode(nodeIndex);

  if (
    nodeIndex <= startNodeIdx || nodeIndex >= targetNodeIdx
  ) checkAndAddRemoveWallNode(nodeIndex);
};

const simpleStairPattern = (
  nodes: HTMLDivElement[],
  noOfRows: number,
  noOfNodes: number,
) => {
  nodesH = nodes;
  noOfRowsH = noOfRows;
  noOfNodesH = noOfNodes;
  const initialStartNodeIdx = getStartNodeIdx();
  const initialTargetNodeIdx = getTargetNodeIdx();
  const startTargetDiff = Math.floor(Math.abs(initialStartNodeIdx - initialTargetNodeIdx) / 2);
  const stairLength = startTargetDiff % 2 === 0 ? startTargetDiff : startTargetDiff - 1;
  const startRow = Math.floor(noOfRowsH / 2) - stairLength;
  const endRow = startRow + (stairLength * 2);
  // magic number 2 since we start two nodes from startNode
  const column = Math.floor(noOfNodesH / 4) + stairLength + 2;

  // two nodes from startNode +2
  // const initialIndex = initialStartNodeIdx + 2;
  // checkAndAddRemoveWallNode(initialIndex);

  const startNodeTopIdx = (noOfNodesH * startRow) + column;
  const startNodeBottomIdx = (noOfNodesH * endRow) + column;
  console.log(noOfRowsH);
  checkAndAddRemoveWallNode(startNodeTopIdx);
  checkAndAddRemoveWallNode(startNodeBottomIdx);

  // C for copy
  let startRowC = startRow;
  let startColC = column;
  for (let i = 0; i < stairLength * 2; i += 1) {
    // const nodeIndexLeft = (noOfNodesH * (startRowLeft + 1) + (startEndColLeft - 1));
    // const isWallNode = getAttr(nodesH[nodeIndexLeft], dataIsWallNode);
    // if (
    //   isWallNode === 'false'
    //   && nodeIndexLeft > initialStartNodeIdx
    //   && nodeIndexLeft < initialTargetNodeIdx
    // ) checkAndAddRemoveWallNode(nodeIndexLeft);

    // if (
    //   nodeIndexLeft <= initialStartNodeIdx || nodeIndexLeft >= initialTargetNodeIdx
    // ) checkAndAddRemoveWallNode(nodeIndexLeft);
    drawWall(startRowC, startColC, [down, left], initialStartNodeIdx, initialTargetNodeIdx);

    startRowC += 1;
    startColC -= 1;
  }
};

export default simpleStairPattern;
