import { z } from 'zod';

const UUIDSchema = z.string().uuid();

function uuid(uuid: string) {
	return UUIDSchema.safeParse(uuid).success;
}

export { uuid };
