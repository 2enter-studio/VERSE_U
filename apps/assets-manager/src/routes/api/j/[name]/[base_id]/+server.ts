import { db } from '@/server/db';
import { json } from '@sveltejs/kit';
import pluralize from 'pluralize';

export const GET = async ({ params }) => {
	const { name, base_id } = params;

	const [base, target] = name.split('-');

	const { data, error } = await db.from(`j-${name}`).select(`${pluralize.singular(base)}(*),${pluralize.singular(target)}(*)`).eq(pluralize.singular(base), base_id);

	if (error) return json(error);

	return json(data);
};
