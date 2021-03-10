import { useEffect, useRef, useState } from 'react';
import TopNav from './components/TopNav';
import BottomNav from './components/BottomNav';
import { OpenSideNav, SideNav } from './components/SideNav';
import MazesPatternSwitchButton from './components/MazesPatternSwitchButton';
import PathFindingGrid from './components/PathFindingGrid';
import { NodeType, RowType, RowsType } from './helperFunctions/types';
import './App.css';

// pf => pathfinding
let isSliderChecked = false;
let debounceTimer: number = 0;
let pfGridWidth = 0;
let pfGridTopMargin = 0;

const debounce = (callBack: () => void, time: number = 305) => {
  debounceTimer = 0;
  return () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(callBack, time);
  };
};

function App() {
  const [pfGridHeight, setPfGridHeight] = useState(0);
  const [pfGridRows, setPfgridRows] = useState<RowsType>();

  const topNavRef = useRef<HTMLDivElement>(null);
  const bottomNavRef = useRef<HTMLDivElement>(null);
  const pfGridRef = useRef<HTMLDivElement>(null);
  const openSideNavRef = useRef<HTMLDivElement>(null);
  const sideNavRef = useRef<HTMLDivElement>(null);
  const startNodeRef = useRef<HTMLElement>(null);
  const targetNodeRef = useRef<HTMLElement>(null);

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

  const generatePfGrid = (noOfRows: number, noOfNodes: number) => {
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
        };
        currentRow.push(currentNode);
      }
      rows.push(currentRow);
    }
    setPfgridRows(rows);
  };

  calculateAndSetDimension.current = () => {
    const windowHeight = window.innerHeight;
    const pfGridOffset = pfGridRef.current!!.offsetTop;
    const bottomNavHeight = bottomNavRef.current!!.clientHeight;

    const remainingWindowHeight = windowHeight - pfGridOffset;
    // minus 10 for bottom margin
    const height = remainingWindowHeight - bottomNavHeight - 10;

    setPfGridHeight(height);
    pfGridWidth = pfGridRef.current!!.clientWidth;

    // dividing by 25 the height and width of each node
    const noOfRows = Math.floor(height / 25);
    const noOfNodes = Math.floor(pfGridWidth / 25);
    const remaingSpace = height - (height - noOfRows);
    // -1 for border of 1px
    pfGridTopMargin = (remaingSpace / 2) - 1;
    generatePfGrid(noOfRows, noOfNodes);
    clearTimeout(debounceTimer);
  };

  useEffect(() => {
    // effect
    calculateAndSetDimension.current();
    window.addEventListener('resize', debounce(calculateAndSetDimension.current));
    return () => {
      // cleanup
      window.removeEventListener('resize', debounce(calculateAndSetDimension.current));
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
        sideNavRef={null}
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
      />

      <BottomNav ref={bottomNavRef} />
      <div className="error-div">Use Screen of 320px and above</div>

    </div>
  );
}

export default App;
