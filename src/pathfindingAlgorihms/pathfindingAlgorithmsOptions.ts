import {
  dataIsFirstCol, dataIsFirstRow, dataIsLastCol, dataIsLastRow,
} from '../helperFunctions/customAttr';
import {
  addPathNode, addVisitedNode, finishAnimation, getAttr, getFinishButtonStatus,
} from '../helperFunctions/helperFunctions';
import { pushTimer, resetTimeouts } from '../mazesAndPatterns/mazesAndPatternsHelper';

export const algorithms = [
  'A* Search', 'Bidirectional Algorithm', 'Breadth-first Search',
  'Depth-first Search', 'Dijkstra\'s Algorithm',
];

const pathfindingAlgorithmsOptions = () => {
  const pathfindingAlgorithms = [
    { key: algorithms[0], text: algorithms[0], value: algorithms[0] },
    { key: algorithms[1], text: algorithms[1], value: algorithms[1] },
    { key: algorithms[2], text: algorithms[2], value: algorithms[2] },
    { key: algorithms[3], text: algorithms[3], value: algorithms[3] },
    { key: algorithms[4], text: algorithms[4], value: algorithms[4] },
  ];

  return pathfindingAlgorithms;
};

// eslint-disable-next-line import/no-mutable-exports
export let timer = 10;

export const setTimer = (time: number) => {
  timer = time;
};

export const size = (map: Map<any, any>) => {
  let c = 0;
  map.forEach(() => { c += 1; });
  return c;
};

const isNodeInFirstCol = (node: HTMLDivElement) => getAttr(node, dataIsFirstCol);
const isNodeInLastCol = (node: HTMLDivElement) => getAttr(node, dataIsLastCol);
const isNodeInFirstRow = (node: HTMLDivElement) => getAttr(node, dataIsFirstRow);
const isNodeInLastRow = (node: HTMLDivElement) => getAttr(node, dataIsLastRow);

export const conditionUp = (node: HTMLDivElement) => (
  (isNodeInFirstCol(node) === 'false' && isNodeInFirstRow(node) === 'false')
  || (isNodeInLastCol(node) === 'false' && isNodeInFirstRow(node) === 'false')
);

export const conditionDown = (node: HTMLDivElement) => (
  (isNodeInFirstCol(node) === 'false' && isNodeInLastRow(node) === 'false')
  || (isNodeInLastCol(node) === 'false' && isNodeInLastRow(node) === 'false')
);

export const conditionLeft = (node: HTMLDivElement) => isNodeInFirstCol(node) === 'false';

export const conditionRight = (node: HTMLDivElement) => isNodeInLastCol(node) === 'false';

export const findOptimalPath = (
  auxPath: number[],
  path: number[],
  start: number,
  target: number,
  closedNodes: Map<number, any>,
  reverseNodes: boolean,
) => {
  if (start === target) {
    if (reverseNodes) {
      for (let i = 0; i < auxPath.length; i += 1) {
        path.push(auxPath[i]);
      }
    } else {
      for (let i = auxPath.length - 1; i >= 0; i -= 1) {
        path.push(auxPath[i]);
      }
    }
    return;
  }
  const node = closedNodes.get(target);
  auxPath.unshift(node!!.nodeIdxParent);
  findOptimalPath(auxPath, path, start, node!!.nodeIdxParent, closedNodes, reverseNodes);
};

const animatePath = (
  nodes: HTMLDivElement[], animations: number[], hideCover: () => void, noOfNodesRow: number,
) => {
  for (let i = 0; i < animations.length; i += 1) {
    const timerH = window.setTimeout(() => {
      const nodeIdx = animations[i];
      if (getFinishButtonStatus()) {
        finishAnimation(nodes, null, null, animations, noOfNodesRow);
        hideCover();
      } else {
        const prevIdx = animations[i - 1];
        const nextIdx = animations[i + 1];
        addPathNode(nodes, prevIdx, nodeIdx, nextIdx, noOfNodesRow, animations);
        if (i === animations.length - 1) hideCover();
      }
    }, i * timer);
    pushTimer(timerH);
  }
};

const animateTargetNode = (
  nodes: HTMLDivElement[], animations: number[], pathAniamtions: number[],
  hideCover: () => void, showError: () => void, isPathFound: boolean, noOfNodesRow: number,
) => {
  for (let i = 0; i < animations.length; i += 1) {
    const timerH = window.setTimeout(() => {
      const nodeIdx = animations[i];
      if (getFinishButtonStatus()) {
        finishAnimation(nodes, null, animations, pathAniamtions, noOfNodesRow);
        if (!isPathFound) { showError(); hideCover(); }
        hideCover();
      } else {
        addVisitedNode(nodes[nodeIdx], 'target', nodeIdx);
        if (i === animations.length - 1 && !isPathFound) { showError(); hideCover(); }
        if (i === animations.length - 1 && isPathFound) {
          animatePath(nodes, pathAniamtions, hideCover, noOfNodesRow);
        }
      }
    }, i * timer);

    pushTimer(timerH);
  }
};

export const animateBombNode = (
  nodes: HTMLDivElement[], bombAnimations: number[], targetAnimations: number[],
  pathAnimations: number[], hideCover: () => void, showError: () => void,
  bombNode: number, isPathFound: boolean, isBombPathFound: boolean, noOfNodesRow: number,
) => {
  resetTimeouts([]);
  if (bombNode === -1) {
    animateTargetNode(
      nodes, targetAnimations, pathAnimations,
      hideCover, showError, isPathFound, noOfNodesRow,
    );
  } else {
    for (let i = 0; i < bombAnimations.length; i += 1) {
      const timerH = window.setTimeout(() => {
        const nodeIdx = bombAnimations[i];
        if (getFinishButtonStatus()) {
          finishAnimation(nodes, bombAnimations, targetAnimations, pathAnimations, noOfNodesRow);
          hideCover();
          if (!isPathFound) { showError(); hideCover(); }
          if (!isBombPathFound) { showError(); hideCover(); }
        } else {
          addVisitedNode(nodes[nodeIdx], 'BOMB', nodeIdx);
          if (i === bombAnimations.length - 1 && !isBombPathFound) { showError(); hideCover(); }
          if (i === bombAnimations.length - 1 && isBombPathFound) {
            animateTargetNode(
              nodes, targetAnimations, pathAnimations,
              hideCover, showError, isPathFound, noOfNodesRow,
            );
          }
        }
      }, i * timer);
      pushTimer(timerH);
    }
  }
};

export default pathfindingAlgorithmsOptions;
