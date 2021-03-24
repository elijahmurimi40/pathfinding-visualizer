import React, { ForwardedRef } from 'react';
import { arrowUp, NavProps } from '../helperFunctions/props';
import Nav from './Nav';

const BottomNav = React.forwardRef((props: NavProps, ref: ForwardedRef<HTMLDivElement>) => (
  <div ref={ref} className="ui bottom fixed two item menu show-for-medium">
    <Nav
      arrowDirection={arrowUp}
      animateMazesAndPatterns={props.animateMazesAndPatterns}
      mazesPatternButtonsRef={props.mazesPatternButtonsRef}
    />
  </div>
));

export default BottomNav;
