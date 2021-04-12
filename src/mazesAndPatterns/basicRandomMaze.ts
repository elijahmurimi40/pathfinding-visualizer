import { addRemoveWallNode } from '../helperFunctions/helperFunctions';
import { randomIntFromInterval } from './mazesAndPatternsHelper';

const basicRandomMaze = (nodes: HTMLDivElement[], noOfRows: number, noOfNodes: number) => {
  const totalNodes = (noOfRows * noOfNodes);
  const size = Math.floor(totalNodes / 2);

  // //
  for (let i = 0; i < size; i += 1) {
    const nodeIdx = randomIntFromInterval(0, totalNodes - 1);
    addRemoveWallNode(nodes[nodeIdx], nodeIdx);
  }
};

export default basicRandomMaze;
