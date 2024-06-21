const MIN_STAY_TIME = 1000 * 3;
const MAX_STAY_TIME = 1000 * 60 * 60 * 8;
const LOCALES = ['en', 'zh'] as const;

type Locale = (typeof LOCALES)[number];

export { MAX_STAY_TIME, MIN_STAY_TIME, LOCALES };
export type { Locale };
