import rfdc from 'rfdc';
import capitalize from 'capitalize';
import { MAX_TRAVEL_TIME } from '../../config.ts';

// General Utilities
function snakeCaseToCapitalize(text: string) {
  return text
    .split('_')
    .map((t) => capitalize(t))
    .join(' ');
}

function genRandomNumbers(range: number, amount: number): number[] {
  const result: number[] = Array.from(Array(range).keys());
  if (amount < range) {
    for (const i of Array(range - amount).keys()) {
      const index = Math.floor(Math.random() * range - 1);
      result.splice(index, 1);
    }
  }
  return result;
}

function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function getDuration(dist: number) {
  return MAX_TRAVEL_TIME * dist;
}

function addTime(base: string | Date, add: number) {
  const startTime = typeof base === 'string' ? new Date(base).getTime() : base.getTime();
  const arriveTime = startTime + add;
  return new Date(arriveTime).toISOString();
}

const typeOverRide = <T>(input: any) => input as T;

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

const deepClone = rfdc();

export {
  dist,
  getDuration,
  addTime,
  genRandomNumbers,
  snakeCaseToCapitalize,
  typeOverRide,
  deepClone
};

export type { Prettify };
