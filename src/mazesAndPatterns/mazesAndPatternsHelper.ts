const randomNumber = (min: number, max: number) => Math.random() * (max - min + 1) + min;
export const randomIntFromInterval = (
  min: number, max: number,
) => Math.floor(randomNumber(min, max));

// which way to bisect when making mazes
export const horizontal = 'horizontal';
export const vertical = 'vertical';

export const randomIndex = (length: number) => Math.floor(Math.random() * length);

// vertically or horizontally
export const chooseOrientation = (height: number, width: number): string => {
  if (width < height) return horizontal;
  if (height < width) return vertical;
  const orientation = [horizontal, vertical];
  const randomIdx = randomIndex(orientation.length);
  return orientation[randomIdx];
};

// timeouts
let timeouts: number[] = [];

export const clearTimeouts = () => {
  timeouts.forEach((timeout: number) => {
    clearTimeout(timeout);
  });
};

export const pushTimer = (timer: number) => {
  timeouts.push(timer);
};

export const resetTimeouts = (newTimeouts: number[]) => {
  timeouts = newTimeouts;
};

// export const consoleLogTimeouts = () => {
//   console.log(timeouts);
// };
