import rfdc from 'rfdc';

const deepClone = rfdc();
const typeOverRide = <T>(input: any) => input as T;

export { deepClone, typeOverRide };
