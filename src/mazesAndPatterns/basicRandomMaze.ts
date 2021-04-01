import { addRemoveWallNode } from '../helperFunctions/helperFunctions';

const randomNumber = (min: number, max: number) => Math.random() * (max - min + 1) + min;
const randomIntFromInterval = (min: number, max: number) => Math.floor(randomNumber(min, max));

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
