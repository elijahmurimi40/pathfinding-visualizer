import React, { ForwardedRef } from 'react';
import { Menu, MenuMenu } from 'semantic-ui-react';
import { Alert } from 'react-bootstrap';
import pathfindingAlgorithmsOptions, { algorithms } from '../pathfindingAlgorihms/pathfindingAlgorithmsOptions';
import Nav from './Nav';
import { arrowDown, topNav, TopNavProps } from '../helperFunctions/props';
import './Nav.css';
import {
  addBomb, getBombIndex, setTtypeOfSearchAlgorithm,
} from '../App.Functions';

const TopNav = React.forwardRef((props: TopNavProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { noAlgoRef, noPathRef } = props;
  const options = [];
  const pathFindingAlgorithmsOptions = pathfindingAlgorithmsOptions();
  for (let i = 0; i < pathFindingAlgorithmsOptions.length; i += 1) {
    const pathFindingOptionVal = pathFindingAlgorithmsOptions[i];
    options.push(
      <option key={pathFindingOptionVal.key} value={pathFindingOptionVal.value}>
        {pathFindingOptionVal.text}
      </option>,
    );
  }

  const visualize = (e: any) => {
    e.preventDefault();
    props.visualize(false);
  };

  // select on change
  const selectOnChange = () => {
    const dropdown = (ref as React.RefObject<HTMLDivElement>).current?.childNodes[1].childNodes[0];
    const { value } = (dropdown as HTMLSelectElement);
    const sideNavAddBomb = props.sideNav?.current?.children[1];
    // Remove bomb node
    if (value === algorithms[1] || value === algorithms[3]) {
      sideNavAddBomb!!.classList.add('disabled');
    } else {
      sideNavAddBomb!!.classList.remove('disabled');
    }

    if (
      (value === algorithms[1] || value === algorithms[3])
      && getBombIndex() !== -1
    ) {
      addBomb(props.noOfNodes, props.nodes.current!!, props.sideNav.current, props.visualize);
      // sideNavAddBomb!!.classList.add('disabled');
    } else {
      // sideNavAddBomb!!.classList.remove('disabled');
    }
    setTtypeOfSearchAlgorithm(value);
  };

  return (
    <>
      <div
        className="ui menu"
      >
        <div
          ref={ref}
          className="ui menu ui-menu"
          style={{}}
        >
          <span className="show-for-large">
            <Nav
              navType={topNav}
              arrowDirection={arrowDown}
              animateMazesAndPatterns={props.animateMazesAndPatterns}
              mazesPatternButtonsRef={props.mazesPatternButtonsRef}
              currentActiveMazeAndPattern={props.currentActiveMazeAndPattern}
            />
          </span>
          <Menu.Item>
            <select
              style={{ padding: '5px 5px' }}
              name="sorting_algorithms"
              className="ui selection fluid dropdown"
              defaultValue=""
              onChange={selectOnChange}
            >
              <option value="" disabled>Select Pathfinding Algo .....</option>
              {options}
            </select>
          </Menu.Item>

          <MenuMenu position="right">
            <Menu.Item>
              <a
                href="/visualize"
                className="ui fluid blue submit button"
                onClick={(e) => { visualize(e); }}
              >
                Go
              </a>
            </Menu.Item>
          </MenuMenu>
        </div>
      </div>
      <Alert
        ref={props.noAlgoRef}
        style={{
          position: 'fixed',
          width: '315px',
          right: 0,
          left: 0,
          margin: 'auto',
          zIndex: 9999,
        }}
        variant="danger"
        dismissible
        onClose={() => { noAlgoRef.current!!.style.display = 'none'; }}
        transition={false}
      >
        Select a Pathfinding Algorihm.
      </Alert>

      <Alert
        ref={props.noPathRef}
        style={{
          position: 'fixed',
          width: '315px',
          right: 0,
          left: 0,
          margin: 'auto',
          zIndex: 9999,
        }}
        variant="danger"
        dismissible
        onClose={() => { noPathRef.current!!.style.display = 'none'; }}
        transition={false}
      >
        No Path Found.
      </Alert>
    </>
  );
});

export default TopNav;
