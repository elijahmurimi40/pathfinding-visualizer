import { transparent } from './helperFunctions/color';
import {
  dataIsStartNode, dataIsTargetNode, dataIsWallNode, dataIsBombNode, dataIdx,
} from './helperFunctions/customAttr';
import {
  bombNode, createDraggble, getNodeStartInfo, getNodeTargetInfo, getNodeBombInfo,
  wallNodes, addRemoveWallNode, getAttr, setAttr, getDarkMode,
} from './helperFunctions/helperFunctions';
import {
  NodeType, RowsType, RowType,
} from './helperFunctions/types';

let nodeIdx = 0;
let bombIndex = -1;
let i: HTMLElement | null = null;

let startNodeIdx = 0;
let targetNodeIdx = 0;

export const getStartNodeIdx = () => startNodeIdx;
export const getTargetNodeIdx = () => targetNodeIdx;

// get bombIndex
export const getBombIndex = () => bombIndex;

// generate a pfGrid
export const generatePfGrid = (noOfRows: number, noOfNodes: number): RowsType => {
  bombIndex = -1;
  i?.remove();

  const rows: RowsType = [];
  const startRow = Math.floor(noOfRows / 2);
  const startNode = Math.floor(noOfNodes / 4);
  for (let row = 0; row < noOfRows; row += 1) {
    const currentRow: RowType = [];
    for (let node = 0; node < noOfNodes; node += 1) {
      // column is equal to the current node number in a row
      const col = node;
      const currentNode: NodeType = {
        row,
        col,
        isNodeInFirstCol: col === 0,
        isNodeInLastCol: col === noOfNodes - 1,
        isNodeInFirstRow: row === 0,
        isNodeInLastRow: row === noOfRows - 1,
        isStartNode: row === startRow && col === startNode,
        isTargetNode: row === startRow && col === noOfNodes - startNode - 1,
        isWallNode: false,
        isBombNode: false,
        idx: nodeIdx,
      };
      if (currentNode.isStartNode) startNodeIdx = currentNode.idx;
      if (currentNode.isTargetNode) targetNodeIdx = currentNode.idx;
      nodeIdx += 1;
      currentRow.push(currentNode);
    }
    rows.push(currentRow);
  }
  nodeIdx = 0;
  return rows;
};

// toggle wall nodes
export const getNewPfGridWithWallToggled = (
  // rows: RowsType,
  // row: number,
  // col: number,
  elem: HTMLElement,
  nodes: HTMLDivElement[],
) => {
  // updating state makes app to slow down
  // const newGrid = rows.slice();
  // const node = newGrid[row][col];
  // const newNode = {
  //   ...node,
  //   isWallNode: !node.isWallNode,
  // };
  // newGrid[row][col] = newNode;
  // setPfgridRows(newGrid);
  const className = elem.classList;
  if (!className.contains('pf-grid-node')) return;

  const idx = getAttr(elem as HTMLDivElement, dataIdx) as unknown as number;
  const node = nodes[idx];
  const isStartNode = getAttr(node, dataIsStartNode);
  const isTargetNode = getAttr(node, dataIsTargetNode);
  const isBombNode = getAttr(node, dataIsBombNode);

  if (isStartNode === 'true' || isTargetNode === 'true' || isBombNode === 'true') return;

  // this results to a bug where if (isWallNode) means if isWallNode is false
  // and if (!isWallNode) is isWallNode is true confusion
  // if (isWallNode) {
  //   console.log(999);
  // } else {
  //   console.log(111);
  // }
  addRemoveWallNode(node, idx);
};

// clear wall nodes
export const clearWalls = (nodes: HTMLDivElement[], resetMazesAndPatterns: () => void) => {
  if (wallNodes.length === 0) return;
  resetMazesAndPatterns();
  getNodeStartInfo().isWallNode = 'false';
  getNodeTargetInfo().isWallNode = 'false';
  getNodeBombInfo().isWallNode = 'false';
  wallNodes.forEach((idx: number) => {
    const node: HTMLDivElement | null = nodes[idx];
    if (node !== null) {
      node.style.backgroundColor = transparent;
      setAttr(node, dataIsWallNode, 'false');
    }
  });
  wallNodes.length = 0;
};

// add bomb node
export const addBomb = (
  noOfNodes: number,
  nodes: HTMLDivElement[],
  sideNav: HTMLDivElement | null,
) => {
  const sideNavAddBomb = sideNav?.children[0];
  const addBombElem = sideNavAddBomb!!.children[1];

  // multiply by 2 for node to be in 3rd row
  const row = noOfNodes * 2;
  // node to be in the mid column
  const column = Math.floor(noOfNodes / 2);
  let nodeIndex = row + column;
  let node = nodes[nodeIndex];

  if (bombIndex === -1) {
    // loop checking if its start or target node to skip the node
    for (let j = 0; j < 2; j += 1) {
      const isStartNode = getAttr(node, dataIsStartNode);
      const isTargetNode = getAttr(node, dataIsTargetNode);
      if (isStartNode === 'false' && isTargetNode === 'false') break;
      nodeIndex += 1;
      node = nodes[nodeIndex];
    }
    const isWallNode = getAttr(node, dataIsWallNode);
    if (isWallNode === 'true') {
      getNodeBombInfo().index = nodeIndex;
      getNodeBombInfo().isWallNode = isWallNode;
      addRemoveWallNode(node, nodeIndex);
    } else {
      getNodeBombInfo().index = nodeIndex;
      getNodeBombInfo().isWallNode = isWallNode;
    }
    setAttr(node, dataIsBombNode, 'true');
    i = document.createElement('i');
    const addDarkMode = getDarkMode() ? 'inverted' : 'NA';
    i.classList.add('large', 'bomb', 'icon', bombNode, addDarkMode);
    node.appendChild(i);

    createDraggble(bombNode, nodeIndex, noOfNodes, nodes);

    addBombElem.textContent = 'Remove Bomb';
    bombIndex = nodeIndex;
  } else {
    const newNode = nodes[getNodeBombInfo().index];
    setAttr(newNode, dataIsBombNode, 'false');
    if (getNodeBombInfo().isWallNode === 'true') addRemoveWallNode(newNode, getNodeBombInfo().index);
    i?.remove();

    addBombElem.textContent = 'Add Bomb';
    bombIndex = -1;
  }
};
