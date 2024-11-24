import sha256 from 'sha256';
import moment from 'moment';

const KEY_DIGIT = 5;

// Hai-An road interactive installation related
function genPasscode(key: string) {
  const now = moment.utc().format('YYYY-MM-DD HH');
  const chars = sha256(now + key);

  return chars.replaceAll(/\D/g, '').slice(0, KEY_DIGIT);
}

export { genPasscode };
