import sha256 from 'sha256';
import moment from 'moment';

// Hai-An road interactive installation related
function genHaiAnPasscode(key: string) {
  const now = moment.utc().format('YYYY-MM-DD HH');
  return sha256(now + key)
    .slice(0, 5)
    .toUpperCase();
}

export { genHaiAnPasscode };
