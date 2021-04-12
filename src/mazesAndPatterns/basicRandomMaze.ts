import { addRemoveWallNode } from '../helperFunctions/helperFunctions';
import { randomIntFromInterval, resetTimeouts, pushTimer } from './mazesAndPatternsHelper';

const basicRandomMaze = (
  nodes: HTMLDivElement[], noOfRows: number, noOfNodes: number, hideCover: () => void,
) => {
  const totalNodes = (noOfRows * noOfNodes);
  const size = Math.floor(totalNodes / 2);
  const aniamtions = [];

  resetTimeouts([]);
  // //
  for (let i = 0; i < size; i += 1) {
    const nodeIdx = randomIntFromInterval(0, totalNodes - 1);
    aniamtions.push(nodeIdx);
    const timer = window.setTimeout(() => {
      addRemoveWallNode(nodes[nodeIdx], nodeIdx);
      if (i === size - 1) hideCover();
    }, i * 10);

    pushTimer(timer);
  }
};

export default basicRandomMaze;
