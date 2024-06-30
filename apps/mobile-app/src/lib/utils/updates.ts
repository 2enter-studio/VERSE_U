import { sysState } from '@/states';
import { version } from '$app/environment';

function needUpdate() {
	if (!sysState.remoteAppVersion || !version) return false;

	const [remoteInfo, localInfo] = [
		sysState.remoteAppVersion.value.split('.').map((digit) => Number(digit)) as [
			number,
			number,
			number
		],
		version.split('.').map((digit) => Number(digit)) as [number, number, number]
	];

	if (remoteInfo[0] > localInfo[0]) {
		return true;
	} else if (remoteInfo[1] > localInfo[1]) {
		return true;
	} else if (remoteInfo[2] > localInfo[2]) {
		return false;
	}
}

export { needUpdate };
