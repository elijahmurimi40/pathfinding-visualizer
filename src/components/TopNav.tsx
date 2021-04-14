import React, { ForwardedRef } from 'react';
import { Menu } from 'semantic-ui-react';
import { Alert } from 'react-bootstrap';
import pathfindingAlgorithmsOptions, { algorithms } from '../pathfindingAlgorihms/pathfindingAlgorithmsOptions';
import Nav from './Nav';
import { arrowDown, NavProps, topNav } from '../helperFunctions/props';
import './Nav.css';

const TopNav = React.forwardRef((props: NavProps, ref: ForwardedRef<HTMLDivElement>) => {
  const [showAlert, setShowAlert] = React.useState(false);

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

  let timer = 0;
  const visualize = (e: any) => {
    e.preventDefault();
    const dropdown = (ref as React.RefObject<HTMLDivElement>).current?.childNodes[1].childNodes[0];
    const { value } = (dropdown as HTMLSelectElement);
    switch (value) {
      case algorithms[0]:
        break;
      default:
        setShowAlert(true);
        if (timer) clearTimeout(timer);
        timer = window.setTimeout(() => {
          setShowAlert(false);
        }, 2000);
    }
  };

  return (
    <>
      <div ref={ref} className="ui menu ui-menu">
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
          >
            <option value="" disabled>Select Pathfinding Algo</option>
            {options}
          </select>
        </Menu.Item>

        <Menu.Item>
          <a
            href="/visualize"
            className="ui fluid blue submit button"
            onClick={(e) => { visualize(e); }}
          >
            Go
          </a>
        </Menu.Item>
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
    </>
  );
});

export default TopNav;
