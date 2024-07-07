const MIN_STAY_TIME = 1000 * 60 * 10;
const MAX_STAY_TIME = 1000 * 60 * 60 * 2;
const MAX_TRAVEL_TIME = 1000 * 60 * 60;
const HAI_AN_PASSCODE_DIGIT = 5;
const DEFAULT_SKIN_COLOR = {
  X: 253,
  Y: 198,
  Z: 162
} as const;

const LOCALES = ['en', 'zh'] as const;

type Locale = (typeof LOCALES)[number];

export {
  MAX_STAY_TIME,
  MIN_STAY_TIME,
  LOCALES,
  MAX_TRAVEL_TIME,
  HAI_AN_PASSCODE_DIGIT,
  DEFAULT_SKIN_COLOR
};

export type { Locale };
