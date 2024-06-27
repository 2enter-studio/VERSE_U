import rfdc from 'rfdc';
import capitalize from 'capitalize';
import { MAX_TRAVEL_TIME } from '../../config.ts';
import type { Database } from '../../types.ts';

// General Utilities
function snakeCaseToCapitalize(text: string) {
  return text
    .split('_')
    .map((t) => capitalize(t))
    .join(' ');
}

function genRandomTexts(
  length: number,
  options: { num?: boolean; uppercase?: boolean; lowercase?: boolean; symbol?: boolean } = {
    num: true,
    uppercase: true,
    lowercase: true,
    symbol: false
  }
) {
  const charsets = {
    num: '0123456789',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    symbol: '!@#$%^&*()'
  } as const;

  const charset = Object.entries(charsets)
    .filter(([key, _]) => options?.[key as 'num' | 'uppercase' | 'lowercase' | 'symbol'])
    .map((o) => o[1])
    .join('');

  let result = '';

  for (let i = 0; i < length; i++) {
    result += charset[Math.floor(Math.random() * charset.length)];
  }

  return result;
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

// Time related
type DateInput = Date | string | number;

function inPeriod(start: DateInput, end: DateInput, target: DateInput) {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const targetTime = new Date(target).getTime();

  if (targetTime < endTime && targetTime > startTime) {
    return endTime - targetTime;
  } else {
    return null;
  }
}

function addTime(base: DateInput, add: number) {
  const startTime = new Date(base).getTime();
  const arriveTime = startTime + add;
  return new Date(arriveTime).toISOString();
}

// Type related
const typeOverRide = <T>(input: any) => input as T;

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type AllSupaTableName = keyof Database['public']['Tables'];

const deepClone = rfdc();

export {
  dist,
  getDuration,
  addTime,
  inPeriod,
  genRandomNumbers,
  genRandomTexts,
  snakeCaseToCapitalize,
  typeOverRide,
  deepClone
};

export type { Prettify, AllSupaTableName };
