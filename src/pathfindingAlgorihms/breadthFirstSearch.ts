// Breadth-first search
import { getBombIndex } from '../App.Functions';
import { dataIsWallNode } from '../helperFunctions/customAttr';
import {
  finishAnimation,
  getAttr, getNodeBombInfo, getNodeStartInfo, getNodeTargetInfo,
} from '../helperFunctions/helperFunctions';
import {
  animateBombNode,
  conditionDown, conditionLeft, conditionRight, conditionUp, findOptimalPath,
} from './pathfindingAlgorithmsOptions';

interface NodeType {
  nodeIdx: number,
  nodeIdxParent: number
}

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
      };
      nodeNeighbours.push(node);
    }
  }
};

const breadthFirstSearchHelper = (
  animations: number[], queue: NodeType[], targetType: string, nodeTarget: number,
) => {
  let nodeStart: NodeType = { nodeIdx: -1, nodeIdxParent: -1 };
  if (queue.length >= 1) [nodeStart] = queue;
  closedNodes.set(nodeStart.nodeIdx, nodeStart);
  openNodes.delete(nodeStart.nodeIdx);
  queue.shift();

  if (nodeStart.nodeIdx === nodeTarget) { animations.push(nodeStart.nodeIdx); return; }
  if (nodeStart.nodeIdx === -1 && queue.length === 0 && targetType === '') { isPathFound = false; return; }
  if (nodeStart.nodeIdx === -1 && queue.length === 0 && targetType !== '') { isBombPathFound = false; return; }

  animations.push(nodeStart.nodeIdx);
  const nodeNeighbours: NodeType[] = [];

  let nodeIdx = 0;
  // neighbour up
  nodeIdx = nodeStart.nodeIdx - noOfNodesH;
  getNeighbour(
    conditionUp(nodesH[nodeStart.nodeIdx]), nodeIdx, nodeStart, nodeNeighbours,
  );

  // neighbour down
  nodeIdx = nodeStart.nodeIdx + noOfNodesH;
  getNeighbour(
    conditionDown(nodesH[nodeStart.nodeIdx]), nodeIdx, nodeStart, nodeNeighbours,
  );

  // neighbour left
  nodeIdx = nodeStart.nodeIdx - 1;
  getNeighbour(
    conditionLeft(nodesH[nodeStart.nodeIdx]), nodeIdx, nodeStart, nodeNeighbours,
  );

  // neighbour right
  nodeIdx = nodeStart.nodeIdx + 1;
  getNeighbour(
    conditionRight(nodesH[nodeStart.nodeIdx]), nodeIdx, nodeStart, nodeNeighbours,
  );

  nodeNeighbours.forEach((node: NodeType) => {
    const isNeighbourInClosed = closedNodes.has(node.nodeIdx);
    const isNeighbourInOpen = openNodes.has(node.nodeIdx);
    if (!isNeighbourInClosed && !isNeighbourInOpen) {
      openNodes.set(node.nodeIdx, node);
      queue.push(node);
    }
  });

  breadthFirstSearchHelper(animations, queue, targetType, nodeTarget);
};

const breadthFirstSearch = (
  nodes: HTMLDivElement[],
  noOfRows: number,
  noOfNodes: number,
  // eslint-disable-next-line no-unused-vars
  showCover: (arg: boolean) => void,
  hideCover: () => void,
  showError: () => void,
  finish: boolean = false,
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

  showCover(false);
  const bombIndex = getNodeBombInfo();
  const bombAnimations: number[] = [];
  const targetAnimations: number[] = [];
  const optimalPath: number[] = [];

  if (bombNode !== -1) {
    const queue: NodeType[] = [];
    queue.push({ nodeIdx: startNode.index, nodeIdxParent: 0 });
    openNodes.set(startNode.index, { nodeIdx: startNode.index, nodeIdxParent: 0 });
    breadthFirstSearchHelper(bombAnimations, queue, 'B', bombIndex.index);
    if (isBombPathFound) {
      const auxPath = [];
      auxPath.push(bombIndex.index);
      findOptimalPath(auxPath, optimalPath, startNode.index, bombIndex.index, closedNodes, true);
    }

    openNodes.clear();
    closedNodes.clear();
    // T for target
    const queueT: NodeType[] = [];
    queueT.push({ nodeIdx: bombIndex.index, nodeIdxParent: 0 });
    openNodes.set(bombIndex.index, { nodeIdx: bombIndex.index, nodeIdxParent: 0 });
    if (isBombPathFound) {
      breadthFirstSearchHelper(targetAnimations, queueT, '', targetNode.index);
      if (isPathFound) {
        const auxPath = [];
        auxPath.push(targetNode.index);
        findOptimalPath(auxPath, optimalPath, bombIndex.index, targetNode.index, closedNodes, true);
      }
    }
  }

  if (bombNode === -1) {
    const queue: NodeType[] = [];
    queue.push({ nodeIdx: startNode.index, nodeIdxParent: 0 });
    openNodes.set(startNode.index, { nodeIdx: startNode.index, nodeIdxParent: 0 });
    breadthFirstSearchHelper(targetAnimations, queue, '', targetNode.index);
    if (isPathFound) {
      const auxPath = [];
      auxPath.push(targetNode.index);
      findOptimalPath(auxPath, optimalPath, startNode.index, targetNode.index, closedNodes, true);
    }
  }

  hideCover();
  showCover(true);
  if (finish) {
    showCover(false);
    finishAnimation(nodes, bombAnimations, targetAnimations, optimalPath, noOfNodesH);
    hideCover();
    if (!isPathFound) { showError(); hideCover(); }
    if (!isBombPathFound) { showError(); hideCover(); }
    return;
  }
  animateBombNode(
    nodes, bombAnimations, targetAnimations, optimalPath,
    hideCover, showError, bombNode, isPathFound, isBombPathFound, noOfNodesH,
  );
};

export default breadthFirstSearch;
