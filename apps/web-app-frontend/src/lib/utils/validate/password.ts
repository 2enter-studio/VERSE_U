import { z } from 'zod';

const PwdSchema = z.string().min(8);

function password(password: string) {
	return PwdSchema.safeParse(password).success;
}

export { password };
