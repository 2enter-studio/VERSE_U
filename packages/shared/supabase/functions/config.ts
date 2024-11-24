const APP_LINKS = {
  '101 特別體驗版': 'https://web.verseu.app',
  ios: 'https://apps.apple.com/tw/app/verse-u/id6502902450',
  android: 'https://app.verseu.app',
  web: 'https://app.verseu.app'
};
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
const SPONSOR_NAMES = ['the_place'] as const;

type Locale = (typeof LOCALES)[number];
type SponsorName = (typeof SPONSOR_NAMES)[number];
const COUPON_LIMITS: Record<SponsorName, number> = {
  the_place: 200
} as const;

export {
  APP_LINKS,
  MAX_STAY_TIME,
  MIN_STAY_TIME,
  LOCALES,
  SPONSOR_NAMES,
  COUPON_LIMITS,
  MAX_TRAVEL_TIME,
  HAI_AN_PASSCODE_DIGIT,
  DEFAULT_SKIN_COLOR
};

export type { Locale, SponsorName };
