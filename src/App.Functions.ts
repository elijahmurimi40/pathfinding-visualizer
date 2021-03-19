import { gsap } from 'gsap';
import { TweenLite } from 'gsap/all';
import { Draggable } from 'gsap/Draggable';
import { transparent, wallNodeColor } from './helperFunctions/color';
import {
  dataIsStartNode, dataIsTargetNode, dataIsWallNode, dataIsBombNode, dataIdx,
} from './helperFunctions/customAttr';
import {
  NodeType, RowsType, RowType, NodeInfoType,
} from './helperFunctions/types';

gsap.registerPlugin(Draggable, TweenLite);

let nodeIdx = 0;
let wallNodes: number[] = [];
let bombIndex = 0;
let i: HTMLElement | null = null;

const nodeInfo: NodeInfoType = {
  index: 0,
  isWallNode: 'false',
  x: 0,
  y: 0,
};

// getAttr
const getAttr = (node: HTMLDivElement, attr: string) => {
  // start target wall bomb
  switch (attr) {
    case dataIsStartNode:
      return node.getAttribute(attr);
    case dataIsTargetNode:
      return node.getAttribute(attr);
    case dataIsWallNode:
      return node.getAttribute(attr);
    case dataIsBombNode:
      return node.getAttribute(attr);
    case dataIdx:
      return node.getAttribute(attr);
    default:
      return node.getAttribute('');
  }
};

// setAttr
const setAttr = (node: HTMLDivElement, attr: string, value: any) => {
  switch (attr) {
    case dataIsWallNode:
      node.setAttribute(attr, value);
      break;
    case dataIsBombNode:
      node.setAttribute(attr, value);
      break;
    default:
      node.setAttribute('', '');
  }
};

// add remove wall node
const addRemoveWallNode = (node: HTMLDivElement, idx: number) => {
  const isWallNode = getAttr(node, dataIsWallNode);
  const nodeH = node;
  if (isWallNode === 'true') {
    const nodeIndex = wallNodes.indexOf(idx);
    if (nodeIndex !== -1) wallNodes.splice(nodeIndex, 1);
    nodeH.style.backgroundColor = transparent;
    setAttr(nodeH, dataIsWallNode, 'false');
  } else {
    wallNodes.push(idx);
    nodeH.style.backgroundColor = wallNodeColor;
    setAttr(nodeH, dataIsWallNode, 'true');
  }
};

// generate a pfGrid
export const generatePfGrid = (noOfRows: number, noOfNodes: number): RowsType => {
  bombIndex = 0;
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
        isNodeInLastRow: row === noOfRows - 1,
        isStartNode: row === startRow && col === startNode,
        isTargetNode: row === startRow && col === noOfNodes - startNode - 1,
        isWallNode: false,
        isBombNode: false,
        idx: nodeIdx,
      };
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
export const clearWalls = (nodes: HTMLDivElement[]) => {
  if (wallNodes.length === 0) return;
  wallNodes.forEach((idx: number) => {
    const node: HTMLDivElement | null = nodes[idx];
    if (node !== null) {
      node.style.backgroundColor = transparent;
      setAttr(node, dataIsWallNode, 'false');
    }
  });
  wallNodes = [];
};

// add bomb node
export const addBomb = (
  offset: number,
  noOfNodes: number,
  nodes: HTMLDivElement[],
  sideNav: HTMLDivElement | null,
) => {
  const sideNavAddBomb = sideNav?.children[0];
  const addBombElem = sideNavAddBomb!!.children[1];

  // multiply by 2 for node to be in 3rd row
  const rowIndex = noOfNodes * 2;
  // node to be in the mid column
  const nodeIndex = Math.floor(noOfNodes / 2);
  const node = nodes[rowIndex + nodeIndex];

  if (bombIndex === 0) {
    const isWallNode = getAttr(node, dataIsWallNode);
    if (isWallNode === 'true') {
      nodeInfo.index = rowIndex + nodeIndex;
      nodeInfo.isWallNode = isWallNode;
      addRemoveWallNode(node, rowIndex + nodeIndex);
    } else {
      nodeInfo.isWallNode = isWallNode;
    }
    setAttr(node, dataIsBombNode, 'true');
    i = document.createElement('i');
    i.classList.add('large', 'bomb', 'icon', 'bomb-node');
    node.appendChild(i);

    /**
     * Magic number 25
     * height and width of node is 25
     *
     * magic number 2
     * since we multplied by 2 for row index and
     * divide by 2 for node index
     */

    Draggable.create('.bomb-node', {
      type: 'x,y',
      bounds: '.pf-grid-node-holder',
      inertia: true,
      liveSnap: true,
      snap: {
        x(endValue) {
          return Math.round(endValue / 25) * 25;
        },
        y(endValue) {
          return Math.round(endValue / 25) * 25;
        },
      },
      onDrag() {
        if (nodeInfo.isWallNode === 'true') {
          addRemoveWallNode(nodes[nodeInfo.index], nodeInfo.index);
        }
        const tempRowIndex = ((this.y / 25) + 2) * noOfNodes;
        const tempNodeIndex = (this.x / 25) + nodeIndex;

        nodeInfo.index = tempRowIndex + tempNodeIndex;

        const tempNode = nodes[nodeInfo.index];
        const isWallNodeTemp = getAttr(tempNode, dataIsWallNode);
        const isStartNode = getAttr(tempNode, dataIsStartNode);
        const isTargetNode = getAttr(tempNode, dataIsTargetNode);

        nodeInfo.isWallNode = isWallNodeTemp;
        if (isWallNodeTemp === 'true') addRemoveWallNode(tempNode, nodeInfo.index);

        if (isStartNode === 'false' && isTargetNode === 'false') {
          nodeInfo.x = this.x;
          nodeInfo.y = this.y;
        }
      },
      onDragEnd(e) {
        const isStartNode = getAttr(nodes[nodeInfo.index], dataIsStartNode);
        const isTargetNode = getAttr(nodes[nodeInfo.index], dataIsTargetNode);

        if (isStartNode === 'true' || isTargetNode === 'true') {
          const tempRowIndex = ((nodeInfo.y / 25) + 2) * noOfNodes;
          const tempNodeIndex = (nodeInfo.x / 25) + nodeIndex;
          nodeInfo.index = tempRowIndex + tempNodeIndex;
          TweenLite.to(e.target, { x: nodeInfo.x, y: nodeInfo.y });
        }

        setAttr(nodes[bombIndex], dataIsBombNode, 'false');
        bombIndex = nodeInfo.index;
        setAttr(nodes[bombIndex], dataIsBombNode, 'true');
      },
    });

    addBombElem.textContent = 'Remove Bomb';
    bombIndex = rowIndex + nodeIndex;
  } else {
    if (nodeInfo.isWallNode === 'true') addRemoveWallNode(node, nodeInfo.index);
    setAttr(node, dataIsBombNode, 'false');
    const child = node.children[0];
    node.removeChild(child);

    addBombElem.textContent = 'Add Bomb';
    bombIndex = 0;
  }
};
