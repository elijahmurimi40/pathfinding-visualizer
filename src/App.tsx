import React, { useEffect, useRef, useState } from 'react';
import TopNav from './components/TopNav';
import BottomNav from './components/BottomNav';
import SideNav from './components/SideNav';
import MazesPatternSwitchButton from './components/MazesPatternSwitchButton';
import PathFindingGrid from './components/PathFindingGrid';
import { RowsType } from './helperFunctions/types';
import {
  generatePfGrid, getNewPfGridWithWallToggled, clearWalls, addBomb,
  getBombIndex, resetBoard, clearVisitedNodes,
} from './App.Functions';
import {
  setFinishButtonStatus, getNodeBombInfo, getNodeStartInfo,
  getNodeTargetInfo, setDarkMode, pathNodes, getAttr, setAttr,
  setIsSearchAlgoUsed, resetRepeatedPathNodes,
} from './helperFunctions/helperFunctions';
import { mazesKeys } from './mazesAndPatterns/mazesAndPatternsOptions';
import basicRandomMaze from './mazesAndPatterns/basicRandomMaze';
import recursiveDivision from './mazesAndPatterns/recursiveDivision';
import simpleStairPattern from './mazesAndPatterns/simpleStairPattern';
import './App.css';
import { topNav, bottomNav } from './helperFunctions/props';
import { clearTimeouts } from './mazesAndPatterns/mazesAndPatternsHelper';
import recursiveDivisionHorizontalSkew from './mazesAndPatterns/recursiveDivisionHorizontalSkew';
import recursiveDivisionVerticalSkew from './mazesAndPatterns/recursiveDivisionVerticalSkew';
import {
  dataIsArrowNode, dataIsBombNode, dataIsPathNode,
  dataIsStartNode, dataIsTargetNode, dataIsWallNode,
} from './helperFunctions/customAttr';
import { transparent } from './helperFunctions/color';
import aStar from './pathfindingAlgorihms/aStar';
import { algorithms } from './pathfindingAlgorihms/pathfindingAlgorithmsOptions';
import bidirectionalSearch from './pathfindingAlgorihms/bidirectionalSearch';
import breadthFirstSearch from './pathfindingAlgorihms/breadthFirstSearch';
import depthFirstSearch from './pathfindingAlgorihms/depthFirstSearch';
import dijkstras from './pathfindingAlgorihms/dijkstras';

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
  const speedSideNavRef = useRef<HTMLDivElement>(null);
  // bottom and top ref for putting active item
  const mazesPatternButtonsRefTop = useRef<Array<HTMLButtonElement>>([]);
  const mazesPatternButtonsRefBottom = useRef<Array<HTMLButtonElement>>([]);
  const finishButtonRef = useRef<HTMLAnchorElement>(null);
  const noAlgoRef = useRef<HTMLDivElement>(null);
  const noPathRef = useRef<HTMLDivElement>(null);

  const calculateAndSetDimension = useRef(() => {});

  const semanticUIDarkMode = (element: HTMLElement) => {
    // H for helper
    const elementH = element;
    element.classList.add('inverted');
    elementH.style.backgroundColor = '#2a2b2e';

    if (element === topNavRef.current!!) {
      const topNavParentDiv = topNavRef.current!!.parentElement;
      topNavParentDiv?.classList.add('inverted');
      topNavParentDiv!!.style.backgroundColor = '#2a2b2e';
      topNavParentDiv!!.style.borderBottom = '1px solid #767676';
      elementH.style.borderLeft = '1px solid #2d2e2f';
      elementH.style.borderRight = '1px solid #2d2e2f';
    } else if (element === bottomNavRef.current!!) {
      elementH.style.borderTop = '1px solid #767676';
    } else {
      elementH.style.borderTop = '1px solid #767676';
      elementH.style.borderRight = '1px solid #767676';
      elementH.style.borderBottom = '1px solid #767676';
      elementH.style.borderLeft = '1px solid #767676';
    }

    if (element === sideNavRef.current!!) {
      const openSideNav = openSideNavRef.current!!;
      const icon = openSideNav.children[0].children[0];
      icon.classList.add('c-white');
      const sideNav = sideNavRef.current!!.children;
      for (let i = 0; i < sideNav.length; i += 1) {
        const icon2 = sideNav[i].children[0];
        icon2.classList.add('c-white');
      }
    }
  };

  const semanticUILightMode = (element: HTMLElement) => {
    // H for helper
    const elementH = element;
    element.classList.remove('inverted');
    elementH.style.backgroundColor = '#ffffff';
    elementH.style.border = '1px solid rgba(34, 36, 38, .15)';

    if (elementH === topNavRef.current!!) {
      elementH.style.borderBottom = '1px solid transparent';
      elementH.style.borderTop = '1px solid transparent';
      const topNavParentDiv = topNavRef.current!!.parentElement;
      topNavParentDiv?.classList.remove('inverted');
      topNavParentDiv!!.style.backgroundColor = '#ffffff';
      topNavParentDiv!!.style.borderBottom = '1px solid rgba(34, 36, 38, .15)';
    }

    if (element === sideNavRef.current!!) {
      const openSideNav = openSideNavRef.current!!;
      const icon = openSideNav.children[0].children[0];
      icon.classList.remove('c-white');
      const sideNav = sideNavRef.current!!.children;
      for (let i = 0; i < sideNav.length; i += 1) {
        const icon2 = sideNav[i].children[0];
        icon2.classList.remove('c-white');
      }
    }
  };

  const darkModeToggle = (checked: boolean) => {
    isSliderChecked = checked;
    const isChecked = checked;
    if (isChecked) {
      // document.body.style.backgroundColor = '#1b1c1d';
      document.body.style.backgroundColor = '#2a2b2e';
      semanticUIDarkMode(topNavRef.current!!);
      semanticUIDarkMode(bottomNavRef.current!!);
      semanticUIDarkMode(sideNavRef.current!!);
      semanticUIDarkMode(openSideNavRef.current!!);
      nodesRef.current[getNodeStartInfo().index].children[0].classList.add('inverted');
      nodesRef.current[getNodeTargetInfo().index].children[0].classList.add('inverted');
      const start = nodesRef.current[getNodeStartInfo().index].children[0] as HTMLElement;
      const target = nodesRef.current[getNodeTargetInfo().index].children[0] as HTMLElement;
      if (pathNodes.length === 0) {
        start.style.color = '#ffffff';
        target.style.color = '#ffffff';
      }
      if (getBombIndex() !== -1) {
        nodesRef.current[getNodeBombInfo().index].children[0].classList.add('inverted');
        const bomb = nodesRef.current[getNodeBombInfo().index].children[0] as HTMLElement;
        if (pathNodes.length === 0) {
          bomb.style.color = '#ffffff';
        }
      }
      setDarkMode(isChecked);
      speedSideNavRef.current?.classList.add('speed-menu-inverted', 'inverted');
    } else {
      document.body.style.backgroundColor = '#ffffff';
      semanticUILightMode(topNavRef.current!!);
      semanticUILightMode(bottomNavRef.current!!);
      semanticUILightMode(sideNavRef.current!!);
      semanticUILightMode(openSideNavRef.current!!);
      nodesRef.current[getNodeStartInfo().index].children[0].classList.remove('inverted');
      nodesRef.current[getNodeTargetInfo().index].children[0].classList.remove('inverted');
      const start = nodesRef.current[getNodeStartInfo().index].children[0] as HTMLElement;
      const target = nodesRef.current[getNodeTargetInfo().index].children[0] as HTMLElement;
      if (pathNodes.length === 0) {
        start.style.color = '#212529';
        target.style.color = '#212529';
      }
      if (getBombIndex() !== -1) {
        nodesRef.current[getNodeBombInfo().index].children[0].classList.remove('inverted');
        const bomb = nodesRef.current[getNodeBombInfo().index].children[0] as HTMLElement;
        if (pathNodes.length === 0) {
          bomb.style.color = '#212529';
        }
      }
      setDarkMode(isChecked);
      speedSideNavRef.current?.classList.remove('speed-menu-inverted', 'inverted');
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

  // clear path nodes
  const clearPathNodes = (nodes: HTMLDivElement[]) => {
    setIsSearchAlgoUsed(false);
    clearVisitedNodes(nodes);
    pathNodes.forEach((idx: number) => {
      const node: HTMLDivElement | null = nodes[idx];
      const isWallNode = getAttr(node, dataIsWallNode);
      const isStartNode = getAttr(node, dataIsStartNode);
      const isTargetNode = getAttr(node, dataIsTargetNode);
      const isBombNode = getAttr(node, dataIsBombNode);

      if (node !== null && isWallNode === 'false') {
        node.style.backgroundColor = transparent;
        node.classList.add('pf-grid-node-border-color');
      }

      if (isStartNode === 'true' || isTargetNode === 'true' || isBombNode === 'true') {
        const child = node.children[0] as HTMLElement;
        if (isSliderChecked) {
          child.style.color = '#ffffff';
        } else {
          child.style.color = '#212529';
        }
      }

      const start = nodesRef.current[getNodeStartInfo().index].children[0] as HTMLElement;
      const target = nodesRef.current[getNodeTargetInfo().index].children[0] as HTMLElement;
      if (isSliderChecked) {
        start.style.color = '#ffffff';
        target.style.color = '#ffffff';
      } else {
        start.style.color = '#212529';
        target.style.color = '#212529';
      }

      if (getBombIndex() !== -1) {
        nodesRef.current[getNodeBombInfo().index].children[0].classList.add('inverted');
        const bomb = nodesRef.current[getNodeBombInfo().index].children[0] as HTMLElement;
        if (isSliderChecked) {
          bomb.style.color = '#ffffff';
        } else {
          bomb.style.color = '#212529';
        }
      }

      if (isStartNode === 'false' && isTargetNode === 'false' && isBombNode === 'false') {
        setAttr(node, dataIsArrowNode, 'false');
        const childrenCollections = node.children;
        if (childrenCollections.length > 0) {
          childrenCollections[0].remove();
        }
      }

      setAttr(node, dataIsPathNode, 'false');
    });
    pathNodes.length = 0;
  };

  // show cover
  const showCover = (hideMazesPattern: boolean) => {
    animateCoverRef.current!!.style.display = 'block';
    if (hideMazesPattern) {
      const label = mazesPatternDetailRef.current!!.parentElement;
      const { parentElement } = label!!;
      parentElement!!.style.visibility = 'hidden';

      finishButtonRef.current!!.style.visibility = 'visible';
    } else {
      finishButtonRef.current!!.style.visibility = 'hidden';
    }
  };

  // hide cover
  const hideCover = () => {
    animateCoverRef.current!!.style.display = 'none';
    const label = mazesPatternDetailRef.current!!.parentElement;
    const { parentElement } = label!!;
    parentElement!!.style.visibility = 'visible';
    resetRepeatedPathNodes();
  };

  // mazes and patterns
  const animateMazesAndPatterns = (maze: string, idx: number) => {
    clearWalls(nodesRef.current, resetMazesAndPatterns, clearPathNodes);
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
        clearWalls(nodesRef.current, resetMazesAndPatterns, clearPathNodes);
        break;
      case mazesKeys[1]:
        showCover(false);
        basicRandomMaze(nodesRef.current, noOfRows, noOfNodes, hideCover);
        break;
      case mazesKeys[2]:
        showCover(false);
        recursiveDivision(nodesRef.current, noOfRows, noOfNodes, hideCover);
        break;
      case mazesKeys[3]:
        showCover(false);
        recursiveDivisionHorizontalSkew(nodesRef.current, noOfRows, noOfNodes, hideCover);
        break;
      case mazesKeys[4]:
        showCover(false);
        recursiveDivisionVerticalSkew(nodesRef.current, noOfRows, noOfNodes, hideCover);
        break;
      case mazesKeys[5]:
        showCover(false);
        simpleStairPattern(nodesRef.current, noOfRows, noOfNodes, hideCover);
        break;
      default:
        return 0;
    }
    return 0;
  };

  const checkWidth = () => {
    const pfGridNodeHolder = pfGridRef.current?.children[0];
    const nodeHolderWidth = (pfGridNodeHolder as HTMLDivElement)?.clientWidth;
    const windowWidth = window.innerWidth;
    const reimaingWidth = windowWidth - nodeHolderWidth;
    const sideNavRefH = sideNavRef.current;
    const icon = openSideNavRef.current?.children[0].children[0];

    if (openSideNavRef?.current != null) {
      if (windowWidth >= 1580) {
        openSideNavRef.current.style.display = 'none';
        sideNavRefH!!.classList.remove('side-nav');
        sideNavRefH!!.classList.add('side-nav-open');
        sideNavRefH!!.style.width = '200px';
        sideNavRefH!!.style.top = `${pfGridRef.current!!.offsetTop}px`;
        sideNavRefH!!.style.left = `${Math.floor(reimaingWidth / 2) - 200 - 5}px`;
        speedSideNavRef.current!!.style.left = `${Math.floor(reimaingWidth / 2)}px`;
        const h = pfGridHeight > 854 ? 854 : pfGridHeight - 11;
        sideNavRefH!!.style.height = `${h}px`;
      } else {
        openSideNavRef.current.style.display = 'flex';
        sideNavRefH!!.classList.remove('side-nav-open');
        sideNavRefH!!.classList.add('side-nav');
        sideNavRefH!!.style.width = '50px';
        sideNavRefH!!.style.top = `${pfGridRef.current!!.offsetTop + 55}px`;
        sideNavRefH!!.style.left = '0px';
        speedSideNavRef.current!!.style.left = '55px';
        const h = pfGridHeight > 854 ? 854 : pfGridHeight - 63;
        sideNavRefH!!.style.height = `${h}px`;

        icon?.classList.remove('close', 'large');
        icon?.classList.add('grid', 'layout');
      }

      speedSideNavRef.current!!.style.display = 'none';
    }
  };

  calculateAndSetDimension.current = () => {
    clearTimeouts();
    resetMazesAndPatterns();

    noAlgoRef.current!!.style.display = 'none';
    noPathRef.current!!.style.display = 'none';

    const { innerWidth } = window;
    if (innerWidth < 1250) {
      pfGridRef.current!!.style.marginLeft = '60px';
      pfGridRef.current!!.style.marginRight = '10px';
    } else {
      pfGridRef.current!!.style.margin = '0 auto';
    }

    animateCoverRef.current!!.style.display = 'none';
    clearWalls(nodesRef.current, resetMazesAndPatterns, clearPathNodes);
    nodesRef.current.length = 0;

    const sideNavAddBomb = sideNavRef.current?.children[1];
    const addBombElem = sideNavAddBomb!!.children[1];
    addBombElem.textContent = 'Add Pin';

    const windowHeight = window.innerHeight;
    const pfGridOffset = pfGridRef.current!!.offsetTop;
    const bottomNavHeight = bottomNavRef.current!!.clientHeight;

    const remainingWindowHeight = windowHeight - pfGridOffset;
    // minus 10 for bottom margin
    const height = remainingWindowHeight - bottomNavHeight - 10;

    // setPfGridHeight(height);
    pfGridWidth = pfGridRef.current!!.clientWidth;

    // dividing by 25 the height and width of each node
    noOfRows = Math.floor(height / 25);
    noOfNodes = Math.floor(pfGridWidth / 25);
    const remaingSpace = height - (height - noOfRows);
    // -1 for border of 1px
    pfGridTopMargin = (remaingSpace / 2) - 1;
    if (noOfRows > 34) noOfRows = 34;
    const rows: RowsType = generatePfGrid(noOfRows, noOfNodes);
    setPfGridHeight(height);
    setPfgridRows(rows);
    clearTimeout(debounceTimer);
  };

  let noPathTimer = 0;
  // F for function
  const showNoPathF = () => {
    noPathRef.current!!.style.display = 'block';
    if (noPathTimer) clearTimeout(noPathTimer);
    noPathTimer = window.setTimeout(() => {
      noPathRef.current!!.style.display = 'none';
    }, 4000);
  };

  // when the visualize button is pressed
  let timer = 0;
  const visualize = (finish: boolean) => {
    clearPathNodes(nodesRef.current!!);
    setIsSearchAlgoUsed(true);
    const dropdown = (topNavRef as React.RefObject<HTMLDivElement>)
      .current?.childNodes[1].childNodes[0];
    const { value } = (dropdown as HTMLSelectElement);
    switch (value) {
      case algorithms[0]:
        aStar(
          nodesRef.current!!, noOfRows, noOfNodes,
          showCover, hideCover, showNoPathF, finish,
        );
        break;
      case algorithms[1]:
        bidirectionalSearch(
          nodesRef.current!!, noOfRows, noOfNodes,
          showCover, hideCover, showNoPathF, finish,
        );
        break;
      case algorithms[2]:
        breadthFirstSearch(
          nodesRef.current!!, noOfRows, noOfNodes,
          showCover, hideCover, showNoPathF, finish,
        );
        break;
      case algorithms[3]:
        depthFirstSearch(
          nodesRef.current!!, noOfRows, noOfNodes,
          showCover, hideCover, showNoPathF, finish,
        );
        break;
      case algorithms[4]:
        dijkstras(
          nodesRef.current!!, noOfRows, noOfNodes,
          showCover, hideCover, showNoPathF, finish,
        );
        break;
      default:
        noAlgoRef.current!!.style.display = 'block';
        if (timer) clearTimeout(timer);
        timer = window.setTimeout(() => {
          noAlgoRef.current!!.style.display = 'none';
        }, 2000);
    }
  };

  const documentClicked = (e: MouseEvent) => {
    const windowWidth = window.innerWidth;
    if (windowWidth >= 1580) return;

    const t = e.target as Node;
    const sideNav = sideNavRef.current!!;
    const speedNav = speedSideNavRef.current!!;
    const openSideNav = openSideNavRef.current!!;
    const clickedInsideSideNav = sideNav.contains(t);
    const clickedInsideSpeedNav = speedNav.contains(t);
    const clickedInsideOpen = openSideNav.contains(t);
    const icon = openSideNavRef.current?.children[0].children[0];

    if (!clickedInsideSideNav && !clickedInsideSpeedNav && !clickedInsideOpen) {
      speedNav.style.left = '55px';
      speedNav.style.display = 'none';
      sideNav.classList.remove('side-nav-open');
      sideNav.classList.add('side-nav');
      sideNav.style.width = '50px';
      sideNav.style.top = `${pfGridRef.current!!.offsetTop + 55}px`;
      sideNav.style.left = '0px';
      icon?.classList.remove('close', 'large');
      icon?.classList.add('grid', 'layout');
    }
  };

  useEffect(() => {
    // effect
    calculateAndSetDimension.current();
    window.addEventListener('resize', debounce(calculateAndSetDimension.current));
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('click', documentClicked);
    return () => {
      // cleanup
      window.removeEventListener('resize', debounce(calculateAndSetDimension.current));
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('click', documentClicked);
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
        nodes={nodesRef}
        noOfNodes={noOfNodes}
        sideNav={sideNavRef}
        visualize={visualize}
        noAlgoRef={noAlgoRef}
        noPathRef={noPathRef}
      />

      {/* <OpenSideNav
        ref={openSideNavRef}
        top={pfGridRef.current === null ? 0 : pfGridRef.current!!.offsetTop}
        height={0}
        sideNavRef={sideNavRef}
      /> */}

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
        visualize={visualize}
        checkWidth={checkWidth}
      />

      <SideNav
        ref={sideNavRef}
        top={pfGridRef.current === null ? 0 : pfGridRef.current!!.offsetTop}
        height={pfGridHeight}
        addBomb={
          // eslint-disable-next-line max-len
          () => { addBomb(noOfNodes, nodesRef.current, sideNavRef.current, visualize); }
        }
        resetBoard={
          () => {
            resetBoard(
              nodesRef.current, noOfRows, noOfNodes,
              resetMazesAndPatterns, sideNavRef.current, clearPathNodes,
            );
          }
        }
        clearPathNodes={() => { clearPathNodes(nodesRef.current); }}
        clearWalls={() => { clearWalls(nodesRef.current, resetMazesAndPatterns, clearPathNodes); }}
        speedSideNavRef={speedSideNavRef}
        openSideNavRef={openSideNavRef}
        pfGridNodeHolder={pfGridRef.current?.children[0]}
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
        <div className="error-div">Use Screen of width 320px and above</div>
      </div>

      {/* h for height */}
      <div className="cover-div cover-div-error-h">
        <div className="error-div">Use Screen of height 320px and above</div>
      </div>

      <div className="cover-div" ref={animateCoverRef}>
        <a
          ref={finishButtonRef}
          style={{
            width: '80px',
            margin: '83px auto',
          }}
          href="/finish"
          className="ui fluid blue submit button"
          onClick={(e) => {
            e.preventDefault();
            setFinishButtonStatus(true);
          }}
        >
          Finish
        </a>
      </div>
    </div>
  );
}

export default App;
