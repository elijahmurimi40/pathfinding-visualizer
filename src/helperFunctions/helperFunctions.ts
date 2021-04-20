import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
// import { TweenLite } from 'gsap/all';
import { NodeInfoType } from './types';
import {
  dataIsStartNode, dataIsTargetNode, dataIsWallNode, dataIsBombNode, dataIdx,
  dataIsFirstCol, dataIsLastCol, dataIsFirstRow, dataIsLastRow, dataIsGapNode,
} from './customAttr';
import {
  shortestPathNodeColor, transparent, visitedNodeColor, visitedNodeColorToBomb, wallNodeColor,
} from './color';

gsap.registerPlugin(Draggable);

let initialIndex = 0;
let isDarkMode = false;

let nodeInfoStart: NodeInfoType = {
  index: 0,
  isWallNode: 'false',
  x: 0,
  y: 0,
};

let nodeInfoTarget: NodeInfoType = {
  index: 0,
  isWallNode: 'false',
  x: 0,
  y: 0,
};

let nodeInfoBomb: NodeInfoType = {
  index: 0,
  isWallNode: 'false',
  x: 0,
  y: 0,
};

let nodeInfo: NodeInfoType = {
  index: 0,
  isWallNode: 'false',
  x: 0,
  y: 0,
};

/**
 * Calculate node new index.
 * Array to be passed [nodeIndex, noOfNodes, x, y]
 * initial row: where the node is located according
 * to the number of nodes in a row and the row it is at
 * eg number of nodes = 9
 * row is 0 so initial row is 9 * 0;
 * row is 4 so inital row is 9 * 4;
 */
const calculateNodeNewIndex = (params: number[]) => {
  const initialRow = Math.floor(params[0] / params[1]) * params[1];
  const row = ((params[3] / 25) * params[1]) + initialRow;
  const column = (params[2] / 25) + (params[0] % params[1]);
  nodeInfo.index = row + column;
};

// get is dark mode
export const getDarkMode = () => isDarkMode;

// set is dark mode
export const setDarkMode = (darkMode: boolean) => {
  isDarkMode = darkMode;
};

// visited nodes array
export const visitedNodesBomb: number[] = [];
export const visitedNodesTarget: number[] = [];

// path nodes array
export const pathNodes: number[] = [];

// gap nodes array
export const gapNodes: number[] = [];

// wall nodes array
export const wallNodes: number[] = [];

// type of classes for draggable start, target and bomb node
export const startNode = 'start-node';
export const targetNode = 'target-node';
export const bombNode = 'bomb-node';

// get nodeStartInfo
export const getNodeStartInfo = () => nodeInfoStart;

// get nodeTargetInfo
export const getNodeTargetInfo = () => nodeInfoTarget;

// get nodeBombInfo
export const getNodeBombInfo = () => nodeInfoBomb;

// getAttr
export const getAttr = (node: HTMLDivElement, attr: string) => {
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
    case dataIsFirstCol:
      return node.getAttribute(attr);
    case dataIsLastCol:
      return node.getAttribute(attr);
    case dataIsFirstRow:
      return node.getAttribute(attr);
    case dataIsLastRow:
      return node.getAttribute(attr);
    case dataIsGapNode:
      return node.getAttribute(attr);
    default:
      return node.getAttribute('');
  }
};

// setAttr
export const setAttr = (node: HTMLDivElement, attr: string, value: any) => {
  switch (attr) {
    case dataIsStartNode:
      node.setAttribute(attr, value);
      break;
    case dataIsTargetNode:
      node.setAttribute(attr, value);
      break;
    case dataIsWallNode:
      node.setAttribute(attr, value);
      break;
    case dataIsBombNode:
      node.setAttribute(attr, value);
      break;
    case dataIsGapNode:
      node.setAttribute(attr, value);
      break;
    default:
      node.setAttribute('', '');
  }
};

// add visited nodes
export const addVisitedNode = (node: HTMLDivElement, toTarget: string, idx: number) => {
  const nodeH = node;
  if (toTarget === 'BOMB') {
    visitedNodesBomb.push(idx);
    nodeH.style.backgroundColor = visitedNodeColorToBomb;
  } else {
    visitedNodesTarget.push(idx);
    nodeH.style.backgroundColor = visitedNodeColor;
  }
};

// add path node
export const addPathNode = (node: HTMLDivElement, idx: number) => {
  pathNodes.push(idx);
  const nodeH = node;
  nodeH.classList.remove('pf-grid-node-border-color');
  nodeH.style.backgroundColor = shortestPathNodeColor;
};

// add gapNode
export const addGapNode = (node: HTMLDivElement, idx: number) => {
  gapNodes.push(idx);
  setAttr(node, dataIsGapNode, 'true');
};

// add remove wall node
export const addRemoveWallNode = (node: HTMLDivElement, idx: number) => {
  const isStartNode = getAttr(node, dataIsStartNode);
  const isTargetNode = getAttr(node, dataIsTargetNode);
  const isWallNode = getAttr(node, dataIsWallNode);
  const isBombNode = getAttr(node, dataIsBombNode);
  const nodeH = node;

  if (isStartNode === 'true') { nodeInfoStart.isWallNode = 'true'; return; }
  if (isTargetNode === 'true') { nodeInfoTarget.isWallNode = 'true'; return; }
  if (isBombNode === 'true') { nodeInfoBomb.isWallNode = 'true'; return; }

  if (isWallNode === 'true') {
    const nodeIndex = wallNodes.indexOf(idx);
    if (nodeIndex !== -1) wallNodes.splice(nodeIndex, 1);
    nodeH.style.backgroundColor = transparent;
    setAttr(nodeH, dataIsWallNode, 'false');
    nodeH.classList.add('pf-grid-node-border-color');
  } else {
    wallNodes.push(idx);
    nodeH.style.backgroundColor = wallNodeColor;
    setAttr(nodeH, dataIsWallNode, 'true');
    nodeH.classList.remove('pf-grid-node-border-color');
  }
};

// make elements draggalbe start, target and bomb node
export const createDraggble = (
  className: string,
  nodeIndex: number,
  noOfNodes: number,
  nodes: HTMLDivElement[] | null,
) => {
  if (className === startNode) nodeInfoStart.index = nodeIndex;
  if (className === targetNode) nodeInfoTarget.index = nodeIndex;
  Draggable.create(`.${className}`, {
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
    onPress() {
      if (className === startNode) {
        nodeInfo = JSON.parse(JSON.stringify(nodeInfoStart));
        if (nodes !== null) setAttr(nodes[nodeInfo.index], dataIsStartNode, 'false');
      }
      if (className === targetNode) {
        nodeInfo = JSON.parse(JSON.stringify(nodeInfoTarget));
        if (nodes !== null) setAttr(nodes[nodeInfo.index], dataIsTargetNode, 'false');
      }
      if (className === bombNode) {
        nodeInfo = JSON.parse(JSON.stringify(nodeInfoBomb));
        if (nodes !== null) setAttr(nodes[nodeInfo.index], dataIsBombNode, 'false');
      }
      initialIndex = nodeInfo.index === 0 ? nodeIndex : nodeInfo.index;
    },
    onDrag() {
      if (nodes === null) return;
      if (nodeInfo.isWallNode === 'true') {
        addRemoveWallNode(nodes[nodeInfo.index], nodeInfo.index);
      }
      calculateNodeNewIndex([nodeIndex, noOfNodes, this.x, this.y]);

      const node = nodes[nodeInfo.index];
      const isStartNode = getAttr(node, dataIsStartNode);
      const isTargetNode = getAttr(node, dataIsTargetNode);
      const isWallNode = getAttr(node, dataIsWallNode);
      const isBombNode = getAttr(node, dataIsBombNode);

      nodeInfo.isWallNode = isWallNode;
      if (isWallNode === 'true') addRemoveWallNode(node, nodeInfo.index);

      // dragging startNode
      if (className === startNode && isTargetNode === 'false' && isBombNode === 'false') {
        nodeInfo.x = this.x;
        nodeInfo.y = this.y;
      }

      // dragging tagetNode
      if (className === targetNode && isStartNode === 'false' && isBombNode === 'false') {
        nodeInfo.x = this.x;
        nodeInfo.y = this.y;
      }

      // dragging bombNode
      if (className === bombNode && isStartNode === 'false' && isTargetNode === 'false') {
        nodeInfo.x = this.x;
        nodeInfo.y = this.y;
      }
    },
    onDragEnd() {
      if (nodes === null) return;
      const isStartNode = getAttr(nodes[nodeInfo.index], dataIsStartNode);
      const isTargetNode = getAttr(nodes[nodeInfo.index], dataIsTargetNode);
      const isBombNode = getAttr(nodes[nodeInfo.index], dataIsBombNode);

      // while dragging start node
      // when the end position is occupied.
      if (isStartNode === 'true' || isTargetNode === 'true' || isBombNode === 'true') {
        calculateNodeNewIndex([nodeIndex, noOfNodes, nodeInfo.x, nodeInfo.y]);
        const isWallNode = getAttr(nodes[nodeInfo.index], dataIsWallNode);
        nodeInfo.isWallNode = isWallNode;
        if (isWallNode === 'true') {
          addRemoveWallNode(nodes[nodeInfo.index], nodeInfo.index);
        }
        // TweenLite.to(`.${className}`, { x: nodeInfo.x, y: nodeInfo.y });
        gsap.to(`.${className}`, { x: nodeInfo.x, y: nodeInfo.y });
      }

      // dragging startNode
      if (className === startNode) {
        nodeInfoStart = JSON.parse(JSON.stringify(nodeInfo));
        setAttr(nodes[initialIndex], dataIsStartNode, 'false');
        setAttr(nodes[nodeInfo.index], dataIsStartNode, 'true');
      }

      // dragging tagetNode
      if (className === targetNode) {
        nodeInfoTarget = JSON.parse(JSON.stringify(nodeInfo));
        setAttr(nodes[initialIndex], dataIsTargetNode, 'false');
        setAttr(nodes[nodeInfo.index], dataIsTargetNode, 'true');
      }

      // dragging bombNode
      if (className === bombNode) {
        nodeInfoBomb = JSON.parse(JSON.stringify(nodeInfo));
        setAttr(nodes[initialIndex], dataIsBombNode, 'false');
        setAttr(nodes[nodeInfo.index], dataIsBombNode, 'true');
      }
    },
  });
};
