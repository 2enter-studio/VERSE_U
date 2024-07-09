import sha256 from 'sha256';
import moment from 'moment';
import { HAI_AN_PASSCODE_DIGIT } from '../../config.ts';

// Hai-An road interactive installation related
function genHaiAnPasscode(key: string) {
  const now = moment.utc().format('YYYY-MM-DD HH');
  const chars = sha256(now + key);

  return chars.replaceAll(/\D/g, '').slice(0, HAI_AN_PASSCODE_DIGIT);
}

export { genHaiAnPasscode };
