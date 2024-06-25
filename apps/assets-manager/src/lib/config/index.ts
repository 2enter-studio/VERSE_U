const TABLE_NAMES = [
	'app_versions',
	'maintenance',
	'regions',
	'wearings',
	'meshes',
	'wearing_types',
	'texture_types',
	'body_parts'
] as const;

const ALL_TABLE_NAMES = [
	...TABLE_NAMES,
	'ml_texts',
	'j-wearings-texture_types',
	'j-wearings-body_parts'
] as const;

const LOCALES = ['zh', 'en'] as const;
const BUCKET_NAMES = ['wearings', 'regions', 'meshes'] as const;
const METADATA_TYPES = ['toggle', 'number', 'plain_text', 'ml_texts', 'datetime'] as const;
const STORAGE_TYPES = ['webp', 'fbx', 'glb'] as const;
const REFERENCE_TYPES = ['single_ref', 'multi_ref'] as const;

type AllTableName = (typeof ALL_TABLE_NAMES)[number];
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

const CREATED_AT = {
	created_at: {
		type: 'datetime',
		readonly: true
	}
} as const;

const UPDATED_AT = {
	updated_at: {
		type: 'datetime',
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
	app_versions: {
		description: 'App 版本更新資訊',
		metadata: {
			...ID,
			...CREATED_AT,
			...VALUE,
			...NAME_AND_DESCRIPTION
		}
	},
	maintenance: {
		description: '系統維護',
		metadata: {
			...ID,
			start: {
				type: 'datetime'
			},
			end: {
				type: 'datetime'
			},
			...NAME_AND_DESCRIPTION
		}
	},
	regions: {
		description: '地點',
		metadata: {
			...ID,
			...CREATED_AT,
			...UPDATED_AT,
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
			sticker: {
				type: 'webp',
				bucket: 'regions',
				path: 'stickers'
			},
			background: {
				type: 'webp',
				bucket: 'regions',
				path: 'backgrounds'
			}
		}
	},
	wearings: {
		description: '服裝與表情',
		metadata: {
			...ID,
			...CREATED_AT,
			...UPDATED_AT,
			...NAME_AND_DESCRIPTION
		},
		reference: {
			category: {
				type: 'single_ref',
				target: 'wearing_types'
			},
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
			thumbnail: {
				type: 'webp',
				bucket: 'wearings',
				path: 'thumbnails'
			},
			texture_baseColor: {
				type: 'webp',
				bucket: 'wearings',
				path: 'textures',
				suffix: '_baseColor'
			},
			texture_metallic: {
				type: 'webp',
				bucket: 'wearings',
				path: 'textures',
				suffix: '_metallic'
			},
			texture_roughness: {
				type: 'webp',
				bucket: 'wearings',
				path: 'textures',
				suffix: '_roughness'
			},
			texture_normal: {
				type: 'webp',
				bucket: 'wearings',
				path: 'textures',
				suffix: '_normal'
			}
		}
	},
	wearing_types: {
		description: '服裝類別',
		metadata: {
			...ID,
			...CREATED_AT,
			is_expression: {
				type: 'toggle'
			},
			...VALUE,
			...NAME_AND_DESCRIPTION
		}
	},
	body_parts: {
		readonly: true,
		description: '身體部位',
		...CREATED_AT,
		metadata: {
			...ID,
			...VALUE
		}
	},
	meshes: {
		description: '3D 模型',
		metadata: {
			...ID,
			...CREATED_AT,
			...UPDATED_AT,
			...NAME_AND_DESCRIPTION
		},
		storage: {
			glb: {
				type: 'glb',
				bucket: 'meshes',
				path: 'glb'
			},
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
	AllTableName,
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

export { TABLE_NAMES, ALL_TABLE_NAMES, TABLES_INFO, LOCALES, BUCKET_NAMES };
