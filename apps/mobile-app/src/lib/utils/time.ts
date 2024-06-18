import moment from 'moment';

function secToMin(milliSec: number): string {
	return moment.utc(milliSec).format('mm:ss');
}

function getCurrentYearMonth() {
	return moment().utc().format('YYYY_MM');
}
export { secToMin, getCurrentYearMonth };
