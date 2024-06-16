import type { Database } from '@repo/supabase';

const LOCALES = ['zh', 'en'] as const;
const TABLE_NAMES = [
	'regions',
	'wearings',
	'meshes',
	'wearing_types',
	'texture_types',
	'body_parts'
] as const;
const BUCKET_NAMES = ['wearings', 'regions', 'meshes'] as const;
const METADATA_TYPES = ['toggle', 'number', 'plain_text', 'ml_texts'] as const;
const STORAGE_TYPES = ['webp', 'fbx', 'glb'] as const;
const REFERENCE_TYPES = ['single_ref', 'multi_ref'] as const;

type AllTable = keyof Database['public']['Tables'];
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

const ID = {
	id: {
		type: 'plain_text',
		readonly: true
	}
} as const;

// Type definitions for table info
type MetaDataInfo = { type: MetaDataType; readonly?: boolean };
type ReferenceInfo = { type: ReferenceType; target: TableName; readonly?: boolean };
type StorageInfo = {
	type: StorageType;
	bucket: BucketName;
	path: string;
	suffix?: string;
	readonly?: boolean;
};
type TableContent = {
	readonly?: boolean;
	description: string;
	metadata: Record<string, MetaDataInfo>;
	reference?: Record<string, ReferenceInfo>;
	storage?: Record<string, StorageInfo>;
};
type TableInfo = Record<TableName, TableContent>;

const TABLES_INFO: TableInfo = {
	regions: {
		description: '地點',
		metadata: {
			...ID,
			enabled: {
				type: 'toggle'
			},
			...NAME_AND_DESCRIPTION,
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
		description: '服裝與表情',
		metadata: {
			...ID,
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
				path: 'texture',
				suffix: '_basecolor'
			},
			texture_metallic: {
				type: 'webp',
				bucket: 'wearings',
				path: 'texture',
				suffix: '_metallic'
			},
			texture_roughness: {
				type: 'webp',
				bucket: 'wearings',
				path: 'texture',
				suffix: '_roughness'
			},
			texture_normal: {
				type: 'webp',
				bucket: 'wearings',
				path: 'texture',
				suffix: '_normal'
			}
		}
	},
	wearing_types: {
		description: '服裝類別',
		metadata: {
			...ID,
			...VALUE,
			...NAME_AND_DESCRIPTION
		}
	},
	body_parts: {
		readonly: true,
		description: '身體部位',
		metadata: {
			...ID,
			...VALUE
		}
	},
	meshes: {
		description: '3D 模型',
		metadata: {
			...ID,
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
		readonly: true,
		description: '材質類別',
		metadata: {
			...ID,
			...VALUE
		}
	}
} as const;

export type {
	Locale,
	AllTable,
	TableName,
	BucketName,
	MetaDataType,
	StorageType,
	ReferenceType,
	TableInfo,
	TableContent,
	MetaDataInfo,
	StorageInfo,
	ReferenceInfo
};

const NOTIFICATION_LAST_TIME = 10000;

export { TABLE_NAMES, TABLES_INFO, LOCALES, BUCKET_NAMES, NOTIFICATION_LAST_TIME };
