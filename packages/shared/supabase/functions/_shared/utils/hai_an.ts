import sha256 from 'sha256';
import moment from 'moment';
import { HAI_AN_PASSCODE_DIGIT } from '../../config.ts';

// Hai-An road interactive installation related
function genHaiAnPasscode(key: string) {
  const now = moment.utc().format('YYYY-MM-DD HH');
  return sha256(now + key)
    .slice(0, HAI_AN_PASSCODE_DIGIT)
    .toUpperCase();
}

export { genHaiAnPasscode };
