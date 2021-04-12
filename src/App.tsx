import { useEffect, useRef, useState } from 'react';
import TopNav from './components/TopNav';
import BottomNav from './components/BottomNav';
import { OpenSideNav, SideNav } from './components/SideNav';
import MazesPatternSwitchButton from './components/MazesPatternSwitchButton';
import PathFindingGrid from './components/PathFindingGrid';
import { RowsType } from './helperFunctions/types';
import {
  generatePfGrid, getNewPfGridWithWallToggled, clearWalls, addBomb,
  getStartNodeIdx, getTargetNodeIdx, getBombIndex,
} from './App.Functions';
import { setDarkMode } from './helperFunctions/helperFunctions';
import { mazesKeys } from './mazesAndPatterns/mazesAndPatternsOptions';
import basicRandomMaze from './mazesAndPatterns/basicRandomMaze';
import recursiveDivision from './mazesAndPatterns/recursiveDivision';
import simpleStairPattern from './mazesAndPatterns/simpleStairPattern';
import './App.css';
import { topNav, bottomNav } from './helperFunctions/props';
import { clearTimeouts } from './mazesAndPatterns/mazesAndPatternsHelper';

// pf => pathfinding
let isSliderChecked = false;
let debounceTimer: number = 0;
let pfGridWidth = 0;
let pfGridTopMargin = 0;
let isMousePressed = false;
let noOfRows = 0;
let noOfNodes = 0;
let currentActiveMazeAndPattern = 0;

const debounce = (callBack: () => void, time: number = 305) => {
  debounceTimer = 0;
  return () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(callBack, time);
  };
};

function App() {
  const [pfGridHeight, setPfGridHeight] = useState(0);
  const [pfGridRows, setPfgridRows] = useState<RowsType>([]);

  const topNavRef = useRef<HTMLDivElement>(null);
  const bottomNavRef = useRef<HTMLDivElement>(null);
  const pfGridRef = useRef<HTMLDivElement>(null);
  const openSideNavRef = useRef<HTMLDivElement>(null);
  const sideNavRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<Array<HTMLDivElement>>([]);
  const animateCoverRef = useRef<HTMLDivElement>(null);
  const mazesPatternDetailRef = useRef<HTMLDivElement>(null);
  // bottom and top ref for putting active item
  const mazesPatternButtonsRefTop = useRef<Array<HTMLButtonElement>>([]);
  const mazesPatternButtonsRefBottom = useRef<Array<HTMLButtonElement>>([]);

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
      nodesRef.current[getStartNodeIdx()].children[0].classList.add('inverted');
      nodesRef.current[getTargetNodeIdx()].children[0].classList.add('inverted');
      if (getBombIndex() !== 0) {
        nodesRef.current[getBombIndex()].children[0].classList.add('inverted');
      }
      setDarkMode(isChecked);
    } else {
      document.body.style.backgroundColor = '#ffffff';
      semanticUILightMode(topNavRef.current!!);
      semanticUILightMode(bottomNavRef.current!!);
      semanticUILightMode(sideNavRef.current!!);
      semanticUILightMode(openSideNavRef.current!!);
      nodesRef.current[getStartNodeIdx()].children[0].classList.remove('inverted');
      nodesRef.current[getTargetNodeIdx()].children[0].classList.remove('inverted');
      if (getBombIndex() !== 0) {
        nodesRef.current[getBombIndex()].children[0].classList.remove('inverted');
      }
      setDarkMode(isChecked);
    }
  };

  const handleMouseDown = (elem: HTMLElement) => {
    isMousePressed = true;
    getNewPfGridWithWallToggled(elem, nodesRef.current);
  };

  const handleMouseEnter = (elem: HTMLElement) => {
    if (!isMousePressed) return;
    getNewPfGridWithWallToggled(elem, nodesRef.current);
  };

  const handleMouseUp = () => {
    isMousePressed = false;
  };

  // reset mazes and patters
  const resetMazesAndPatterns = () => {
    if (mazesPatternButtonsRefTop.current.length !== 0) {
      mazesPatternButtonsRefTop.current!![currentActiveMazeAndPattern].classList.remove('active');
      mazesPatternButtonsRefTop.current!![0].classList.add('active');
    }

    if (mazesPatternButtonsRefBottom.current.length !== 0) {
      mazesPatternButtonsRefBottom.current!![currentActiveMazeAndPattern].classList.remove('active');
      mazesPatternButtonsRefBottom.current!![0].classList.add('active');
    }

    mazesPatternDetailRef.current!!.textContent = 'None';
    currentActiveMazeAndPattern = 0;
  };

  // mazes and patterns
  const animateMazesAndPatterns = (maze: string, idx: number) => {
    clearWalls(nodesRef.current, resetMazesAndPatterns);
    const index = currentActiveMazeAndPattern;
    currentActiveMazeAndPattern = idx;
    mazesPatternDetailRef.current!!.textContent = maze;

    if (mazesPatternButtonsRefTop.current.length !== 0) {
      mazesPatternButtonsRefTop.current!![index].classList.remove('active');
      mazesPatternButtonsRefTop.current!![idx].classList.add('active');
    }

    if (mazesPatternButtonsRefBottom.current.length !== 0) {
      mazesPatternButtonsRefBottom.current!![index].classList.remove('active');
      mazesPatternButtonsRefBottom.current!![idx].classList.add('active');
    }

    switch (maze) {
      case mazesKeys[0]:
        clearWalls(nodesRef.current, resetMazesAndPatterns);
        break;
      case mazesKeys[1]:
        basicRandomMaze(nodesRef.current, noOfRows, noOfNodes);
        break;
      case mazesKeys[2]:
        recursiveDivision(nodesRef.current, noOfRows, noOfNodes);
        break;
      case mazesKeys[5]:
        simpleStairPattern(nodesRef.current, noOfRows, noOfNodes);
        break;
      default:
        return 0;
    }
    return 0;
  };

  calculateAndSetDimension.current = () => {
    clearTimeouts();
    resetMazesAndPatterns();
    animateCoverRef.current!!.style.display = 'none';
    clearWalls(nodesRef.current, resetMazesAndPatterns);
    nodesRef.current.length = 0;

    const sideNavAddBomb = sideNavRef.current?.children[0];
    const addBombElem = sideNavAddBomb!!.children[1];
    addBombElem.textContent = 'Add Bomb';

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
    const rows: RowsType = generatePfGrid(noOfRows, noOfNodes);
    setPfgridRows(rows);
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
      <TopNav
        navType={topNav}
        ref={topNavRef}
        arrowDirection=""
        animateMazesAndPatterns={animateMazesAndPatterns}
        mazesPatternButtonsRef={[mazesPatternButtonsRefTop, mazesPatternButtonsRefBottom]}
        currentActiveMazeAndPattern={currentActiveMazeAndPattern}
      />

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
        addBomb={
          // eslint-disable-next-line max-len
          () => { addBomb(noOfNodes, nodesRef.current, sideNavRef.current); }
        }
        clearWalls={() => { clearWalls(nodesRef.current, resetMazesAndPatterns); }}
      />

      <MazesPatternSwitchButton
        ref={mazesPatternDetailRef}
        isSliderChecked={isSliderChecked}
        darkModeToggle={darkModeToggle}
      />

      <PathFindingGrid
        ref={pfGridRef}
        pfGridHeight={pfGridHeight}
        marginTop={pfGridTopMargin}
        pfGridRows={pfGridRows}
        nodesRef={nodesRef}
        noOfNodes={noOfNodes}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
      />

      <BottomNav
        navType={bottomNav}
        ref={bottomNavRef}
        arrowDirection=""
        animateMazesAndPatterns={animateMazesAndPatterns}
        mazesPatternButtonsRef={[mazesPatternButtonsRefTop, mazesPatternButtonsRefBottom]}
        currentActiveMazeAndPattern={currentActiveMazeAndPattern}
      />
      <div className="cover-div cover-div-error">
        <div className="error-div">Use Screen of 320px and above</div>
      </div>

      <div className="cover-div" ref={animateCoverRef} />
    </div>
  );
}

export default App;
