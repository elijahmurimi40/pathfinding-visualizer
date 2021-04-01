export const mazesKeys = [
  'None', 'Basic Random Maze', 'Recursive Division',
  'Recursive Division (horizontal skew)', 'Recursive Division (vertical skew)', 'Simple Stair Pattern',
];

export interface mazesType {
  key: string;
  text: string;
  idx: number;
}

const mazesAndPatternsOptions = () => {
  const mazesAndPatterns: mazesType[] = [];
  mazesKeys.forEach((name: string, index: number) => {
    mazesAndPatterns.push({ key: name, text: name, idx: index });
  });

  return mazesAndPatterns;
};

export default mazesAndPatternsOptions;
