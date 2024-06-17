import type { TableName } from '@/config';

type MetaDataProps<T> = {
	name: string;
	data: T;
	class?: string;
};

type RefProps = {
	name?: string;
	base?: TableName;
	base_id?: string;
	target: TableName;
	class?: string;
	selected?: string;
};

export type { MetaDataProps, RefProps };
