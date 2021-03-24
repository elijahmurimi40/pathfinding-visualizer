import { Menu } from 'semantic-ui-react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import mazesAndPatternsOptions, { mazesType } from '../mazesAndPatterns/mazesAndPatternsOptions';
import { NavProps, arrowDown } from '../helperFunctions/props';

function Nav(props: NavProps) {
  const { arrowDirection, animateMazesAndPatterns, mazesPatternButtonsRef } = props;
  // v for variable :-)
  const mazesAndPatternsOptionsV = mazesAndPatternsOptions();

  return (
    <>
      <Menu.Item href="/path-finding" header>Pathfinding</Menu.Item>
      <Menu.Item>
        <DropdownButton
          drop={arrowDirection === arrowDown ? 'down' : 'up'}
          id="dropdown-basic-button"
          title="Mazes & Patterns"
        >
          {mazesAndPatternsOptionsV.map((maze: mazesType, idx: number) => (
            <Dropdown.Item
              ref={(elem: HTMLButtonElement) => {
                mazesPatternButtonsRef.current!![maze.idx] = elem;
              }}
              className={idx === 0 ? 'active' : ''}
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
