// Depth-first search
import { getBombIndex } from '../App.Functions';
import { dataIsWallNode } from '../helperFunctions/customAttr';
import {
  getAttr, getNodeBombInfo, getNodeStartInfo, getNodeTargetInfo,
} from '../helperFunctions/helperFunctions';
import {
  animateBombNode, conditionDown, conditionLeft, conditionRight, conditionUp, findOptimalPath,
} from './pathfindingAlgorithmsOptions';

interface NodeType {
  nodeIdx: number,
  nodeIdxParent: number,
  directionToVisit: string[],
  directionVisited: string[],
}

const UP = 'UP';
const DOWN = 'DOWN';
const LEFT = 'LEFT';
const RIGHT = 'RIGHT';

const openNodes: Map<number, NodeType> = new Map();
const closedNodes: Map<number, NodeType> = new Map();
let startNode = getNodeStartInfo();
let targetNode = getNodeTargetInfo();
let bombNode = getBombIndex();
let isPathFound = true;
let isBombPathFound = true;
// H for helper
let nodesH: HTMLDivElement[] = [];
let noOfNodesH: number = 0;

const getNeighbour = (
  condition: boolean, nodeIdx: number,
  nodeStart: NodeType, nodeNeighbours: NodeType[],
) => {
  if (condition) {
    const isWallNode = getAttr(nodesH[nodeIdx], dataIsWallNode);
    if (isWallNode === 'false') {
      const node: NodeType = {
        nodeIdx,
        nodeIdxParent: nodeStart.nodeIdx,
        directionToVisit: [],
        directionVisited: [],
      };
      nodeNeighbours.push(node);
    }
  }
};

const depthFirstSearchHelper = (
  animations: number[], stack: NodeType[], targetType: string, nodeTarget: number,
) => {
  let nodeStart: NodeType = {
    nodeIdx: -1, nodeIdxParent: -1, directionToVisit: [], directionVisited: [],
  };
  if (stack.length >= 1) nodeStart = stack[stack.length - 1];

  if (nodeStart.nodeIdx === nodeTarget) {
    animations.push(nodeStart.nodeIdx);
    closedNodes.set(nodeStart.nodeIdx, nodeStart);
    return;
  }
  if (nodeStart.nodeIdx === -1 && stack.length === 0 && targetType === '') { isPathFound = false; return; }
  if (nodeStart.nodeIdx === -1 && stack.length === 0 && targetType !== '') { isBombPathFound = false; return; }

  if (nodeStart.directionVisited.length === 0) {
    if (conditionUp(nodesH[nodeStart.nodeIdx])) nodeStart.directionToVisit.push(UP);
    if (conditionDown(nodesH[nodeStart.nodeIdx])) nodeStart.directionToVisit.push(DOWN);
    if (conditionLeft(nodesH[nodeStart.nodeIdx])) nodeStart.directionToVisit.push(LEFT);
    if (conditionRight(nodesH[nodeStart.nodeIdx])) nodeStart.directionToVisit.push(RIGHT);
  }

  const randomIndex = Math.floor(Math.random() * nodeStart.directionToVisit.length);
  const direction = nodeStart.directionToVisit[randomIndex];
  const indexOfDirection = nodeStart.directionToVisit.indexOf(direction);
  nodeStart.directionVisited.push(direction);
  nodeStart.directionToVisit.splice(indexOfDirection, 1);

  const isNeighbourInClosedH = closedNodes.has(nodeStart.nodeIdx);
  if (!isNeighbourInClosedH) closedNodes.set(nodeStart.nodeIdx, nodeStart);
  if (nodeStart.directionToVisit.length === 0) {
    // closedNodes.set(nodeStart.nodeIdx, nodeStart);
    openNodes.delete(nodeStart.nodeIdx);
    stack.pop();
  }

  const nodeIndexAnimation = animations.indexOf(nodeStart.nodeIdx);
  if (nodeIndexAnimation === -1) animations.push(nodeStart.nodeIdx);
  const nodeNeighbours: NodeType[] = [];

  let nodeIdx = 0;
  // neighbour up
  if (direction === UP) {
    nodeIdx = nodeStart.nodeIdx - noOfNodesH;
    getNeighbour(
      conditionUp(nodesH[nodeStart.nodeIdx]), nodeIdx, nodeStart, nodeNeighbours,
    );
  }

  // neighbour down
  if (direction === DOWN) {
    nodeIdx = nodeStart.nodeIdx + noOfNodesH;
    getNeighbour(
      conditionDown(nodesH[nodeStart.nodeIdx]), nodeIdx, nodeStart, nodeNeighbours,
    );
  }

  // neighbour left
  if (direction === LEFT) {
    nodeIdx = nodeStart.nodeIdx - 1;
    getNeighbour(
      conditionLeft(nodesH[nodeStart.nodeIdx]), nodeIdx, nodeStart, nodeNeighbours,
    );
  }

  // neighbour right
  if (direction === RIGHT) {
    nodeIdx = nodeStart.nodeIdx + 1;
    getNeighbour(
      conditionRight(nodesH[nodeStart.nodeIdx]), nodeIdx, nodeStart, nodeNeighbours,
    );
  }

  // nodeNeighbours array should have on item
  nodeNeighbours.forEach((node: NodeType) => {
    const isNeighbourInClosed = closedNodes.has(node.nodeIdx);
    const isNeighbourInOpen = openNodes.has(node.nodeIdx);
    if (!isNeighbourInClosed && !isNeighbourInOpen) {
      openNodes.set(node.nodeIdx, node);
      stack.push(node);
    }
  });

  depthFirstSearchHelper(animations, stack, targetType, nodeTarget);
};

const depthFirstSearch = (
  nodes: HTMLDivElement[],
  noOfRows: number,
  noOfNodes: number,
  hideCover: () => void,
  showError: () => void,
) => {
  nodesH = nodes;
  noOfNodesH = noOfNodes;
  startNode = getNodeStartInfo();
  targetNode = getNodeTargetInfo();
  bombNode = getBombIndex();
  isPathFound = true;
  isBombPathFound = true;
  closedNodes.clear();
  openNodes.clear();

  const bombIndex = getNodeBombInfo();
  const bombAnimations: number[] = [];
  const targetAnimations: number[] = [];
  const optimalPath: number[] = [];

  if (bombNode !== -1) {
    const stack: NodeType[] = [];
    stack.push({
      nodeIdx: startNode.index, nodeIdxParent: 0, directionToVisit: [], directionVisited: [],
    });
    openNodes.set(startNode.index, {
      nodeIdx: startNode.index, nodeIdxParent: 0, directionToVisit: [], directionVisited: [],
    });
    depthFirstSearchHelper(bombAnimations, stack, 'B', bombIndex.index);
    if (isBombPathFound) {
      const auxPath = [];
      auxPath.push(bombIndex.index);
      findOptimalPath(auxPath, optimalPath, startNode.index, bombIndex.index, closedNodes, true);
    }

    openNodes.clear();
    closedNodes.clear();
    // T for target
    const stackT: NodeType[] = [];
    stackT.push({
      nodeIdx: bombIndex.index, nodeIdxParent: 0, directionToVisit: [], directionVisited: [],
    });
    openNodes.set(bombIndex.index, {
      nodeIdx: bombIndex.index, nodeIdxParent: 0, directionToVisit: [], directionVisited: [],
    });
    if (isBombPathFound) {
      depthFirstSearchHelper(targetAnimations, stackT, '', targetNode.index);
      if (isPathFound) {
        const auxPath = [];
        auxPath.push(targetNode.index);
        findOptimalPath(auxPath, optimalPath, bombIndex.index, targetNode.index, closedNodes, true);
      }
    }
  }

  if (bombNode === -1) {
    const stack: NodeType[] = [];
    stack.push({
      nodeIdx: startNode.index, nodeIdxParent: 0, directionToVisit: [], directionVisited: [],
    });
    openNodes.set(startNode.index, {
      nodeIdx: startNode.index, nodeIdxParent: 0, directionToVisit: [], directionVisited: [],
    });
    depthFirstSearchHelper(targetAnimations, stack, '', targetNode.index);
    if (isPathFound) {
      const auxPath = [];
      auxPath.push(targetNode.index);
      findOptimalPath(auxPath, optimalPath, startNode.index, targetNode.index, closedNodes, true);
    }
  }

  animateBombNode(
    nodes, bombAnimations, targetAnimations, optimalPath,
    hideCover, showError, bombNode, isPathFound, isBombPathFound,
  );
};

export default depthFirstSearch;
