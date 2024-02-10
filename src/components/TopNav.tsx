import React, { ForwardedRef } from 'react';
import { Menu, MenuMenu } from 'semantic-ui-react';
import { Alert } from 'react-bootstrap';
import pathfindingAlgorithmsOptions, { algorithms } from '../pathfindingAlgorihms/pathfindingAlgorithmsOptions';
import Nav from './Nav';
import { arrowDown, topNav, TopNavProps } from '../helperFunctions/props';
import './Nav.css';
import aStar from '../pathfindingAlgorihms/aStar';
import {
  addBomb, clearPathNodes, getBombIndex, setTtypeOfSearchAlgorithm,
} from '../App.Functions';
import bidirectionalSearch from '../pathfindingAlgorihms/bidirectionalSearch';
import dijkstras from '../pathfindingAlgorihms/dijkstras';
import breadthFirstSearch from '../pathfindingAlgorihms/breadthFirstSearch';
import depthFirstSearch from '../pathfindingAlgorihms/depthFirstSearch';

const TopNav = React.forwardRef((props: TopNavProps, ref: ForwardedRef<HTMLDivElement>) => {
  const [showAlert, setShowAlert] = React.useState(false);
  const [showNoPath, setShowNoPath] = React.useState(false);

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

  let noPathTimer = 0;
  // F for function
  const showNoPathF = () => {
    setShowNoPath(true);
    if (noPathTimer) clearTimeout(noPathTimer);
    noPathTimer = window.setTimeout(() => {
      setShowNoPath(false);
    }, 4000);
  };

  let timer = 0;
  const visualize = (e: any) => {
    e.preventDefault();
    clearPathNodes(props.nodes.current!!);
    const dropdown = (ref as React.RefObject<HTMLDivElement>).current?.childNodes[1].childNodes[0];
    const { value } = (dropdown as HTMLSelectElement);
    switch (value) {
      case algorithms[0]:
        aStar(
          props.nodes.current!!, props.noOfRows, props.noOfNodes,
          props.showCover, props.hideCover, showNoPathF,
        );
        break;
      case algorithms[1]:
        bidirectionalSearch(
          props.nodes.current!!, props.noOfRows, props.noOfNodes,
          props.showCover, props.hideCover, showNoPathF,
        );
        break;
      case algorithms[2]:
        breadthFirstSearch(
          props.nodes.current!!, props.noOfRows, props.noOfNodes,
          props.showCover, props.hideCover, showNoPathF,
        );
        break;
      case algorithms[3]:
        depthFirstSearch(
          props.nodes.current!!, props.noOfRows, props.noOfNodes,
          props.showCover, props.hideCover, showNoPathF,
        );
        break;
      case algorithms[4]:
        dijkstras(
          props.nodes.current!!, props.noOfRows, props.noOfNodes,
          props.showCover, props.hideCover, showNoPathF,
        );
        break;
      default:
        setShowAlert(true);
        if (timer) clearTimeout(timer);
        timer = window.setTimeout(() => {
          setShowAlert(false);
        }, 2000);
    }
  };

  // select on change
  const selectOnChange = () => {
    const dropdown = (ref as React.RefObject<HTMLDivElement>).current?.childNodes[1].childNodes[0];
    const { value } = (dropdown as HTMLSelectElement);
    const sideNavAddBomb = props.sideNav?.current?.children[1];
    // Remove bomb node
    if (value === algorithms[1]) {
      sideNavAddBomb!!.classList.add('disabled');
    } else {
      sideNavAddBomb!!.classList.remove('disabled');
    }

    if (value === algorithms[1] && getBombIndex() !== -1) {
      addBomb(props.noOfNodes, props.nodes.current!!, props.sideNav.current);
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
        style={{
          position: 'fixed',
          width: '315px',
          right: 0,
          left: 0,
          margin: 'auto',
          zIndex: 9999,
        }}
        variant="danger"
        show={showAlert}
        dismissible
        onClose={() => { setShowAlert(false); }}
        transition={false}
      >
        Select a Pathfinding Algorihm.
      </Alert>

      <Alert
        style={{
          position: 'fixed',
          width: '315px',
          right: 0,
          left: 0,
          margin: 'auto',
          zIndex: 9999,
        }}
        variant="danger"
        show={showNoPath}
        dismissible
        onClose={() => { setShowNoPath(false); }}
        transition={false}
      >
        No Path Found.
      </Alert>
    </>
  );
});

export default TopNav;
