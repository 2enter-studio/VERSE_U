import type { Database } from '@repo/supabase';

const LOCALES = ['zh', 'en'] as const;
const TABLE_NAMES = [
	'regions',
	'wearings',
	'wearing_types',
	'body_parts',
	'meshes',
	'texture_types'
] as const;
const BUCKET_NAMES = ['wearings', 'regions', 'meshes'] as const;
const METADATA_TYPES = ['toggle', 'number', 'plain_text', 'ml_texts'] as const;
const STORAGE_TYPES = ['webp', 'fbx', 'glb'] as const;
const REFERENCE_TYPES = ['single_ref', 'multi_ref'] as const;

type AllTables = keyof Database['public']['Tables'];
type Locale = (typeof LOCALES)[number];
type TableName = (typeof TABLE_NAMES)[number];
type BucketName = (typeof BUCKET_NAMES)[number];
type MetaDataType = (typeof METADATA_TYPES)[number];
type StorageType = (typeof STORAGE_TYPES)[number];
type ReferenceType = (typeof REFERENCE_TYPES)[number];

// Table content presets
const NAME_AND_DESCRIPTION = {
	name: {
		type: 'ml_texts'
	},
	description: {
		type: 'ml_texts'
	}
} as const;

const VALUE = {
	value: {
		type: 'plain_text'
	}
} as const;

// Type definitions for table info
type MetaDataInfo = { type: MetaDataType; readonly?: boolean };
type ReferenceInfo = { type: ReferenceType; target: TableName; readonly?: boolean };
type StorageInfo = { type: StorageType; bucket: BucketName; path: string; readonly?: boolean };
type TableContent = {
	description: string;
	metadata: Record<string, MetaDataInfo>;
	reference?: Record<string, ReferenceInfo>;
	storage?: Record<string, StorageInfo>;
};
type TableInfo = Record<TableName, TableContent>;

const TABLES_INFO: TableInfo = {
	regions: {
		description: '',
		metadata: {
			...NAME_AND_DESCRIPTION,
			enabled: {
				type: 'toggle'
			},
			x: {
				type: 'number'
			},
			y: {
				type: 'number'
			}
		},
		storage: {
			stickers: {
				type: 'webp',
				bucket: 'regions',
				path: 'stickers'
			},
			background: {
				type: 'webp',
				bucket: 'regions',
				path: 'background'
			}
		}
	},
	wearings: {
		description: '',
		metadata: {
			...NAME_AND_DESCRIPTION
		},
		reference: {
			mesh: {
				type: 'single_ref',
				target: 'meshes'
			},
			texture_types: {
				type: 'multi_ref',
				target: 'texture_types'
			}
		},
		storage: {
			texture_basecolor: {
				type: 'webp',
				bucket: 'wearings',
				path: 'texture_basecolor'
			},
			texture_metallic: {
				type: 'webp',
				bucket: 'wearings',
				path: 'texture_metallic'
			},
			texture_roughness: {
				type: 'webp',
				bucket: 'wearings',
				path: 'texture_roughness'
			},
			texture_normal: {
				type: 'webp',
				bucket: 'wearings',
				path: 'texture_normal'
			}
		}
	},
	wearing_types: {
		description: '',
		metadata: {
			...VALUE,
			...NAME_AND_DESCRIPTION
		}
	},
	body_parts: {
		description: '',
		metadata: {
			...VALUE
		}
	},
	meshes: {
		description: '',
		metadata: {
			...VALUE,
			...NAME_AND_DESCRIPTION
		},
		storage: {
			fbx: {
				type: 'fbx',
				bucket: 'meshes',
				path: 'fbx'
			}
		}
	},
	texture_types: {
		description: '',
		metadata: {
			...VALUE
		}
	}
} as const

export type {
	Locale,
	TableName,
	MetaDataType,
	StorageType,
	ReferenceType,
	TableInfo,
	TableContent,
	MetaDataInfo,
	StorageInfo,
	ReferenceInfo
};

export { TABLE_NAMES, TABLES_INFO, LOCALES, BUCKET_NAMES };
