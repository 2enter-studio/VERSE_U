import type { Tables } from '@repo/config/supatypes';
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

	type Region = Tables<'regions'> & { name?: string; description?: string };

	type ChatMember = { agree: boolean; profiles: Tables<'profiles'> };
	type Chatroom = {
		id: string;
		chat_members: ChatMember[];
		chat_messages: Tables<'chat_messages'>[];
	};

	type Wearing = Tables<'wearings'> &
		Named &
		Described & {
			category: string;
			texture_types: { id: string; value: string }[];
			body_parts: { id: string; value: string }[];
		};
}

export {};
