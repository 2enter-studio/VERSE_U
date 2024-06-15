function secToMin(milliSec: number): string {
	const sec = ~~(milliSec / 1000);
	const min = ~~(sec / 60);

	let result = '';

	if (min < 10) result += '0';
	result += `${min}:`;
	if (sec < 10) result += '0';
	result += `${sec}`;
	return result;
}

function getCurrentYearMonth() {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth() + 1;

	if (month < 10) return `${year}_0${month}`;
	return `${year}_${month}`;
}
export { secToMin, getCurrentYearMonth };
