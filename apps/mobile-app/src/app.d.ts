import type { Tables } from '@repo/shared/supatypes';
import type { Prettify } from '@repo/shared/utils';

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
	type Chatroom = Prettify<{
		id: string;
		chat_members: ChatMember[];
		chat_messages: Tables<'chat_messages'>[];
	}>;

	type WearingType = Prettify<Tables<'wearing_types'> & Named & Described>;
	type Wearing = Prettify<
		Tables<'wearings'> &
			Named &
			Described & {
				category: Tables<'wearing_types'>;
				texture_types: Tables<'texture_types'>[];
				body_parts: Tables<'body_parts'>[];
			}
	>;
}

export {};
