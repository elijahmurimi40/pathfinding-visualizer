import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
// import { TweenLite } from 'gsap/all';
import { NodeInfoType } from './types';
import {
  dataIsStartNode, dataIsTargetNode, dataIsWallNode, dataIsBombNode, dataIdx, dataIsFirstCol,
  dataIsLastCol, dataIsFirstRow, dataIsLastRow, dataIsGapNode, dataIsArrowNode, dataIsPathNode,
} from './customAttr';
import {
  shortestPathNodeColor, transparent, visitedNodeColor, visitedNodeColorToBomb, wallNodeColor,
} from './color';
import { clearTimeouts } from '../mazesAndPatterns/mazesAndPatternsHelper';
import { getBombIndex } from '../App.Functions';

gsap.registerPlugin(Draggable);

let initialIndex = 0;
let isDarkMode = false;
let prevIndex = 0;
let isStartTargetPinNode = false;

let nodeInfoStart: NodeInfoType = {
  index: -1,
  isWallNode: 'false',
  x: 0,
  y: 0,
};

let nodeInfoTarget: NodeInfoType = {
  index: -1,
  isWallNode: 'false',
  x: 0,
  y: 0,
};

let nodeInfoBomb: NodeInfoType = {
  index: -1,
  isWallNode: 'false',
  x: 0,
  y: 0,
};

let nodeInfo: NodeInfoType = {
  index: -1,
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
const calculateNodeNewIndex = (params: number[], type: string = '') => {
  const initialRow = Math.floor(params[0] / params[1]) * params[1];
  const row = ((params[3] / 25) * params[1]) + initialRow;
  const column = (params[2] / 25) + (params[0] % params[1]);
  if (type === 'prevIndex') return row + column;
  nodeInfo.index = row + column;
  return 0;
};

// to know if a search algorith was used
let isSearchAlgoUsed = false;
export const setIsSearchAlgoUsed = (isUsed: boolean) => {
  isSearchAlgoUsed = isUsed;
};

// function to finish animation when finish button is pressed
export const finishAnimation = (
  nodes: HTMLDivElement[], bombAnimations: number[] | null,
  targetAnimations: number[] | null, pathAniamtions: number[] | null,
  noOfNodesRow: number,
) => {
  clearTimeouts();
  setFinishButtonStatus(false);

  pathNodes.forEach((idx: number) => {
    const node = nodes[idx];
    const isStartNode = getAttr(node, dataIsStartNode);
    const isTargetNode = getAttr(node, dataIsTargetNode);
    const isBombNode = getAttr(node, dataIsBombNode);

    setAttr(node, dataIsPathNode, 'false');
    setAttr(node, dataIsArrowNode, 'false');
    isStartTargetPinNode = false;

    if (isStartNode === 'false' && isTargetNode === 'false' && isBombNode === 'false') {
      const shuldren = node.children;
      if (shuldren.length > 0) {
        for (let i = 0; i < shuldren.length; i += 1) {
          const shald = shuldren[i];
          shald.remove();
        }
      }
    }
  });

  if (bombAnimations != null) {
    for (let i = 0; i < bombAnimations.length; i += 1) {
      const nodeIdx = bombAnimations[i];
      addVisitedNode(nodes[nodeIdx], 'BOMB', nodeIdx);
    }
  }

  if (targetAnimations != null) {
    for (let i = 0; i < targetAnimations.length; i += 1) {
      const nodeIdx = targetAnimations[i];
      addVisitedNode(nodes[nodeIdx], 'target', nodeIdx);
    }
  }

  if (pathAniamtions != null) {
    for (let i = 0; i < pathAniamtions.length; i += 1) {
      const nodeIdx = pathAniamtions[i];
      const prevIdx = pathAniamtions[i - 1];
      const nextIdx = pathAniamtions[i + 1];
      addPathNode(nodes, prevIdx, nodeIdx, nextIdx, noOfNodesRow, pathAniamtions);
    }
  }
};

// finish button has been pressed
let finishButtonPressed = false;
export const getFinishButtonStatus = () => finishButtonPressed;
export const setFinishButtonStatus = (status: boolean) => { finishButtonPressed = status; };

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
      return node.getAttribute(attr);
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
      node.setAttribute(attr, value);
  }
};

// #######################################################
let execute = true;
let repeatedPathNodes: number[] = [];

export const resetRepeatedPathNodes = () => {
  execute = true;
  repeatedPathNodes.length = 0;
  repeatedPathNodes = [];
};

const checkIndexOfPathnode = (animations: number[]) => {
  for (let i = 0; i < animations.length; i += 1) {
    const nodeIdx = animations[i];
    const pathNode = animations.indexOf(nodeIdx, i + 1);
    if (pathNode !== -1) {
      repeatedPathNodes.push(nodeIdx);
    }
  }
};

const isIndexInPathNode = (idx: number): boolean => {
  const pathNode = repeatedPathNodes.indexOf(idx);

  if (pathNode === -1) return false;
  return true;
};

const addReturnArrow = (node: HTMLDivElement, direction: string) => {
  const shuldren = node.children;
  const div1 = shuldren[0];
  const div2 = shuldren[1] as HTMLDivElement;
  const firstIcon = div1.children[0];
  const secocondIcon = div2.children[0] as HTMLElement;

  const classNames1 = firstIcon.classList;
  const classNames2 = secocondIcon.classList[0];
  const right = classNames1.contains('right');
  const left = classNames1.contains('left');
  const up = classNames1.contains('up');
  const down = classNames1.contains('down');

  secocondIcon.classList.remove(classNames2);
  // secocondIcon.style.color = '#000';
  div2.style.backgroundColor = shortestPathNodeColor;

  if (right || left) {
    if (direction === 'right') {
      secocondIcon.classList.add('long', 'arrow', 'alternate', 'right', 'large', 'icon', 'ico-lr');
    }

    if (direction === 'left') {
      secocondIcon.classList.add('long', 'arrow', 'alternate', 'left', 'large', 'icon', 'ico-lr');
    }

    if (direction === 'up') {
      secocondIcon.classList.add('caret', 'big', 'up', 'icon', 'ico-lru');
    }

    if (direction === 'down') {
      secocondIcon.classList.add('caret', 'big', 'down', 'icon', 'ico-lrd');
    }

    return;
  }

  if (up || down) {
    if (direction === 'right') {
      secocondIcon.classList.add('caret', 'big', 'right', 'icon', 'ico-udr');
    }

    if (direction === 'left') {
      secocondIcon.classList.add('caret', 'big', 'left', 'icon', 'ico-udl');
    }

    if (direction === 'up') {
      secocondIcon.classList.add('long', 'arrow', 'alternate', 'up', 'large', 'icon', 'ico-ud');
    }

    if (direction === 'down') {
      secocondIcon.classList.add('long', 'arrow', 'alternate', 'down', 'large', 'icon', 'ico-ud');
    }
  }
};
// #######################################################

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
export const addPathNode = (
  nodes: HTMLDivElement[], prevIdx: number, idx: number, nextIdx: number, noOfNodesRow: number,
  animations: number[],
) => {
  if (execute) {
    execute = false;
    checkIndexOfPathnode(animations);
  }
  pathNodes.push(idx);
  const nodeH = nodes[idx];
  const isStartNode = getAttr(nodeH, dataIsStartNode);
  const isTargetNode = getAttr(nodeH, dataIsTargetNode);
  const isBombNode = getAttr(nodeH, dataIsBombNode);
  const isArrowNode = getAttr(nodeH, dataIsArrowNode);
  const isPathNode = getAttr(nodeH, dataIsPathNode);
  // nodeH.classList.remove('pf-grid-node-border-color');
  // nodeH.style.backgroundColor = shortestPathNodeColor;

  if (isStartNode === 'true' || isTargetNode === 'true' || isBombNode === 'true') {
    const child = nodeH.children[0] as HTMLElement;
    child.style.color = '#ff1493';
    if (isPathNode === 'false') {
      isStartTargetPinNode = true;
    }
    setAttr(nodeH, dataIsPathNode, 'true');
    nodeH.style.backgroundColor = shortestPathNodeColor;
    return;
  }

  setAttr(nodeH, dataIsPathNode, 'true');
  setAttr(nodeH, dataIsArrowNode, 'true');

  if (isArrowNode === 'true') {
    isStartTargetPinNode = false;
  }

  drawArrows(nodes, nodeH, prevIdx, idx, nextIdx, noOfNodesRow);
};

const drawStartArrow = (element: HTMLElement) => {
  const bombNodeIdx = getBombIndex();
  if (bombNodeIdx !== -1) {
    return;
  }
  const elementH = element;
  elementH.style.color = '#ff1493';
  isStartTargetPinNode = false;
};

// show directional arrows.
let changeColorToBlack = false;
const drawArrows = (
  nodes: HTMLDivElement[], nodeH: HTMLDivElement, prevIdx: number, idx: number,
  nextIdx: number, noOfNodesRow: number,
) => {
  const arrow = document.createElement('i');
  const isTargetNode = getAttr(nodes[nextIdx], dataIsTargetNode);
  const isBombNode = getAttr(nodes[nextIdx], dataIsBombNode);
  let drawWall = true;

  const shuldren = nodeH.children;
  const div1 = document.createElement('div');
  const div2 = document.createElement('div');
  const arrow1 = document.createElement('i');
  const arrow2 = document.createElement('i');

  if (isStartTargetPinNode || isTargetNode === 'true' || isBombNode === 'true') {
    drawStartArrow(arrow);
  }

  if (getBombIndex() !== -1 && !changeColorToBlack) {
    arrow.style.color = '#ff1493';
    arrow1.style.color = '#ff1493';
    // arrow2.style.color = '#ff1493';
  }

  if (isBombNode === 'true') {
    changeColorToBlack = true;
  }

  if (isTargetNode === 'true') {
    changeColorToBlack = false;
  }

  const isIndexAvailable = isIndexInPathNode(idx);
  const up = 'up';
  const down = 'down';
  const left = 'left';
  const right = 'right';
  let direction = '';
  // ######## start of clockwise direction ########
  // up to right
  if (prevIdx - idx === noOfNodesRow && nextIdx - idx === 1) {
    if (isIndexAvailable) {
      direction = right;
    } else {
      arrow.classList.add('share', 'icon');
      arrow.style.marginLeft = '8px';
      arrow.style.marginTop = '3px';
      nodeH.appendChild(arrow);

      const node = nodeH;
      if (drawWall) node.style.backgroundColor = shortestPathNodeColor;
      return;
    }
  }

  // right to down
  if (nextIdx - idx === noOfNodesRow && idx - prevIdx === 1) {
    if (isIndexAvailable) {
      direction = down;
    } else {
      arrow.classList.add('share', 'clockwise', 'rotated', 'icon');
      arrow.style.marginLeft = '6px';
      arrow.style.marginTop = '9px';
      nodeH.appendChild(arrow);

      const node = nodeH;
      if (drawWall) node.style.backgroundColor = shortestPathNodeColor;
      return;
    }
  }

  // down to left
  if (idx - prevIdx === noOfNodesRow && idx - nextIdx === 1) {
    if (isIndexAvailable) {
      direction = left;
    } else {
      arrow.classList.add('reply', 'vertically', 'flipped', 'icon');
      arrow.style.marginRight = '5px';
      arrow.style.marginTop = '7px';
      nodeH.appendChild(arrow);

      const node = nodeH;
      if (drawWall) node.style.backgroundColor = shortestPathNodeColor;
      return;
    }
  }

  // left to up
  if (idx - nextIdx === noOfNodesRow && prevIdx - idx === 1) {
    if (isIndexAvailable) {
      direction = up;
    } else {
      arrow.classList.add('share', 'counterclockwise', 'rotated', 'icon');
      arrow.style.marginLeft = '2px';
      arrow.style.marginTop = '2px';
      nodeH.appendChild(arrow);

      const node = nodeH;
      if (drawWall) node.style.backgroundColor = shortestPathNodeColor;
      return;
    }
  }
  // ######## end of clockwise direction ########

  // ######## start of counter clockwise direction ########
  // left to down
  if (nextIdx - idx === noOfNodesRow && prevIdx - idx === 1) {
    if (isIndexAvailable) {
      direction = down;
    } else {
      arrow.classList.add('reply', 'counterclockwise', 'rotated', 'icon');
      arrow.style.marginLeft = '2px';
      arrow.style.marginTop = '9px';
      nodeH.appendChild(arrow);

      const node = nodeH;
      if (drawWall) node.style.backgroundColor = shortestPathNodeColor;
      return;
    }
  }

  // down to right
  if (idx - prevIdx === noOfNodesRow && nextIdx - idx === 1) {
    if (isIndexAvailable) {
      direction = right;
    } else {
      arrow.classList.add('share', 'vertically', 'flipped', 'icon');
      arrow.style.marginLeft = '8px';
      arrow.style.marginTop = '7px';
      nodeH.appendChild(arrow);

      const node = nodeH;
      if (drawWall) node.style.backgroundColor = shortestPathNodeColor;
      return;
    }
  }

  // right to up
  if (idx - nextIdx === noOfNodesRow && idx - prevIdx === 1) {
    if (isIndexAvailable) {
      direction = up;
    } else {
      arrow.classList.add('reply', 'clockwise', 'rotated', 'icon');
      arrow.style.marginLeft = '7px';
      arrow.style.marginTop = '1px';
      nodeH.appendChild(arrow);

      const node = nodeH;
      if (drawWall) node.style.backgroundColor = shortestPathNodeColor;
      return;
    }
  }

  // up to left
  if (prevIdx - idx === noOfNodesRow && idx - nextIdx === 1) {
    if (isIndexAvailable) {
      direction = left;
    } else {
      arrow.classList.add('reply', 'icon');
      arrow.style.marginRight = '2px';
      arrow.style.marginTop = '2px';
      nodeH.appendChild(arrow);

      const node = nodeH;
      if (drawWall) node.style.backgroundColor = shortestPathNodeColor;
      return;
    }
  }
  // ######## end of counter clockwise direction ########

  // going right
  if (idx - prevIdx === 1 || direction === right) {
    if (isIndexAvailable && shuldren.length === 0) {
      div1.classList.add('width');
      div2.classList.add('width');
      arrow1.classList.add('long', 'arrow', 'alternate', 'right', 'large', 'icon', 'ico-lr');
      arrow2.classList.add('ico-lr');
      div1.appendChild(arrow1);
      div2.appendChild(arrow2);
      nodeH.appendChild(div1);
      nodeH.appendChild(div2);
      div1.style.backgroundColor = shortestPathNodeColor;
      drawWall = false;
      return;
    }

    if (shuldren.length > 0) {
      addReturnArrow(nodeH, right);
      drawWall = false;
      return;
    }

    arrow.classList.add('long', 'arrow', 'alternate', 'right', 'large', 'icon');
    nodeH.appendChild(arrow);

    const node = nodeH;
    if (drawWall) node.style.backgroundColor = shortestPathNodeColor;
    return;
  }

  // going left
  if (prevIdx - idx === 1 || direction === left) {
    if (isIndexAvailable && shuldren.length === 0) {
      div1.classList.add('width');
      div2.classList.add('width');
      arrow1.classList.add('long', 'arrow', 'alternate', 'left', 'large', 'icon', 'ico-lr');
      arrow2.classList.add('ico-lr');
      div1.appendChild(arrow1);
      div2.appendChild(arrow2);
      nodeH.appendChild(div1);
      nodeH.appendChild(div2);
      div1.style.backgroundColor = shortestPathNodeColor;
      drawWall = false;
      return;
    }

    if (shuldren.length > 0) {
      addReturnArrow(nodeH, left);
      drawWall = false;
      return;
    }

    arrow.classList.add('long', 'arrow', 'alternate', 'left', 'large', 'icon');
    nodeH.appendChild(arrow);

    const node = nodeH;
    if (drawWall) node.style.backgroundColor = shortestPathNodeColor;
    return;
  }

  // going up
  if (idx - nextIdx === noOfNodesRow || direction === up) {
    if (isIndexAvailable && shuldren.length === 0) {
      div1.classList.add('height');
      div2.classList.add('height');
      arrow1.classList.add('long', 'arrow', 'alternate', 'up', 'large', 'icon', 'ico-ud');
      arrow2.classList.add('ico-ud');
      div1.appendChild(arrow1);
      div2.appendChild(arrow2);
      nodeH.appendChild(div1);
      nodeH.appendChild(div2);
      drawWall = false;
      div1.style.backgroundColor = shortestPathNodeColor;
      return;
    }

    if (shuldren.length > 0) {
      addReturnArrow(nodeH, up);
      drawWall = false;
      return;
    }

    arrow.classList.add('long', 'arrow', 'alternate', 'up', 'large', 'icon');
    nodeH.appendChild(arrow);

    const node = nodeH;
    if (drawWall) node.style.backgroundColor = shortestPathNodeColor;
    return;
  }

  // going down
  if (nextIdx - idx === noOfNodesRow || direction === down) {
    if (isIndexAvailable && shuldren.length === 0) {
      div1.classList.add('height');
      div2.classList.add('height');
      arrow1.classList.add('long', 'arrow', 'alternate', 'down', 'large', 'icon', 'ico-ud');
      arrow2.classList.add('ico-ud');
      div1.appendChild(arrow1);
      div2.appendChild(arrow2);
      nodeH.appendChild(div1);
      nodeH.appendChild(div2);
      drawWall = false;
      div1.style.backgroundColor = shortestPathNodeColor;
      return;
    }

    if (shuldren.length > 0) {
      addReturnArrow(nodeH, down);
      drawWall = false;
      return;
    }

    arrow.classList.add('long', 'arrow', 'alternate', 'down', 'large', 'icon');
    nodeH.appendChild(arrow);

    const node = nodeH;
    if (drawWall) node.style.backgroundColor = shortestPathNodeColor;
  }
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
    // nodeH.classList.add('pf-grid-node-border-color');
  } else {
    wallNodes.push(idx);
    nodeH.style.backgroundColor = wallNodeColor;
    setAttr(nodeH, dataIsWallNode, 'true');
    // nodeH.classList.remove('pf-grid-node-border-color');
  }
};

// make elements draggalbe start, target and bomb node
export const createDraggble = (
  className: string,
  nodeIndex: number,
  noOfNodes: number,
  nodes: HTMLDivElement[] | null,
  // eslint-disable-next-line no-unused-vars
  visualize: (finish: boolean) => void,
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
      initialIndex = nodeInfo.index === -1 ? nodeIndex : nodeInfo.index;
    },
    onDrag() {
      if (nodes === null) return;
      if (nodeInfo.isWallNode === 'true') {
        addRemoveWallNode(nodes[nodeInfo.index], nodeInfo.index);
      }
      prevIndex = nodeInfo.index;
      calculateNodeNewIndex([initialIndex, noOfNodes, this.x, this.y]);

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
        prevIndex = nodeInfo.index;
      }

      // dragging tagetNode
      if (className === targetNode && isStartNode === 'false' && isBombNode === 'false') {
        nodeInfo.x = this.x;
        nodeInfo.y = this.y;
        prevIndex = nodeInfo.index;
      }

      // dragging bombNode
      if (className === bombNode && isStartNode === 'false' && isTargetNode === 'false') {
        nodeInfo.x = this.x;
        nodeInfo.y = this.y;
        prevIndex = nodeInfo.index;
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
        // calculateNodeNewIndex([nodeInfo.index, noOfNodes, nodeInfo.x, nodeInfo.y]);
        const isWallNode = getAttr(nodes[prevIndex], dataIsWallNode);
        nodeInfo.isWallNode = isWallNode;
        nodeInfo.index = prevIndex;
        if (isWallNode === 'true') {
          addRemoveWallNode(nodes[prevIndex], nodeInfo.index);
        }

        // TweenLite.to(`.${className}`, { x: nodeInfo.x, y: nodeInfo.y });
        // gsap.to(`.${className}`, { x: nodeInfo.x, y: nodeInfo.y });
      }

      const isArrowNode = getAttr(nodes[nodeInfo.index], dataIsArrowNode);
      if (isArrowNode === 'true') {
        const node = nodes[nodeInfo.index];
        setAttr(node, dataIsArrowNode, 'false');
        const childrenCollections = node.children;
        const len = childrenCollections.length;

        for (let i = 0; i < len; i += 1) {
          const shald = childrenCollections[0];
          shald.remove();
        }
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

      gsap.set(`.${className}`, { x: 0, y: 0 });
      nodes[nodeInfo.index].appendChild(this.target);

      if (isSearchAlgoUsed) {
        visualize(true);
      }
    },
  });
};
