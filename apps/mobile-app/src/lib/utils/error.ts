import {
	FunctionsFetchError,
	FunctionsHttpError,
	FunctionsRelayError
} from '@supabase/supabase-js';
import type { TextCode } from '@/config/ui_texts/types';

function createError(message: TextCode, options?: ErrorOptions) {
	const error = new Error(message, options);
	return { error };
}

async function handleEFResponse(error: any, callback: Function) {
	if (error instanceof FunctionsHttpError) {
		const errorMessage = await error.context.json();
		console.log('Function returned an error', errorMessage);
	} else if (error instanceof FunctionsRelayError) {
		console.log('Relay error:', error.message);
	} else if (error instanceof FunctionsFetchError) {
		console.log('Fetch error:', error.message);
	} else {
		callback();
	}
}

export { createError, handleEFResponse };
