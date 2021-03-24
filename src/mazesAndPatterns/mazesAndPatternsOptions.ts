export const mazesKeys = [
  'None', 'Simple Stair Pattern',
];

export interface mazesType {
  key: string;
  text: string;
  idx: number;
}

const mazesAndPatternsOptions = () => {
  const mazesAndPatterns: mazesType[] = [
    { key: mazesKeys[0], text: 'None', idx: 0 },
    { key: mazesKeys[1], text: 'Simple Stair Pattern', idx: 1 },
    { key: 'maze one', text: 'maze one', idx: 2 },
  ];

  return mazesAndPatterns;
};

export default mazesAndPatternsOptions;
