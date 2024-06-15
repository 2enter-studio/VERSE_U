import type { Tables } from '@/types/supabase';
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

	type Profile = Tables<'profiles'>;
	type Region = Tables<'regions'> & { name?: string; description?: string };

	type ChatMessage = Tables<'chat_messages'>;
	type ChatMember = { agree: boolean; profiles: Profile };
	type Chatroom = { id: string; chat_members: ChatMember[]; chat_messages: ChatMessage[] };

	type WearingType = { id: string; value: string } & Named;
	type Wearing = Tables<'wearings'> &
		Named &
		Described & {
			category: string;
			texture_types: { id: string; value: string }[];
			body_parts: { id: string; value: string }[];
		};
}

export {};
