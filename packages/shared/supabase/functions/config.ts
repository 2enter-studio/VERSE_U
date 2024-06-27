const MIN_STAY_TIME = 1000 * 60 * 10;
const MAX_STAY_TIME = 1000 * 60 * 60 * 2;
const MAX_TRAVEL_TIME = 1000 * 60 * 40;

const LOCALES = ['en', 'zh'] as const;

type Locale = (typeof LOCALES)[number];

export { MAX_STAY_TIME, MIN_STAY_TIME, LOCALES, MAX_TRAVEL_TIME };
export type { Locale };
