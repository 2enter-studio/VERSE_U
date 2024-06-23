import { type MetaData, EMPTY_METADATA } from '@/config';
import moment, { type Moment } from 'moment';

const metadata: { old: MetaData; new: MetaData } = {
	old: structuredClone(EMPTY_METADATA),
	new: structuredClone(EMPTY_METADATA)
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
