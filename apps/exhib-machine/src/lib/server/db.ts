import 'dotenv/config';
import { makeSupaClient } from '@repo/shared/utils';

const db = makeSupaClient('admin');

export { db };
