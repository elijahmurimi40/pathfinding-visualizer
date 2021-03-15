import React, { ForwardedRef, RefObject } from 'react';
import { Menu, Icon, Dropdown } from 'semantic-ui-react';
import {
  shortestPathNodeColor, transparent, visitedNodeColor, visitedNodeColorToBomb, wallNodeColor,
} from '../helperFunctions/color';
import { OpenSideNavProps, SideNavDivProps } from '../helperFunctions/props';
import './SideNav.css';

const animateSideNavRefWidth = (sideNavRef: RefObject<HTMLDivElement> | null) => {
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
  } else {
    sideNavRefH.classList.remove('side-nav-open');
    sideNavRefH.classList.add('side-nav');
    sideNavRefH.style.width = '50px';
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

export const OpenSideNav = React.forwardRef((
  props: OpenSideNavProps, ref: ForwardedRef<HTMLDivElement>,
) => (
  <div
    style={{
      width: '50px',
      height: '50px',
      position: 'absolute',
      top: `${props.top}px`,
    }}
    className="ui vertical menu open-side-nav"
    ref={ref}
  >
    <Menu.Item
      className="open-menu-item"
      onClick={() => { animateSideNavRefWidth(props.sideNavRef); }}
    >
      <Icon name="grid layout" />
    </Menu.Item>
  </div>
));

export const SideNav = React.forwardRef((
  props: SideNavDivProps, ref: ForwardedRef<HTMLDivElement>,
) => {
  console.log('p');
  return (
    <>
      {/* <Menu secondary vertical>
        <Menu.Item
          name="account"
        />
        <Menu.Item
          name="settings"
        />
        <Dropdown item text="Display Options">
          <Dropdown.Menu>
            <Dropdown.Header>Text Size</Dropdown.Header>
            <Dropdown.Item>Small</Dropdown.Item>
            <Dropdown.Item>Medium</Dropdown.Item>
            <Dropdown.Item>Large</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu> */}
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
        <Menu.Item className="menu-item">
          <Icon name="bomb" />
          <span className="menu-item-name">Add Bomb</span>
        </Menu.Item>

        <Menu.Item className="menu-item">
          <Icon name="refresh" />
          <span className="menu-item-name">Reset Board</span>
        </Menu.Item>

        <Menu.Item className="menu-item">
          <Icon name="close" />
          <span className="menu-item-name">Clear Path</span>
        </Menu.Item>

        <Menu.Item className="menu-item" onClick={props.clearWalls}>
          <Icon name="window close" />
          <span className="menu-item-name">Clear Walls</span>
        </Menu.Item>

        <Menu.Item className="menu-item" onClick={() => {}}>
          <Icon name="lightning" />
          <span className="menu-item-name">
            Speed:
            <span style={{ fontWeight: 'bold' }}> Fast</span>
          </span>
        </Menu.Item>

        <Menu.Item className="menu-item" onClick={() => { infoOnClick(ref as RefObject<HTMLDivElement>); }}>
          <Icon name="info" />
          <span className="menu-item-name">Info</span>

          <div style={{ marginTop: '5px' }} className="info-div">
            <span>
              <Icon name="chevron right" />
              Start Node
            </span>

            <br />
            <span>
              <Icon name="bullseye" />
              Target Node
            </span>

            <br />
            <span>
              <Icon name="bomb" />
              Bomb Node
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

        <Dropdown item text="D">
          <Dropdown.Menu>
            <Dropdown.Header>Text Size</Dropdown.Header>
            <Dropdown.Item>Small</Dropdown.Item>
            <Dropdown.Item>Medium</Dropdown.Item>
            <Dropdown.Item>Large</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* <div className="ui active visible dropdown item">
          <i className="dropdown icon" />
          D
          <div className="menu transition visible">
            <div className="header">Text Size</div>
            <a href="p" className="item">Small</a>
            <a href="p" className="item">Medium</a>
            <a href="p" className="item">Large</a>
          </div>
        </div> */}
      </div>

      {/* <div
        style={{
          width: '50px',
          position: 'absolute',
          height: `${props.height - 55}px`,
          top: `${props.top + 55}px`,
          left: '50px',
        }}
        className="ui vertical menu side-nav2"
      >
        <Dropdown item text="Display Options">
          <Dropdown.Menu>
            <Dropdown.Header>Text Size</Dropdown.Header>
            <Dropdown.Item>Small</Dropdown.Item>
            <Dropdown.Item>Medium</Dropdown.Item>
            <Dropdown.Item>Large</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Menu.Item className="menu-item" onClick={() => {}}>
          <Icon name="bomb" />
        </Menu.Item>
        <Menu.Item className="menu-item" onClick={() => {}}>
          <Icon name="bomb" />
        </Menu.Item>
        <Menu.Item className="menu-item" onClick={() => {}}>
          <Icon name="bomb" />
        </Menu.Item>
        <Menu.Item className="menu-item" onClick={() => {}}>
          <Icon name="bomb" />
        </Menu.Item>
        <Menu.Item className="menu-item" onClick={() => {}}>
          <Icon name="bomb" />
        </Menu.Item>
        <Menu.Item className="menu-item" onClick={() => {}}>
          <Icon name="bomb" />
        </Menu.Item>
      </div> */}
    </>
  );
});
