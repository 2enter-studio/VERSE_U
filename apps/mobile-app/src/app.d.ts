import type { Tables } from '@repo/shared/supatypes';
import type { Prettify } from '@repo/shared/utils';
import type { SponsorName } from '@repo/shared/config';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	type Named = { name: string };
	type Described = { description: string };

	type Region = Prettify<Tables<'regions'> & Named & Described>;

	type ChatMember = Prettify<Omit<Tables<'chats_members'>, 'user'> & { user: Tables<'profiles'> }>;
	type ChatRoom = Prettify<{
		id: string;
		chat_members: ChatMember[];
		chat_messages: Tables<'chat_messages'>[];
	}>;

	type WearingType = Prettify<Tables<'wearing_types'> & Named & Described>;
	type Mesh = Prettify<
		Tables<'meshes'> & {
			body_parts: { value: string }[];
		}
	>;

	type Wearing = Prettify<
		Omit<Tables<'wearings'>> &
			Named &
			Described & {
				category: Tables<'wearing_types'>;
				texture_types: Tables<'texture_types'>[];
			}
	>;

	type OwnedWearing = Prettify<{
		id: string;
		equipped: boolean;
	}>;

	type AssetMetadata = Prettify<{
		regions: Region[];
		wearings: Wearing[];
		owned_wearings: OwnedWearing[];
		meshes: Mesh[];
	}>;

	type Sponsor = Prettify<
		Tables<'sponsors'> & { value: SponsorName } & { coupons: Tables<'coupons'>[] } & {
			sponsor_wearings: { wearing: string }[];
		} & Named
	>;
}

export {};
