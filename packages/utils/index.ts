import dotenv from 'dotenv';
import rfdc from 'rfdc';

dotenv.config({ path: '../../.env' });

const { env } = process;

const deepClone = rfdc();

export { deepClone, env };
