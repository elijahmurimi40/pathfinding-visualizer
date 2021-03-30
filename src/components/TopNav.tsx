import React, { ForwardedRef } from 'react';
import { Menu } from 'semantic-ui-react';
import pathfindingAlgorithmsOptions from '../pathfindingAlgorihms/pathfindingAlgorithmsOptions';
import Nav from './Nav';
import { arrowDown, NavProps, topNav } from '../helperFunctions/props';
import './Nav.css';

const TopNav = React.forwardRef((props: NavProps, ref: ForwardedRef<HTMLDivElement>) => {
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
          >
            Go
          </a>
        </Menu.Item>
      </div>
    </>
  );
});

export default TopNav;
