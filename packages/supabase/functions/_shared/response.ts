import { corsHeaders } from './cors.ts';

function createError(message: string, options?: { status?: number, headers?: HeadersInit }) {
	console.log(message);
	return new Response(JSON.stringify({ error: message }), {
		status: options?.status ?? 400,
		headers: {
			...options?.headers ?? {},
			...corsHeaders
		}
	});
}

function createSuccess(data: any, options?: { status?: number, headers?: HeadersInit }) {
	return new Response(JSON.stringify(data), {
		status: options?.status ?? 200,
		headers: {
			...options?.headers ?? {},
			...corsHeaders
		}
	});
}

export { createError, createSuccess };