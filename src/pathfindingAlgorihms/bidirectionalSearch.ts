// Bidirectional guarantees shortest path
import { dataIsWallNode } from '../helperFunctions/customAttr';
import {
  addPathNode, addVisitedNode, finishAnimation, getAttr,
  getFinishButtonStatus, getNodeStartInfo, getNodeTargetInfo,
} from '../helperFunctions/helperFunctions';
import { pushTimer, resetTimeouts } from '../mazesAndPatterns/mazesAndPatternsHelper';
import {
  conditionDown, conditionLeft, conditionRight, conditionUp, findOptimalPath, size, timer,
} from './pathfindingAlgorithmsOptions';

const openNodesStart: Map<number, NodeType> = new Map();
const openNodesTarget: Map<number, NodeType> = new Map();
const closedNodesStart: Map<number, NodeType> = new Map();
const closedNodesTarget: Map<number, NodeType> = new Map();
let isPathFound = true;
let startNode = getNodeStartInfo();
let targetNode = getNodeTargetInfo();
let targetRowOfStartNode = 0;
let targetColOfStartNode = 0;
let targetRowOfTargetNode = 0;
let targetColOfTargetNode = 0;
// H for helper
let nodesH: HTMLDivElement[] = [];
let noOfNodesH: number = 0;
let meetingPoint = -1;

interface NodeType {
  hCost: number,
  nodeIdx: number,
  nodeIdxParent: number
}

const animatePath = (optimalPath: number[], nodes: HTMLDivElement[], hideCover: () => void) => {
  if (isPathFound) {
    resetTimeouts([]);
    const noOfNodesRow = noOfNodesH;
    for (let i = 0; i < optimalPath.length; i += 1) {
      const timerH = window.setTimeout(() => {
        const nodeIdx = optimalPath[i];
        if (getFinishButtonStatus()) {
          finishAnimation(nodes, null, null, optimalPath, noOfNodesRow);
          hideCover();
        } else {
          const prevIdx = optimalPath[i - 1];
          const nextIdx = optimalPath[i + 1];
          addPathNode(nodes, prevIdx, nodeIdx, nextIdx, noOfNodesRow, optimalPath);
          if (i === optimalPath.length - 1) hideCover();
        }
      }, i * timer);
      pushTimer(timerH);
    }
  }
};

const getMinimumHCostArr = (openNodes: Map<number, NodeType>, minHCostArr: NodeType[]) => {
  let minFCost = -1;
  openNodes.forEach((node: NodeType) => {
    if (minFCost === -1 || node.hCost < minFCost) minFCost = node.hCost;
  });
  openNodes.forEach((node: NodeType) => {
    if (node.hCost === minFCost) minHCostArr.push(node);
  });
};

const getMinimumHCost = (minHCostArr: NodeType[]): NodeType => {
  let minHCostNode: NodeType = {
    hCost: -1,
    nodeIdx: -1,
    nodeIdxParent: -1,
  };
  if (minHCostArr.length >= 1) [minHCostNode] = minHCostArr;

  return minHCostNode;
};

const getNodeNeighbour = (
  condition: boolean, nodeIdx: number, targetCol: number,
  targetRow: number, minHCostNode: NodeType, nodeNeighbours: NodeType[],
) => {
  if (condition) {
    const isWallNode = getAttr(nodesH[nodeIdx], dataIsWallNode);
    if (isWallNode === 'false') {
      const row = Math.floor(nodeIdx / noOfNodesH);
      const col = nodeIdx % noOfNodesH;
      const hCost = Math.abs(col - targetCol) + Math.abs(row - targetRow);
      const node: NodeType = {
        hCost,
        nodeIdx,
        nodeIdxParent: minHCostNode.nodeIdx,
      };
      nodeNeighbours.push(node);
    }
  }
};

const getNeighbour = (
  animations: number[], minHCostNode: NodeType, targetCol: number, targetRow: number,
  closedNodes: Map<number, NodeType>, openNodes: Map<number, NodeType>,
) => {
  animations.push(minHCostNode.nodeIdx);
  const nodeNeighbours: NodeType[] = [];

  let nodeIdx = 0;

  // neighbour up
  nodeIdx = minHCostNode.nodeIdx - noOfNodesH;
  getNodeNeighbour(
    conditionUp(nodesH[minHCostNode.nodeIdx]), nodeIdx,
    targetCol, targetRow, minHCostNode, nodeNeighbours,
  );

  // neighbour down
  nodeIdx = minHCostNode.nodeIdx + noOfNodesH;
  getNodeNeighbour(
    conditionDown(nodesH[minHCostNode.nodeIdx]), nodeIdx,
    targetCol, targetRow, minHCostNode, nodeNeighbours,
  );

  // neighbour left
  nodeIdx = minHCostNode.nodeIdx - 1;
  getNodeNeighbour(
    conditionLeft(nodesH[minHCostNode.nodeIdx]), nodeIdx,
    targetCol, targetRow, minHCostNode, nodeNeighbours,
  );

  // neighbour right
  nodeIdx = minHCostNode.nodeIdx + 1;
  getNodeNeighbour(
    conditionRight(nodesH[minHCostNode.nodeIdx]), nodeIdx,
    targetCol, targetRow, minHCostNode, nodeNeighbours,
  );

  nodeNeighbours.forEach((node: NodeType) => {
    const isNeighbourInClosed = closedNodes.has(node.nodeIdx);
    const isNeighbourInOpen = openNodes.has(node.nodeIdx);
    if (!isNeighbourInClosed) {
      if (!isNeighbourInOpen) {
        openNodes.set(node.nodeIdx, node);
      }
    }
  });
};

const bidirectionalSearchHelper = (animations: number[]) => {
  const minHCostStartArr: NodeType[] = [];
  const minHCostTargetArr: NodeType[] = [];
  getMinimumHCostArr(openNodesStart, minHCostStartArr);
  getMinimumHCostArr(openNodesTarget, minHCostTargetArr);

  const minHCostNodeStart = getMinimumHCost(minHCostStartArr);
  const minHCostNodeTarget = getMinimumHCost(minHCostTargetArr);

  closedNodesStart.set(minHCostNodeStart.nodeIdx, minHCostNodeStart);
  closedNodesTarget.set(minHCostNodeTarget.nodeIdx, minHCostNodeTarget);
  openNodesStart.delete(minHCostNodeStart.nodeIdx);
  openNodesTarget.delete(minHCostNodeTarget.nodeIdx);

  const isInStartClosed = closedNodesStart.has(minHCostNodeTarget.nodeIdx);
  const isInTargetClosed = closedNodesTarget.has(minHCostNodeStart.nodeIdx);

  if (isInStartClosed) {
    animations.push(minHCostNodeTarget.nodeIdx);
    meetingPoint = minHCostNodeTarget.nodeIdx;
    return;
  }
  if (isInTargetClosed) {
    animations.push(minHCostNodeStart.nodeIdx);
    meetingPoint = minHCostNodeStart.nodeIdx;
    return;
  }

  if (
    (size(openNodesStart) === 0 && minHCostStartArr.length === 0)
    || (size(openNodesTarget) === 0 && minHCostTargetArr.length === 0)
  ) { isPathFound = false; return; }

  if (minHCostNodeStart.hCost !== -1) {
    getNeighbour(
      animations, minHCostNodeStart, targetColOfStartNode, targetRowOfStartNode,
      closedNodesStart, openNodesStart,
    );
  }

  if (minHCostNodeTarget.hCost !== -1) {
    getNeighbour(
      animations, minHCostNodeTarget, targetColOfTargetNode, targetRowOfTargetNode,
      closedNodesTarget, openNodesTarget,
    );
  }

  bidirectionalSearchHelper(animations);
};

const bidirectionalSearch = (
  nodes: HTMLDivElement[],
  noOfRows: number,
  noOfNodes: number,
  // eslint-disable-next-line no-unused-vars
  showCover: (arg: boolean) => void,
  hideCover: () => void,
  showError: () => void,
  finish: boolean = false,
) => {
  openNodesStart.clear();
  openNodesTarget.clear();
  closedNodesStart.clear();
  closedNodesTarget.clear();
  startNode = getNodeStartInfo();
  targetNode = getNodeTargetInfo();
  isPathFound = true;
  nodesH = nodes;
  noOfNodesH = noOfNodes;
  meetingPoint = -1;

  showCover(false);
  targetRowOfStartNode = Math.floor(targetNode.index / noOfNodes);
  targetColOfStartNode = targetNode.index % noOfNodes;
  targetRowOfTargetNode = Math.floor(startNode.index / noOfNodes);
  targetColOfTargetNode = startNode.index % noOfNodes;

  openNodesStart.set(startNode.index, {
    hCost: 0,
    nodeIdx: startNode.index,
    nodeIdxParent: 0,
  });
  openNodesTarget.set(targetNode.index, {
    hCost: 0,
    nodeIdx: targetNode.index,
    nodeIdxParent: 0,
  });

  const animations: number[] = [];
  bidirectionalSearchHelper(animations);

  const optimalPath: number[] = [];
  if (isPathFound) {
    findOptimalPath([], optimalPath, startNode.index, meetingPoint, closedNodesStart, true);
    optimalPath.push(meetingPoint);
    findOptimalPath([], optimalPath, targetNode.index, meetingPoint, closedNodesTarget, false);
  }

  hideCover();
  showCover(true);
  if (finish) {
    showCover(false);
    finishAnimation(nodes, null, animations, optimalPath, noOfNodesH);
    hideCover();
    if (!isPathFound) { showError(); hideCover(); }
    return;
  }
  resetTimeouts([]);
  for (let i = 0; i < animations.length; i += 1) {
    // eslint-disable-next-line no-loop-func
    const timerH = window.setTimeout(() => {
      const nodeIdx = animations[i];
      if (getFinishButtonStatus()) {
        finishAnimation(nodes, null, animations, optimalPath, noOfNodesH);
        hideCover();
        if (!isPathFound) { showError(); hideCover(); }
      } else {
        addVisitedNode(nodes[nodeIdx], '', nodeIdx);
        if (i === animations.length - 1 && !isPathFound) { showError(); hideCover(); }
        if (i === animations.length - 1) animatePath(optimalPath, nodes, hideCover);
      }
    }, i * timer);
    pushTimer(timerH);
  }
};

export default bidirectionalSearch;
