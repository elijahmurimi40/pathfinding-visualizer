/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import {
  dataIsStartNode, dataIsTargetNode, dataIsBombNode, dataIsWallNode,
} from '../helperFunctions/customAttr';
import { getAttr, addRemoveWallNode } from '../helperFunctions/helperFunctions';
import {
  drawSideWalls, wallSideUp, wallSideRightLeft, wallSideDown,
  animateDrawWalls,
} from './animateDrawSideWalls';
import {
  randomIntFromInterval, chooseOrientation, horizontal, randomIndex,
} from './mazesAndPatternsHelper';

// H for helper
let nodesH: HTMLDivElement[] = [];
let noOfRowsH: number = 0;
let noOfNodesH: number = 0;
let gapRow: number[] = [];
let gapColumn: number[] = [];
let initialGap = 2;

interface divideType {
  type: string;
  // [left, right]
  width: number[];
  // [up, down]
  height: number[];
  // [startX, startY]
  startXY: number[];
}

interface boundsType {
  row: number;
  column: number;
}

interface offSetType {
  x: number;
  y: number;
}

let upLeftBounds: boundsType = { row: 0, column: 0 };
let upRightBounds = { row: 0, column: 0 };
let downLeftBounds = { row: 0, column: 0 };
let downRightBounds = { row: 0, column: 0 };

// function to add to animation array
const addToAnimations = (
  nodeIdx: number, animations: number[], i: number, length: number, tempAnimations: number[],
) => {
  if (Number.isNaN(nodeIdx)) return;
  const isStartNode = getAttr(nodesH[nodeIdx], dataIsStartNode);
  const isTargetNode = getAttr(nodesH[nodeIdx], dataIsTargetNode);
  const isBombNode = getAttr(nodesH[nodeIdx], dataIsBombNode);
  addRemoveWallNode(nodesH[nodeIdx], nodeIdx);
  if (isStartNode === 'false' && isTargetNode === 'false' && isBombNode === 'false') {
    animations.push(nodeIdx);
    tempAnimations.push(nodeIdx);
  }
  if (i === length - 1) {
    const randomIdx = Math.floor(Math.random() * tempAnimations.length);
    const nodeIndex = tempAnimations[randomIdx];
    tempAnimations.splice(randomIdx, 1);
    addRemoveWallNode(nodesH[nodeIndex], nodeIndex);
    const row = Math.floor(nodeIndex / noOfNodesH);
    const col = nodeIndex - (row * noOfNodesH);
    const rowIdx = gapRow.indexOf(row);
    const colIdx = gapColumn.indexOf(col);
    if (rowIdx === -1) gapRow.push(row);
    if (colIdx === -1) gapColumn.push(col);

    const animationsNodeIndex = animations.indexOf(nodeIndex);
    if (animationsNodeIndex !== -1) animations.splice(animationsNodeIndex, 1);
  }
};

// length [] ie [horizontal length ie width, vertical length ie hieght]
const divide2 = (
  startX: number, startY: number,
  length: number[], orientation: string,
  animations: number[],
): divideType => {
  const tempAnimations: number[] = [];

  let widthLeft = 0;
  let widthRight = 0;
  let heightUp = 0;
  let heightDown = 0;
  // console.log(`${startX}-${startY}-${length}-${orientation}`);
  if (orientation === horizontal) {
    for (let i = 0; i < length[0]; i += 1) {
      const nodeIdx = startX + i;
      addToAnimations(nodeIdx, animations, i, length[0], tempAnimations);
    }
    const [width, height] = length;
    const row = Math.floor(startX / noOfNodesH);
    widthLeft = width;
    widthRight = width;
    // - 1 for the horizontal line drawn
    heightUp = row - 1;
    heightDown = height - row;
  } else {
    for (let i = 0; i < length[1]; i += 1) {
      const nodeIdx = (startY) + (i * noOfNodesH);
      addToAnimations(nodeIdx, animations, i, length[1], tempAnimations);
    }
    const [width, height] = length;
    const row = Math.floor(startY / noOfNodesH);
    const col = startY - (noOfNodesH * row);
    // minus one for the wall drawn
    widthLeft = col - 1;
    widthRight = width - col;
    heightUp = height;
    heightDown = height;
  }
  return {
    type: orientation,
    width: [widthLeft, widthRight],
    height: [heightUp, heightDown],
    startXY: [startX, startY],
  };
};

const divide = (
  startPos: number, length: number,
  orientation: string, animations: number[], offset: offSetType,
) => {
  const tempAnimations: number[] = [];
  let isGapIndex = false;
  let gapIndex = 0;
  const { x, y } = offset;
  const yH = orientation !== horizontal && y === 0 ? 1 : 0;
  for (let i = 1; i < length + 1; i += 1) {
    const nodeIdx = orientation === horizontal ? ((startPos + y) * noOfNodesH) + i + x
      : (i * noOfNodesH * yH) + startPos + x;
    addRemoveWallNode(nodesH[nodeIdx], nodeIdx);
    const isStartNode = getAttr(nodesH[nodeIdx], dataIsStartNode);
    const isTargetNode = getAttr(nodesH[nodeIdx], dataIsTargetNode);
    const isBombNode = getAttr(nodesH[nodeIdx], dataIsBombNode);
    if (isStartNode === 'false' && isTargetNode === 'false' && isBombNode === 'false') {
      animations.push(nodeIdx);
      tempAnimations.push(nodeIdx);
    }

    if (i === 1) {
      const nodeIndex = orientation === horizontal ? nodeIdx - 1 : nodeIdx - noOfNodesH;
      const row = Math.floor(nodeIndex / noOfNodesH);
      const col = nodeIndex - (row * noOfNodesH);
      const rowIdx = gapRow.indexOf(row);
      const colIdx = gapColumn.indexOf(col);
      const rowColIdx = orientation === horizontal ? colIdx : rowIdx;
      const isWallNode = getAttr(nodesH[nodeIndex], dataIsWallNode);
      if (rowColIdx !== -1 && isWallNode === 'false') {
        isGapIndex = true;
        gapIndex = nodeIndex;
      }
    }

    if (i === length - 1) {
      const nodeIndex = orientation === horizontal ? nodeIdx + 1 : nodeIdx + noOfNodesH;
      const row = Math.floor(nodeIndex / noOfNodesH);
      const col = nodeIndex - (row * noOfNodesH);
      const rowIdx = gapRow.indexOf(row);
      const colIdx = gapColumn.indexOf(col);
      const rowColIdx = orientation === horizontal ? colIdx : rowIdx;
      const isWallNode = getAttr(nodesH[nodeIndex], dataIsWallNode);
      if (rowColIdx !== -1 && isWallNode === 'false') {
        isGapIndex = true;
        gapIndex = nodeIndex;
      }
      if (gapIndex !== 0) {
        addRemoveWallNode(nodesH[gapIndex], gapIndex);
        const animationsNodeIndex = animations.indexOf(gapIndex);
        if (animationsNodeIndex !== -1) animations.splice(animationsNodeIndex, 1);
      }
    }

    if (i === length - 1 && !isGapIndex) {
      const randomIdx = randomIndex(tempAnimations.length);
      const nodeIndex = tempAnimations[randomIdx];
      tempAnimations.splice(randomIdx, 1);
      addRemoveWallNode(nodesH[nodeIndex], nodeIndex);
      const row = Math.floor(nodeIndex / noOfNodesH);
      const col = nodeIndex - (row * noOfNodesH);
      const rowIdx = gapRow.indexOf(row);
      const colIdx = gapColumn.indexOf(col);
      if (rowIdx === -1) gapRow.push(row);
      if (colIdx === -1) gapColumn.push(col);

      const animationsNodeIndex = animations.indexOf(nodeIndex);
      if (animationsNodeIndex !== -1) animations.splice(animationsNodeIndex, 1);
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

let pol = 0;
const recursiveDivisionHelper = (
  height: number, width: number,
  orientation: string, animations: number[], offset: offSetType,
) => {
  const startX = getStartXY(height, 'X');
  const startY = getStartXY(width, 'Y');
  const startPos = orientation === horizontal ? startX : startY;
  const length = orientation === horizontal ? width : height;

  pol += 1;
  console.log(`height Width - ${height}-${width}-${pol}`);
  console.log(`startXY - ${startX}-${startY}-${pol}`);
  console.log('--------------------------------');
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

const recursiveDivision = (nodes: HTMLDivElement[], noOfRows: number, noOfNodes: number) => {
  nodesH = nodes;
  noOfRowsH = noOfRows;
  noOfNodesH = noOfNodes;
  gapRow = [];
  gapColumn = [];
  initialGap = 2;
  const recursiveDivisionAnimations: number[] = [];

  const startY = randomIntFromInterval(noOfNodesH + 4, (noOfNodesH * 2) - 5);
  // magic number 8 for 4 nodes up and 4 nodes down
  // const lengths = noOfRowsH - 8;
  // const startXOptions = [];
  // for (let i = 0; i < lengths; i += 1) {
  //   const startX = ((i + 4) * noOfNodesH) + 1;
  //   startXOptions.push(startX);
  // }
  // const startXIdx = randomIndex(startXOptions.length);
  // const startX = startXOptions[startXIdx];

  recursiveDivisionHelper(
    noOfRows - 2, noOfNodesH - 2,
    chooseOrientation(4, 4), recursiveDivisionAnimations, { x: 0, y: 0 },
  );

  // recursiveDivisionHelper(
  //   upLeftBounds, upRightBounds,
  //   downLeftBounds, downRightBounds,
  //   chooseOrientation(3, 4), recursiveDivisionAnimations,
  // );

  // let animations: (number | number[])[] = [];
  // // up
  // drawSideWalls(nodes, noOfRows, noOfNodes, wallSideUp, animations);
  // // right left
  // drawSideWalls(nodes, noOfRows, noOfNodes, wallSideRightLeft, animations);
  // // down
  // animations = drawSideWalls(nodes, noOfRows, noOfNodes, wallSideDown, animations);
  // animateDrawWalls(animations, nodes, noOfNodes);
};

export default recursiveDivision;
