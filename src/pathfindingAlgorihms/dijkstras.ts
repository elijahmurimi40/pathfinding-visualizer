// Dijkstra's guarantess shortest path
import { getBombIndex } from '../App.Functions';
import { dataIsWallNode } from '../helperFunctions/customAttr';
import {
  finishAnimation,
  getAttr, getNodeBombInfo, getNodeStartInfo, getNodeTargetInfo,
} from '../helperFunctions/helperFunctions';
import {
  animateBombNode,
  conditionDown, conditionLeft, conditionRight, conditionUp, findOptimalPath, size,
} from './pathfindingAlgorithmsOptions';

interface NodeType {
  gCost: number,
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
  condition: boolean, nodeIdx: number, parentCol: number, parentRow: number,
  minGCostNode: NodeType, nodeNeighbours: NodeType[],
) => {
  if (condition) {
    const isWallNode = getAttr(nodesH[nodeIdx], dataIsWallNode);
    if (isWallNode === 'false') {
      const row = Math.floor(nodeIdx / noOfNodesH);
      const col = nodeIdx % noOfNodesH;
      const gCost = Math.abs(col - parentCol) + Math.abs(row - parentRow) + minGCostNode.gCost;
      const node: NodeType = {
        gCost,
        nodeIdx,
        nodeIdxParent: minGCostNode.nodeIdx,
      };
      nodeNeighbours.push(node);
    }
  }
};

const dijkstrasHelper = (nodeTarget: number, animations: number[], targetType: string) => {
  const minGCostArr: NodeType[] = [];
  let minGCost = -1;
  openNodes.forEach((node: NodeType) => {
    if (minGCost === -1 || node.gCost < minGCost) minGCost = node.gCost;
  });
  openNodes.forEach((node: NodeType) => {
    if (node.gCost === minGCost) minGCostArr.push(node);
  });

  let minGCostNode: NodeType = {
    gCost: -1,
    nodeIdx: -1,
    nodeIdxParent: -1,
  };
  if (minGCostArr.length >= 1) [minGCostNode] = minGCostArr;
  closedNodes.set(minGCostNode.nodeIdx, minGCostNode);
  openNodes.delete(minGCostNode.nodeIdx);

  if (minGCostNode.nodeIdx === nodeTarget) { animations.push(minGCostNode.nodeIdx); return; }
  if (size(openNodes) === 0 && minGCostArr.length === 0 && targetType === '') {
    isPathFound = false;
    return;
  }
  if (size(openNodes) === 0 && minGCostArr.length === 0 && targetType !== '') {
    isBombPathFound = false;
    return;
  }

  animations.push(minGCostNode.nodeIdx);
  const nodeNeighbours: NodeType[] = [];
  const parentRow = Math.floor(minGCostNode.nodeIdx / noOfNodesH);
  const parentCol = minGCostNode.nodeIdx % noOfNodesH;

  let nodeIdx = 0;
  // neighbour up
  nodeIdx = minGCostNode.nodeIdx - noOfNodesH;
  getNeighbour(
    conditionUp(nodesH[minGCostNode.nodeIdx]), nodeIdx, parentCol,
    parentRow, minGCostNode, nodeNeighbours,
  );

  // neighbour down
  nodeIdx = minGCostNode.nodeIdx + noOfNodesH;
  getNeighbour(
    conditionDown(nodesH[minGCostNode.nodeIdx]), nodeIdx, parentCol,
    parentRow, minGCostNode, nodeNeighbours,
  );

  // neighbour left
  nodeIdx = minGCostNode.nodeIdx - 1;
  getNeighbour(
    conditionLeft(nodesH[minGCostNode.nodeIdx]), nodeIdx, parentCol,
    parentRow, minGCostNode, nodeNeighbours,
  );

  // neighbour right
  nodeIdx = minGCostNode.nodeIdx + 1;
  getNeighbour(
    conditionRight(nodesH[minGCostNode.nodeIdx]), nodeIdx, parentCol,
    parentRow, minGCostNode, nodeNeighbours,
  );

  nodeNeighbours.forEach((node: NodeType) => {
    const isNeighbourInClosed = closedNodes.has(node.nodeIdx);
    const isNeighbourInOpen = openNodes.has(node.nodeIdx);
    if (!isNeighbourInClosed) {
      if (isNeighbourInOpen && node.gCost < openNodes.get(node.nodeIdx)!!.gCost) {
        const nodeH = openNodes.get(node.nodeIdx)!!;
        nodeH.gCost = node.gCost;
        nodeH.nodeIdxParent = minGCostNode.nodeIdx;
      }

      if (!isNeighbourInOpen) {
        openNodes.set(node.nodeIdx, node);
      }
    }
  });

  dijkstrasHelper(nodeTarget, animations, targetType);
};

const dijkstras = (
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
  openNodes.clear();
  closedNodes.clear();
  startNode = getNodeStartInfo();
  targetNode = getNodeTargetInfo();
  bombNode = getBombIndex();
  isPathFound = true;
  isBombPathFound = true;

  showCover(false);
  const bombIndex = getNodeBombInfo();
  const bombAnimations: number[] = [];
  const targetAnimations: number[] = [];
  const optimalPath: number[] = [];

  openNodes.set(startNode.index, {
    gCost: 0,
    nodeIdx: startNode.index,
    nodeIdxParent: 0,
  });

  if (bombNode !== -1) {
    dijkstrasHelper(bombIndex.index, bombAnimations, 'B');
    if (isBombPathFound) {
      const auxPath = [];
      auxPath.push(bombIndex.index);
      findOptimalPath(auxPath, optimalPath, startNode.index, bombIndex.index, closedNodes, true);
    }

    openNodes.clear();
    closedNodes.clear();
    openNodes.set(bombIndex.index, {
      gCost: 0,
      nodeIdx: bombIndex.index,
      nodeIdxParent: 0,
    });

    if (isBombPathFound) {
      dijkstrasHelper(targetNode.index, targetAnimations, '');
      if (isPathFound) {
        const auxPath = [];
        auxPath.push(targetNode.index);
        findOptimalPath(auxPath, optimalPath, bombIndex.index, targetNode.index, closedNodes, true);
      }
    }
  }

  if (bombNode === -1) {
    dijkstrasHelper(targetNode.index, targetAnimations, '');
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

export default dijkstras;
