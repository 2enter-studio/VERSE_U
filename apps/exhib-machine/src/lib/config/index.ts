import { STORAGE_BASEPATH } from '$env/static/private';
import type { Tables } from '@/config/supabase';

const BUCKET_NAMES = ['wearings', 'meshes'] as const;
const TEXTURE_TYPES = ['baseColor', 'metallic', 'normal', 'roughness'] as const;

const STORAGE_BASE = STORAGE_BASEPATH ?? 'storage';
const METADATA_FILE = `${STORAGE_BASE}/metadata.json`;
const EMPTY_METADATA = { wearings: [], meshes: [] };

type BucketName = (typeof BUCKET_NAMES)[number];
type MetaData = { [P in BucketName]: Tables<P>[] };

type Player = Tables<'profiles'> & { wearings: { id: string; mesh: string }[] };
type UEPlayer = {
	id: string;
	wearings: { id: string; mesh: string }[];
	skinCol: { X: number; Y: number; Z: number };
};

type UEPlayerBundle = {
	avatars: UEPlayer[];
};

export type { Tables, MetaData, BucketName, UEPlayerBundle, UEPlayer, Player };

export default {
	BUCKET_NAMES,
	STORAGE_BASE,
	METADATA_FILE,
	TEXTURE_TYPES,
	EMPTY_METADATA,
	HAI_AN_CALL_TIMEOUT: 3000
	// META_DATA_UPDATE_TIMEOUT: 3000
} as const;
