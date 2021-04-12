/* eslint-disable no-unused-vars */
import { dataIsStartNode, dataIsTargetNode, dataIsBombNode } from '../helperFunctions/customAttr';
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

let upLeftBounds: boundsType = { row: 0, column: 0 };
let upRightBounds = { row: 0, column: 0 };
let downLeftBounds = { row: 0, column: 0 };
let downRightBounds = { row: 0, column: 0 };

// function to add to animation array
const addToAnimations = (
  nodeIdx: number, animations: number[], i: number, length: number, tempAnimations: number[],
) => {
  if (Number.isNaN(nodeIdx)) return;
  console.log(nodeIdx);
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
  init: number, startPos: number, length: number,
  orientation: string, animations: number[],
) => {
  const tempAnimations: number[] = [];
  for (let i = init - 1; i <= length + 1; i += 1) {
    const nodeIdx = orientation === horizontal ? (startPos * noOfNodesH) + i
      : (i * noOfNodesH) + startPos;
    addRemoveWallNode(nodesH[nodeIdx], nodeIdx);
    const isStartNode = getAttr(nodesH[nodeIdx], dataIsStartNode);
    const isTargetNode = getAttr(nodesH[nodeIdx], dataIsTargetNode);
    const isBombNode = getAttr(nodesH[nodeIdx], dataIsBombNode);
    if (isStartNode === 'false' && isTargetNode === 'false' && isBombNode === 'false') {
      animations.push(nodeIdx);
      tempAnimations.push(nodeIdx);
    }

    if (i === length) {
      const randomIdx = randomIndex(tempAnimations.length);
      const nodeIndex = tempAnimations[randomIdx];
      tempAnimations.splice(randomIdx, 1);
      addRemoveWallNode(nodesH[nodeIndex], nodeIndex);
      const row = Math.floor(nodeIndex / noOfNodesH);
      const col = nodeIndex - (row * noOfNodesH);
      console.log(`${row}-${col}`);
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

let pol = 0;
const recursiveDivisionHelper = (
  upLeft: boundsType, upRight: boundsType,
  downLeft: boundsType, downRight: boundsType,
  orientation: string, animations: number[],
) => {
  // if (pol === 140) return;
  // going left to right
  const startX = randomIntFromInterval(
    upLeft.row + initialGap, downLeft.row - initialGap,
  );
  // going up to down
  const startY = randomIntFromInterval(
    upLeft.column + initialGap, upRight.column - initialGap,
  );
  // console.log(startY);
  // console.log(downRight.column);
  const init = upLeft.row;
  const startPos = orientation === horizontal ? startX : startY;
  const length = orientation === horizontal ? upRight.column : downRight.row;

  divide(init, startPos, length, orientation, animations);
  pol += 1;
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
  const lengths = noOfRowsH - 8;
  const startXOptions = [];
  for (let i = 0; i < lengths; i += 1) {
    const startX = ((i + 4) * noOfNodesH) + 1;
    startXOptions.push(startX);
  }
  const startXIdx = randomIndex(startXOptions.length);
  const startX = startXOptions[startXIdx];
  upLeftBounds = { row: 2, column: 2 };
  upRightBounds = { row: 2, column: noOfNodesH - 3 };
  downLeftBounds = { row: noOfRows - 3, column: 2 };
  downRightBounds = { row: noOfRows - 3, column: noOfNodesH - 3 };
  console.log(`upLeft ${JSON.stringify(upLeftBounds)}`);
  console.log(`upRight ${JSON.stringify(upRightBounds)}`);
  console.log(`downLeft ${JSON.stringify(downLeftBounds)}`);
  console.log(`downRight ${JSON.stringify(downRightBounds)}`);

  recursiveDivisionHelper(
    upLeftBounds, upRightBounds,
    downLeftBounds, downRightBounds,
    chooseOrientation(3, 4), recursiveDivisionAnimations,
  );

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
