import { Menu } from 'semantic-ui-react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import mazesAndPatternsOptions from '../pathfindingAlgorihms/mazesAndPatternsOptions';
import { NavProps, arrowDown } from '../helperFunctions/props';

function Nav(props: NavProps) {
  const { arrowDirection } = props;
  const options = [];
  // v for variable :-)
  const mazesAndPatternsOptionsV = mazesAndPatternsOptions();
  for (let i = 0; i < mazesAndPatternsOptionsV.length; i += 1) {
    const mazesAndPatternsOptionVal = mazesAndPatternsOptionsV[i];
    options.push(
      <option key={mazesAndPatternsOptionVal.key} value={mazesAndPatternsOptionVal.value}>
        {mazesAndPatternsOptionVal.text}
      </option>,
    );
  }

  return (
    <>
      <Menu.Item href="/path-finding" header>Pathfinding</Menu.Item>
      <Menu.Item>
        <DropdownButton
          drop={arrowDirection === arrowDown ? 'down' : 'up'}
          id="dropdown-basic-button"
          title="Mazes & Patterns"
        >
          <Dropdown.Item as="button">Action</Dropdown.Item>
          <Dropdown.Item as="button">Another action</Dropdown.Item>
          <Dropdown.Item as="button">Something else</Dropdown.Item>
        </DropdownButton>
      </Menu.Item>
    </>
  );
}

export default Nav;
