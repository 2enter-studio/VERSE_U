export const corsHeaders = {
	'Access-Control-Allow-Origin': '*', // Adjust this to more strict domains as necessary
	'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	'Access-Control-Allow-Headers': 'content-type, authorization, x-client-info, apikey',
	'Content-Type': 'application/json'
} as const;
