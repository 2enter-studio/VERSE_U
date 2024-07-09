import { STORAGE_BASEPATH } from '$env/static/public';
import type { Tables } from '@repo/shared/supatypes';

const BUCKET_NAMES = ['wearings', 'meshes'] as const;
const TEXTURE_TYPES = ['baseColor', 'metallic', 'normal', 'roughness'] as const;

const STORAGE_BASE = STORAGE_BASEPATH ?? 'storage';
const METADATA_FILE = `${STORAGE_BASE}/metadata.json`;
const EMPTY_METADATA = { wearings: [], meshes: [] };

type BucketName = (typeof BUCKET_NAMES)[number];
type MetaData = { [P in BucketName]: Tables<P>[] };

type PlayerWearing = {
	id: string;
	mesh: string;
	is_expression: boolean;
};

type Player = Tables<'profiles'> & {
	wearings: PlayerWearing[];
};

type UEPlayer = {
	id: string;
	name: string;
	wearings: PlayerWearing[];
	skinCol: { X: number; Y: number; Z: number };
};

type UEPlayerBundle = {
	avatars: UEPlayer[];
};

export type { Tables, MetaData, BucketName, UEPlayerBundle, UEPlayer, Player };

const HAI_AN_CALL_TIMEOUT = 3000;

export {
	BUCKET_NAMES,
	STORAGE_BASE,
	METADATA_FILE,
	TEXTURE_TYPES,
	EMPTY_METADATA,
	HAI_AN_CALL_TIMEOUT
};
