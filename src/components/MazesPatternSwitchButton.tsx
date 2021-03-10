import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import { Label } from 'semantic-ui-react';
import './MazesPatternSwitchButton.css';

interface Props {
  isSliderChecked: boolean;
  // eslint-disable-next-line no-unused-vars
  darkModeToggle: (checked: boolean) => void;
}

function MazesPatternSwitchButton(props: Props) {
  const { isSliderChecked, darkModeToggle } = props;
  return (
    <div className="mazes-pattern-label">
      <div style={{ marginRight: '5px' }}>
        <BootstrapSwitchButton
          checked={isSliderChecked}
          width={110}
          onlabel="Dark Mode"
          onstyle="dark"
          offlabel="Light mode"
          offstyle="primary"
          // eslint-disable-next-line react/style-prop-object
          style="border"
          onChange={(checked: boolean) => { darkModeToggle(checked); }}
        />
      </div>

      <Label color="blue" style={{ marginLeft: '5px' }}>
        Current Maze & Pattern
        <br />
        <Label.Detail>None</Label.Detail>
      </Label>
    </div>
  );
}

export default MazesPatternSwitchButton;
