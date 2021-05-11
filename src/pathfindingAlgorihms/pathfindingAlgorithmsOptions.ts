export const algorithms = [
  'A* Search', 'Bidirectional Algorithm', 'Breadth-first Search',
  'Depth-first Search', 'Dijkstra\'s Algorithm',
];

const pathfindingAlgorithmsOptions = () => {
  const pathfindingAlgorithms = [
    { key: algorithms[0], text: algorithms[0], value: algorithms[0] },
    { key: algorithms[1], text: algorithms[1], value: algorithms[1] },
    { key: algorithms[2], text: algorithms[2], value: algorithms[2] },
    { key: algorithms[3], text: algorithms[3], value: algorithms[3] },
    { key: algorithms[4], text: algorithms[4], value: algorithms[4] },
  ];

  return pathfindingAlgorithms;
};

export const timer = 50;

export default pathfindingAlgorithmsOptions;
