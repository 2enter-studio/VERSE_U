import 'dotenv/config';
import { makeSupaClient } from '@repo/config/utils';

const admin = makeSupaClient('admin');

export { admin };
