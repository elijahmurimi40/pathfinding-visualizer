// A * search is weighted and guarantees shortest path
import { getBombIndex } from '../App.Functions';
import {
  dataIsFirstCol, dataIsFirstRow, dataIsLastCol, dataIsLastRow, dataIsWallNode,
} from '../helperFunctions/customAttr';
import {
  getFinishButtonStatus, finishAnimation, addPathNode,
  addVisitedNode, getAttr, getNodeBombInfo, getNodeStartInfo, getNodeTargetInfo,
} from '../helperFunctions/helperFunctions';
import { pushTimer, resetTimeouts } from '../mazesAndPatterns/mazesAndPatternsHelper';
import { timer } from './pathfindingAlgorithmsOptions';

interface NodeType {
  gCost: number,
  hCost: number,
  fCost: number,
  nodeIdx: number,
  nodeIdxParent: number
}

const openNodes: Map<number, NodeType> = new Map();
const closedNodes: Map<number, NodeType> = new Map();
let startNode = getNodeStartInfo();
let targetNode = getNodeTargetInfo();
let bombNode = getBombIndex();
let stopLoop = false;
let isPathFound = true;
let isBombPathFound = true;
// H for helper
let nodesH: HTMLDivElement[] = [];
let noOfNodesH: number = 0;

const size = (map: Map<any, any>) => {
  let c = 0;
  map.forEach(() => { c += 1; });
  return c;
};

const animatePath = (nodes: HTMLDivElement[], animations: number[], hideCover: () => void) => {
  for (let i = 0; i < animations.length; i += 1) {
    const timerH = window.setTimeout(() => {
      const nodeIdx = animations[i];
      if (getFinishButtonStatus()) {
        finishAnimation(nodes, null, null, animations);
        hideCover();
      } else {
        addPathNode(nodes[nodeIdx], nodeIdx);
        if (i === animations.length - 1) hideCover();
      }
    }, i * timer);
    pushTimer(timerH);
  }
};

const animateTargetNode = (
  nodes: HTMLDivElement[], animations: number[], pathAniamtions: number[],
  hideCover: () => void, showError: () => void,
) => {
  for (let i = 0; i < animations.length; i += 1) {
    // eslint-disable-next-line no-loop-func
    const timerH = window.setTimeout(() => {
      const nodeIdx = animations[i];
      if (getFinishButtonStatus()) {
        finishAnimation(nodes, null, animations, pathAniamtions);
        if (!isPathFound) { showError(); hideCover(); }
        hideCover();
      } else {
        addVisitedNode(nodes[nodeIdx], 'target', nodeIdx);
        if (i === animations.length - 1 && !isPathFound) { showError(); hideCover(); }
        if (i === animations.length - 1 && isPathFound) {
          animatePath(nodes, pathAniamtions, hideCover);
        }
      }
    }, i * timer);

    pushTimer(timerH);
  }
};

const animateBombNode = (
  nodes: HTMLDivElement[], bombAnimations: number[], targetAnimations: number[],
  pathAnimations: number[], hideCover: () => void, showError: () => void,
) => {
  resetTimeouts([]);
  if (bombNode === -1) {
    animateTargetNode(nodes, targetAnimations, pathAnimations, hideCover, showError);
  } else {
    for (let i = 0; i < bombAnimations.length; i += 1) {
      // eslint-disable-next-line no-loop-func
      const timerH = window.setTimeout(() => {
        const nodeIdx = bombAnimations[i];
        if (getFinishButtonStatus()) {
          finishAnimation(nodes, bombAnimations, targetAnimations, pathAnimations);
          hideCover();
          if (!isPathFound) { showError(); hideCover(); }
          if (!isBombPathFound) { showError(); hideCover(); }
        } else {
          addVisitedNode(nodes[nodeIdx], 'BOMB', nodeIdx);
          if (i === bombAnimations.length - 1 && !isBombPathFound) { showError(); hideCover(); }
          if (i === bombAnimations.length - 1 && isBombPathFound) {
            animateTargetNode(nodes, targetAnimations, pathAnimations, hideCover, showError);
          }
        }
      }, i * timer);
      pushTimer(timerH);
    }
  }
};

const findOptimalPath = (
  auxPath: number[],
  path: number[],
  start: number,
  target: number,
) => {
  if (target === start) {
    for (let i = 0; i < auxPath.length; i += 1) {
      path.push(auxPath[i]);
    }
    return;
  }
  const node = closedNodes.get(target);
  auxPath.unshift(node!!.nodeIdxParent);
  findOptimalPath(auxPath, path, start, node!!.nodeIdxParent);
};

const getNeighbour = (
  condition: boolean, nodeIdx: number, parentCol: number, parentRow: number,
  targetCol: number, targetRow: number, minFCostNode: NodeType, nodeNeighbours: NodeType[],
) => {
  if (condition) {
    const isWallNode = getAttr(nodesH[nodeIdx], dataIsWallNode);
    if (isWallNode === 'false') {
      const row = Math.floor(nodeIdx / noOfNodesH);
      const col = nodeIdx % noOfNodesH;
      const gCost = Math.abs(col - parentCol) + Math.abs(row - parentRow) + minFCostNode.gCost;
      const hCost = Math.abs(col - targetCol) + Math.abs(row - targetRow);
      const fCost = gCost + hCost;
      const node: NodeType = {
        gCost,
        hCost,
        fCost,
        nodeIdx,
        nodeIdxParent: minFCostNode.nodeIdx,
      };
      nodeNeighbours.push(node);
    }
  }
};

const findNode = (
  nodeTarget: number, targetCol: number, targetRow: number,
  animations: number[], targetType: string,
) => {
  while (!stopLoop) {
    const minFCostArr: NodeType[] = [];
    let minFCost = -1;
    openNodes.forEach((node: NodeType) => {
      if (minFCost === -1 || node.fCost < minFCost) minFCost = node.fCost;
    });
    openNodes.forEach((node: NodeType) => {
      if (node.fCost === minFCost) minFCostArr.push(node);
    });
    let minFCostNode: NodeType = {
      gCost: -1,
      hCost: -1,
      fCost: -1,
      nodeIdx: -1,
      nodeIdxParent: -1,
    };

    if (minFCostArr.length === 1) [minFCostNode] = minFCostArr;
    if (minFCostArr.length > 1) {
      let minHCost = -1;
      minFCostArr.forEach((node: NodeType) => {
        if (minHCost === -1) { minHCost = node.hCost; minFCostNode = node; }
        if (node.hCost < minHCost) { minHCost = node.hCost; minFCostNode = node; }
      });
    }
    closedNodes.set(minFCostNode.nodeIdx, minFCostNode);
    openNodes.delete(minFCostNode.nodeIdx);

    if (minFCostNode.nodeIdx === nodeTarget) { animations.push(minFCostNode.nodeIdx); break; }
    if (size(openNodes) === 0 && minFCostArr.length === 0 && targetType === '') {
      isPathFound = false;
      break;
    }
    if (size(openNodes) === 0 && minFCostArr.length === 0 && targetType !== '') {
      isBombPathFound = false;
      break;
    }

    animations.push(minFCostNode.nodeIdx);
    const isNodeInFirstCol = getAttr(nodesH[minFCostNode.nodeIdx], dataIsFirstCol);
    const isNodeInLastCol = getAttr(nodesH[minFCostNode.nodeIdx], dataIsLastCol);
    const isNodeInFirstRow = getAttr(nodesH[minFCostNode.nodeIdx], dataIsFirstRow);
    const isNodeInLastRow = getAttr(nodesH[minFCostNode.nodeIdx], dataIsLastRow);
    const nodeNeighbours: NodeType[] = [];

    const parentRow = Math.floor(minFCostNode.nodeIdx / noOfNodesH);
    const parentCol = minFCostNode.nodeIdx % noOfNodesH;

    let condition = false;
    let nodeIdx = 0;
    // neighbour up
    condition = (isNodeInFirstCol === 'false' && isNodeInFirstRow === 'false')
    || (isNodeInLastCol === 'false' && isNodeInFirstRow === 'false');
    nodeIdx = minFCostNode.nodeIdx - noOfNodesH;
    getNeighbour(
      condition, nodeIdx, parentCol, parentRow,
      targetCol, targetRow, minFCostNode, nodeNeighbours,
    );
    // neighbour down
    condition = (isNodeInFirstCol === 'false' && isNodeInLastRow === 'false')
    || (isNodeInLastCol === 'false' && isNodeInLastRow === 'false');
    nodeIdx = minFCostNode.nodeIdx + noOfNodesH;
    getNeighbour(
      condition, nodeIdx, parentCol, parentRow,
      targetCol, targetRow, minFCostNode, nodeNeighbours,
    );
    // neighbour left
    condition = isNodeInFirstCol === 'false';
    nodeIdx = minFCostNode.nodeIdx - 1;
    getNeighbour(
      condition, nodeIdx, parentCol, parentRow,
      targetCol, targetRow, minFCostNode, nodeNeighbours,
    );
    // neighbour right
    condition = isNodeInLastCol === 'false';
    nodeIdx = minFCostNode.nodeIdx + 1;
    getNeighbour(
      condition, nodeIdx, parentCol, parentRow,
      targetCol, targetRow, minFCostNode, nodeNeighbours,
    );
    // neighbour top left
    // condition = isNodeInFirstCol === 'false' && isNodeInFirstRow === 'false';
    // nodeIdx = minFCostNode.nodeIdx - noOfNodes - 1;
    // getNeighbour(
    //   condition, nodeIdx, parentCol, parentRow,
    //   targetCol, targetRow, minFCostNode, nodeNeighbours,
    // );
    // // neighbour top right
    // condition = isNodeInLastCol === 'false' && isNodeInFirstRow === 'false';
    // nodeIdx = minFCostNode.nodeIdx - noOfNodes + 1;
    // getNeighbour(
    //   condition, nodeIdx, parentCol, parentRow,
    //   targetCol, targetRow, minFCostNode, nodeNeighbours,
    // );
    // // neighbour bottom left
    // condition = isNodeInFirstCol === 'false' && isNodeInLastRow === 'false';
    // nodeIdx = minFCostNode.nodeIdx + noOfNodes - 1;
    // getNeighbour(
    //   condition, nodeIdx, parentCol, parentRow,
    //   targetCol, targetRow, minFCostNode, nodeNeighbours,
    // );
    // // neighbour bottom right
    // condition = isNodeInLastCol === 'false' && isNodeInLastRow === 'false';
    // nodeIdx = minFCostNode.nodeIdx + noOfNodes + 1;
    // getNeighbour(
    //   condition, nodeIdx, parentCol, parentRow,
    //   targetCol, targetRow, minFCostNode, nodeNeighbours,
    // );

    nodeNeighbours.forEach((node: NodeType) => {
      const isNeighbourInClosed = closedNodes.has(node.nodeIdx);
      const isNeighbourInOpen = openNodes.has(node.nodeIdx);
      if (!isNeighbourInClosed) {
        if (isNeighbourInOpen && node.fCost < openNodes.get(node.nodeIdx)!!.fCost) {
          const nodeH = openNodes.get(node.nodeIdx)!!;
          nodeH.gCost = node.gCost;
          nodeH.hCost = node.hCost;
          nodeH.fCost = node.fCost;
          nodeH.nodeIdxParent = minFCostNode.nodeIdx;
        }

        if (!isNeighbourInOpen) {
          openNodes.set(node.nodeIdx, node);
        }
      }
    });
  }
};

const aStar = (
  nodes: HTMLDivElement[],
  noOfRows: number,
  noOfNodes: number,
  // eslint-disable-next-line no-unused-vars
  showCover: (arg: boolean) => void,
  hideCover: () => void,
  showError: () => void,
) => {
  nodesH = nodes;
  noOfNodesH = noOfNodes;
  openNodes.clear();
  closedNodes.clear();
  startNode = getNodeStartInfo();
  targetNode = getNodeTargetInfo();
  bombNode = getBombIndex();
  stopLoop = false;
  isPathFound = true;
  isBombPathFound = true;

  showCover(false);
  const bombIndex = getNodeBombInfo();
  const bombRow = Math.floor(bombIndex.index / noOfNodes);
  const bombCol = bombIndex.index % noOfNodes;
  const targetRow = Math.floor(targetNode.index / noOfNodes);
  const targetCol = targetNode.index % noOfNodes;

  const bombAnimations: number[] = [];
  const targetAnimations: number[] = [];

  openNodes.set(startNode.index, {
    gCost: 0,
    hCost: 0,
    fCost: 0,
    nodeIdx: startNode.index,
    nodeIdxParent: 0,
  });

  const optimalPath: number[] = [];
  if (bombNode !== -1) {
    bombAnimations.push(startNode.index);
    findNode(bombIndex.index, bombCol, bombRow, bombAnimations, 'B');
    if (isBombPathFound) {
      const auxPath = [];
      auxPath.push(bombIndex.index);
      findOptimalPath(auxPath, optimalPath, startNode.index, bombIndex.index);
    }

    openNodes.clear();
    closedNodes.clear();
    openNodes.set(bombIndex.index, {
      gCost: 0,
      hCost: 0,
      fCost: 0,
      nodeIdx: bombIndex.index,
      nodeIdxParent: 0,
    });

    if (isBombPathFound) {
      targetAnimations.push(bombIndex.index);
      findNode(targetNode.index, targetCol, targetRow, targetAnimations, '');
      if (isPathFound) {
        const auxPath = [];
        auxPath.push(targetNode.index);
        findOptimalPath(auxPath, optimalPath, bombIndex.index, targetNode.index);
      }
    }
  }

  if (bombNode === -1) {
    targetAnimations.push(startNode.index);
    findNode(targetNode.index, targetCol, targetRow, targetAnimations, '');
    if (isPathFound) {
      const auxPath = [];
      auxPath.push(targetNode.index);
      findOptimalPath(auxPath, optimalPath, startNode.index, targetNode.index);
    }
  }

  hideCover();
  showCover(true);
  animateBombNode(nodes, bombAnimations, targetAnimations, optimalPath, hideCover, showError);
};

export default aStar;
