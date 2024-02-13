import React, { ForwardedRef, RefObject, useState } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import {
  shortestPathNodeColor, transparent, visitedNodeColor, visitedNodeColorToBomb, wallNodeColor,
} from '../helperFunctions/color';
import { getDarkMode } from '../helperFunctions/helperFunctions';
import { SideNavDivProps } from '../helperFunctions/props';
import { setTimer } from '../pathfindingAlgorihms/pathfindingAlgorithmsOptions';
import './SideNav.css';

const FAST = 'Fast';
const AVERAGE = 'Average';
const SLOW = 'Slow';

const speedOnClick = (
  // eslint-disable-next-line no-unused-vars
  type: String, setActive: (active: number) => void, sideNavRef: RefObject<HTMLDivElement> | null,
  // eslint-disable-next-line no-unused-vars
  setDisplay: (display: string) => void,
) => {
  const speedMenu = sideNavRef?.current?.children[0];
  const speedText = speedMenu?.children[1].children[0];
  if (type === FAST) {
    speedText!!.textContent = ` ${FAST}`;
    setTimer(20);
    setActive(0);
  }

  if (type === AVERAGE) {
    speedText!!.textContent = ` ${AVERAGE}`;
    setTimer(100);
    setActive(1);
  }

  if (type === SLOW) {
    speedText!!.textContent = ` ${SLOW}`;
    setTimer(500);
    setActive(2);
  }

  setDisplay('none');
};

const animateSideNavRefWidth = (
  // eslint-disable-next-line no-unused-vars
  sideNavRef: RefObject<HTMLDivElement> | null, setLeft: (left: number) => void,
) => {
  // H for helper
  const sideNavRefH = sideNavRef!!.current!!;
  const sideNavRefHWidth = sideNavRefH.style.width;
  // eslint-disable-next-line no-unused-expressions
  // sideNavRefHWidth === '50px' ? sideNavRefH.style.width = '200px'
  //   : sideNavRefH.style.width = '50px';
  if (sideNavRefHWidth === '50px') {
    sideNavRefH.classList.remove('side-nav');
    sideNavRefH.classList.add('side-nav-open');
    sideNavRefH.style.width = '200px';
    setLeft(205);
  } else {
    sideNavRefH.classList.remove('side-nav-open');
    sideNavRefH.classList.add('side-nav');
    sideNavRefH.style.width = '50px';
    setLeft(55);
  }
};

const infoOnClick = (sideNavRef: RefObject<HTMLDivElement>) => {
  // H for helper
  const sideNavRefH = sideNavRef.current!!;
  const sideNavRefHWidth = sideNavRefH.style.width;

  if (sideNavRefHWidth === '50px') {
    sideNavRefH.classList.remove('side-nav');
    sideNavRefH.classList.add('side-nav-open');
    sideNavRefH.style.width = '200px';
  }
};

// export const OpenSideNav = React.forwardRef((
//   props: OpenSideNavProps, ref: ForwardedRef<HTMLDivElement>,
// ) => (
//   <div
//     style={{
//       width: '50px',
//       height: '50px',
//       position: 'absolute',
//       top: `${props.top}px`,
//     }}
//     className="ui vertical menu open-side-nav"
//     ref={ref}
//   >
//     <Menu.Item
//       className="open-menu-item"
//       onClick={() => { animateSideNavRefWidth(props.sideNavRef); }}
//     >
//       <Icon name="grid layout" />
//     </Menu.Item>
//   </div>
// ));

const SideNav = React.forwardRef((
  props: SideNavDivProps, ref: ForwardedRef<HTMLDivElement>,
) => {
  const [left, setLeft] = useState(55);
  const [display, setDisplay] = useState('none');
  const [active, setActive] = useState(1);
  const setLeftHelper = (leftHelper: number) => { setLeft(leftHelper); };
  // const setActiveHelper = (activeHelper: number) => { setActive(activeHelper); };
  const className = getDarkMode()
    ? 'ui vertical menu speed-menu speed-menu-inverted inverted'
    : 'ui vertical menu speed-menu';
  return (
    <>
      {/* open side nav */}
      <div
        style={{
          width: '50px',
          height: '50px',
          position: 'absolute',
          top: `${props.top}px`,
        }}
        className="ui vertical menu open-side-nav"
        ref={props.openSideNavRef}
      >
        <Menu.Item
          className="open-menu-item"
          onClick={() => {
            animateSideNavRefWidth(ref as RefObject<HTMLDivElement>, setLeftHelper);
          }}
        >
          <Icon name="grid layout" />
        </Menu.Item>
      </div>

      {/* speed menu */}
      <div
        ref={props.speedSideNavRef}
        style={{
          left: `${left}px`,
          top: `${props.top + 55}px`,
          display,
        }}
        className={className}
      >
        <Menu.Item
          className={active === 0 ? 'active' : ''}
          onClick={
            () => speedOnClick(FAST, setActive, ref as RefObject<HTMLDivElement>, setDisplay)
          }
        >
          {FAST}
        </Menu.Item>
        <Menu.Item
          className={active === 1 ? 'active' : ''}
          onClick={
            () => speedOnClick(AVERAGE, setActive, ref as RefObject<HTMLDivElement>, setDisplay)
          }
        >
          {AVERAGE}
        </Menu.Item>
        <Menu.Item
          className={active === 2 ? 'active' : ''}
          onClick={
            () => speedOnClick(SLOW, setActive, ref as RefObject<HTMLDivElement>, setDisplay)
          }
        >
          {SLOW}
        </Menu.Item>
      </div>

      <div
        style={{
          width: '50px',
          position: 'absolute',
          height: `${props.height - 55}px`,
          top: `${props.top + 55}px`,
        }}
        className="ui vertical menu side-nav"
        ref={ref}
      >
        <Menu.Item
          className="menu-item"
          onClick={() => {
            if (display === 'none') {
              setDisplay('block');
            } else {
              setDisplay('none');
            }
          }}
        >
          <Icon name="lightning" />
          <span className="menu-item-name">
            Speed:
            <span style={{ fontWeight: 'bold' }}> Average</span>
          </span>
        </Menu.Item>

        <Menu.Item className="menu-item" onClick={props.addBomb}>
          <Icon name="map pin" />
          <span className="menu-item-name">Add Pin</span>
        </Menu.Item>

        <Menu.Item className="menu-item" onClick={props.resetBoard}>
          <Icon name="refresh" />
          <span className="menu-item-name">Reset Board</span>
        </Menu.Item>

        <Menu.Item className="menu-item" onClick={props.clearPathNodes}>
          <Icon name="close" />
          <span className="menu-item-name">Clear Path</span>
        </Menu.Item>

        <Menu.Item className="menu-item" onClick={props.clearWalls}>
          <Icon name="window close" />
          <span className="menu-item-name">Clear Walls</span>
        </Menu.Item>

        <Menu.Item className="menu-item" onClick={() => { infoOnClick(ref as RefObject<HTMLDivElement>); }}>
          <Icon name="info" />
          <span className="menu-item-name">Info</span>

          <div style={{ marginTop: '5px' }} className="info-div">
            <span>
              <Icon name="bullseye" />
              Start Node
            </span>

            <br />
            <span>
              <Icon name="map marker alternate" />
              Target Node
            </span>

            <br />
            <span>
              <Icon name="map pin" />
              Pin Node
            </span>

            <br />
            <span>
              <div className="info-span-div" style={{ backgroundColor: transparent }} />
              <span>Unvisited Node</span>
            </span>

            <br />
            <span>
              <div className="info-span-div" style={{ backgroundColor: shortestPathNodeColor }} />
              <span>Shortest-path Node</span>
            </span>

            <br />
            <span>
              <div className="info-span-div" style={{ backgroundColor: wallNodeColor }} />
              <span>Wall Node</span>
            </span>

            <br />
            <span>
              <div className="info-span-div" style={{ backgroundColor: visitedNodeColor }} />
              <div className="info-span-div" style={{ marginLeft: 5, backgroundColor: visitedNodeColorToBomb }} />
              <span>Visited Nodes</span>
            </span>
          </div>
        </Menu.Item>
      </div>
    </>
  );
});

export default SideNav;
