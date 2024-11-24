import { z } from 'zod';

const EmailSchema = z.string().email();

function email(email: string) {
	return EmailSchema.safeParse(email).success;
}

export { email };
