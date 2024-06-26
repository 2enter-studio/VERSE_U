import { db } from '@/db';
import { authState } from '@/states';
import { validate, createError } from '@/utils';

// Send a password reset email to the given email address
async function forgotPwd(email: string) {
	if (!validate.email(email)) {
		return createError('INVALID_EMAIL');
	}
	const { error } = await db.auth.resetPasswordForEmail(email);
	if (error) return createError('OPERATION_FAILED');
}

// Set a new password for the current auth
async function setPwd(password: string) {
	if (!validate.password(password)) return createError('INVALID_PASSWORD');
	const { error } = await db.auth.updateUser({ password });
	if (error) return createError('OPERATION_FAILED');

	{
		const { error } = await db.auth.getSession();
		if (error) return createError('OPERATION_FAILED');
	}
}

// Change the current auth's password after verifying the old password
async function changePwd(oldPassword: string, newPassword: string) {
	if (!validate.password(oldPassword) || !validate.password(newPassword))
		return createError('INVALID_PASSWORD');

	const sessionBackup = authState.session;

	// Return an error if there is no session found
	if (!sessionBackup) return createError('MUST_LOGIN_FIRST');

	// Return an error if there is no email found
	if (!sessionBackup.user.email) return createError('ACCOUNT_NOT_FOUND');

	const { error } = await db.auth.signInWithPassword({
		email: sessionBackup.user.email,
		password: oldPassword
	});

	if (error) {
		// To prevent auto logout, restore the session
		authState.session = sessionBackup;
		return createError('OPERATION_FAILED');
	} else {
		const result = await setPwd(newPassword);
		if (result?.error) {
			return createError('OPERATION_FAILED');
		}
	}
}

export { setPwd, forgotPwd, changePwd };
