import config, { type MetaData } from '@/config';
import { deepClone } from '@repo/utils';
import moment, { type Moment } from 'moment';

const { EMPTY_METADATA } = config;

const metadata: { old: MetaData; new: MetaData } = {
	old: deepClone(EMPTY_METADATA),
	new: deepClone(EMPTY_METADATA)
};

type ServerState = {
	initialized: boolean;
	mode: 'development' | 'production';
	lastUpdated: Moment;
};

const serverState: ServerState = {
	initialized: false,
	mode: 'development',
	lastUpdated: moment()
};


export { metadata, serverState };
