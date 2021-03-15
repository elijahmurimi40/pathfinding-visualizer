import { useEffect, useRef, useState } from 'react';
import TopNav from './components/TopNav';
import BottomNav from './components/BottomNav';
import { OpenSideNav, SideNav } from './components/SideNav';
import MazesPatternSwitchButton from './components/MazesPatternSwitchButton';
import PathFindingGrid from './components/PathFindingGrid';
import { NodeType, RowType, RowsType } from './helperFunctions/types';
import { transparent, wallNodeColor } from './helperFunctions/color';
import './App.css';

// pf => pathfinding
let isSliderChecked = false;
let debounceTimer: number = 0;
let pfGridWidth = 0;
let pfGridTopMargin = 0;
let nodeIdx = 0;
let isMousePressed = false;
let noOfRows = 0;
let noOfNodes = 0;
let bombIndex = 0;

const debounce = (callBack: () => void, time: number = 305) => {
  debounceTimer = 0;
  return () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(callBack, time);
  };
};

const wallNodes: number[] = [];

function App() {
  const [pfGridHeight, setPfGridHeight] = useState(0);
  const [pfGridRows, setPfgridRows] = useState<RowsType>([]);

  const topNavRef = useRef<HTMLDivElement>(null);
  const bottomNavRef = useRef<HTMLDivElement>(null);
  const pfGridRef = useRef<HTMLDivElement>(null);
  const openSideNavRef = useRef<HTMLDivElement>(null);
  const sideNavRef = useRef<HTMLDivElement>(null);
  const startNodeRef = useRef<HTMLElement>(null);
  const targetNodeRef = useRef<HTMLElement>(null);
  const nodesRef = useRef<Array<HTMLDivElement>>([]);

  const calculateAndSetDimension = useRef(() => {});

  const semanticUIDarkMode = (element: HTMLElement) => {
    // H for helper
    const elementH = element;
    element.classList.add('inverted');

    if (element === topNavRef.current!!) {
      elementH.style.borderBottom = '1px solid #767676';
    } else if (element === bottomNavRef.current!!) {
      elementH.style.borderTop = '1px solid #767676';
    } else {
      elementH.style.borderTop = '1px solid #767676';
      elementH.style.borderRight = '1px solid #767676';
      elementH.style.borderBottom = '1px solid #767676';
    }
  };

  const semanticUILightMode = (element: HTMLElement) => {
    // H for helper
    const elementH = element;
    element.classList.remove('inverted');
    elementH.style.border = '1px solid rgba(34, 36, 38, .15)';
  };

  const darkModeToggle = (checked: boolean) => {
    isSliderChecked = checked;
    const isChecked = checked;
    if (isChecked) {
      document.body.style.backgroundColor = '#1b1c1d';
      semanticUIDarkMode(topNavRef.current!!);
      semanticUIDarkMode(bottomNavRef.current!!);
      semanticUIDarkMode(sideNavRef.current!!);
      semanticUIDarkMode(openSideNavRef.current!!);
      startNodeRef.current?.classList.add('inverted');
      targetNodeRef.current?.classList.add('inverted');
    } else {
      document.body.style.backgroundColor = '#ffffff';
      semanticUILightMode(topNavRef.current!!);
      semanticUILightMode(bottomNavRef.current!!);
      semanticUILightMode(sideNavRef.current!!);
      semanticUILightMode(openSideNavRef.current!!);
      startNodeRef.current?.classList.remove('inverted');
      targetNodeRef.current?.classList.remove('inverted');
    }
  };

  const generatePfGrid = () => {
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
    setPfgridRows(rows);
  };

  // remove wall node
  const removeWallNode = (node: HTMLDivElement, idx: number) => {
    const isWallNode = node.getAttribute('data-is-wall-node');
    if (isWallNode === 'true') {
      const nodeH = node;
      const nodeIndex = wallNodes.indexOf(idx);
      if (nodeIndex !== -1) wallNodes.splice(nodeIndex, 1);
      nodeH.style.backgroundColor = transparent;
      nodeH.setAttribute('data-is-wall-node', 'false');
    }
  };

  const getNewPfGridWithWallToggled = (
    // rows: RowsType,
    // row: number,
    // col: number,
    elem: HTMLElement,
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

    const idx = elem.getAttribute('data-idx') as unknown as number;
    const node = nodesRef.current[idx];
    const isWallNode = node.getAttribute('data-is-wall-node');
    const isStartNode = node.getAttribute('data-is-start-node');
    const isTargetNode = node.getAttribute('data-is-target-node');
    const isBombNode = node.getAttribute('data-is-bomb-node');

    if (isStartNode === 'true' || isTargetNode === 'true' || isBombNode === 'true') return;

    // this results to a bug where if (isWallNode) means if isWallNode is false
    // and if (!isWallNode) is isWallNode is true confusion
    // if (isWallNode) {
    //   console.log(999);
    // } else {
    //   console.log(111);
    // }
    removeWallNode(node, idx);

    if (isWallNode === 'false') {
      wallNodes.push(idx);
      node.style.backgroundColor = wallNodeColor;
      node.setAttribute('data-is-wall-node', 'true');
    }
  };

  const handleMouseDown = (elem: HTMLElement) => {
    isMousePressed = true;
    getNewPfGridWithWallToggled(elem);
  };

  const handleMouseEnter = (elem: HTMLElement) => {
    if (!isMousePressed) return;
    getNewPfGridWithWallToggled(elem);
  };

  const handleMouseUp = () => {
    isMousePressed = false;
  };

  const clearWalls = () => {
    if (wallNodes.length === 0) return;
    wallNodes.forEach((idx: number) => {
      const node: HTMLDivElement | null = nodesRef.current[idx];
      if (node !== null) {
        node.style.backgroundColor = transparent;
        node.setAttribute('data-is-wall-node', 'false');
      }
    });
  };

  // set bomb node attr to true
  const setBombNodeAttr = (node: HTMLDivElement) => {
    node.setAttribute('data-is-bomb-node', 'true');
  };

  // set bomb node attr to false
  const unsetBombNodeAttr = (node: HTMLDivElement) => {
    node.setAttribute('data-is-bomb-node', 'false');
  };

  const addBomb = () => {
    const sideNavAddBomb = sideNavRef.current?.children[0];
    const addBombElem = sideNavAddBomb!!.children[1];

    // multiply by 2 for node to be in 3 row
    const rowIndex = noOfNodes * 2;
    const nodeIndex = Math.floor(noOfNodes / 2);
    const node = nodesRef.current[rowIndex + nodeIndex];

    if (bombIndex === 0) {
      removeWallNode(node, rowIndex + nodeIndex);
      setBombNodeAttr(node);
      const i = document.createElement('i');
      i.classList.add('large', 'bomb', 'icon');
      node.appendChild(i);

      addBombElem.textContent = 'Remove Bomb';
      bombIndex = rowIndex + nodeIndex;
    } else {
      unsetBombNodeAttr(node);
      const child = node.children[0];
      node.removeChild(child);

      addBombElem.textContent = 'Add Bomb';
      bombIndex = 0;
    }
  };

  calculateAndSetDimension.current = () => {
    clearWalls();
    const windowHeight = window.innerHeight;
    const pfGridOffset = pfGridRef.current!!.offsetTop;
    const bottomNavHeight = bottomNavRef.current!!.clientHeight;

    const remainingWindowHeight = windowHeight - pfGridOffset;
    // minus 10 for bottom margin
    const height = remainingWindowHeight - bottomNavHeight - 10;

    setPfGridHeight(height);
    pfGridWidth = pfGridRef.current!!.clientWidth;

    // dividing by 25 the height and width of each node
    noOfRows = Math.floor(height / 25);
    noOfNodes = Math.floor(pfGridWidth / 25);
    const remaingSpace = height - (height - noOfRows);
    // -1 for border of 1px
    pfGridTopMargin = (remaingSpace / 2) - 1;
    generatePfGrid();
    clearTimeout(debounceTimer);
  };

  useEffect(() => {
    // effect
    calculateAndSetDimension.current();
    window.addEventListener('resize', debounce(calculateAndSetDimension.current));
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      // cleanup
      window.removeEventListener('resize', debounce(calculateAndSetDimension.current));
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div>
      <TopNav ref={topNavRef} />

      <OpenSideNav
        ref={openSideNavRef}
        top={pfGridRef.current === null ? 0 : pfGridRef.current!!.offsetTop}
        height={0}
        sideNavRef={sideNavRef}
      />

      <SideNav
        ref={sideNavRef}
        top={pfGridRef.current === null ? 0 : pfGridRef.current!!.offsetTop}
        height={pfGridHeight}
        addBomb={addBomb}
        clearWalls={clearWalls}
      />

      <MazesPatternSwitchButton
        isSliderChecked={isSliderChecked}
        darkModeToggle={darkModeToggle}
      />

      <PathFindingGrid
        ref={pfGridRef}
        pfGridHeight={pfGridHeight}
        marginTop={pfGridTopMargin}
        pfGridRows={pfGridRows}
        startNodeRef={startNodeRef}
        targetNodeRef={targetNodeRef}
        nodesRef={nodesRef}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
      />

      <BottomNav ref={bottomNavRef} />
      <div className="error-div">Use Screen of 320px and above</div>

    </div>
  );
}

export default App;
