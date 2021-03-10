import React, { ForwardedRef } from 'react';
import { arrowUp } from '../helperFunctions/props';
import Nav from './Nav';

const BottomNav = React.forwardRef((props, ref: ForwardedRef<HTMLDivElement>) => (
  <div ref={ref} className="ui bottom fixed two item menu show-for-medium">
    <Nav arrowDirection={arrowUp} />
  </div>
));

export default BottomNav;
