import type { TableName } from '@/config';

type MetaDataProps<T> = {
	name: string;
	data: T;
	class?: string;
};

type RefProps = {
	base: TableName;
	target: TableName;
	selected?: string;
	name?: string;
	id?: string;
	class?: string;
};

export type { MetaDataProps, RefProps };
