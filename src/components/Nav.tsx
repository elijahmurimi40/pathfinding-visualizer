import { Menu } from 'semantic-ui-react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import mazesAndPatternsOptions, { mazesType } from '../mazesAndPatterns/mazesAndPatternsOptions';
import { NavProps, arrowDown, topNav } from '../helperFunctions/props';

function Nav(props: NavProps) {
  const {
    navType, arrowDirection, animateMazesAndPatterns,
    mazesPatternButtonsRef, currentActiveMazeAndPattern,
  } = props;
  // v for variable :-)
  const mazesAndPatternsOptionsV = mazesAndPatternsOptions();

  return (
    <>
      <Menu.Item href="/" header>Pathfinding Visualizer</Menu.Item>
      <Menu.Item>
        <DropdownButton
          drop={arrowDirection === arrowDown ? 'down' : 'up'}
          id="dropdown-basic-button"
          title="Mazes & Patterns"
        >
          {mazesAndPatternsOptionsV.map((maze: mazesType, idx: number) => (
            <Dropdown.Item
              ref={(elem: HTMLButtonElement) => {
                if (navType === topNav) {
                  mazesPatternButtonsRef[0].current!![maze.idx] = elem;
                } else {
                  mazesPatternButtonsRef[1].current!![maze.idx] = elem;
                }
              }}
              className={idx === currentActiveMazeAndPattern ? 'active' : ''}
              as="button"
              key={maze.key}
              onClick={() => { animateMazesAndPatterns(maze.key, maze.idx); }}
            >
              {maze.text}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </Menu.Item>
    </>
  );
}

export default Nav;
