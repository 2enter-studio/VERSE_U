import 'dotenv/config';
import { makeSupaClient } from '@repo/shared/utils';

const admin = makeSupaClient('admin');

export { admin };
