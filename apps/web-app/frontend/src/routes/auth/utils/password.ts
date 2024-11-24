import { authState } from '@/states';
import { validate, createError } from '@/utils';
import * as authApi from '@/api/auth';

// Send a password reset email to the given email address
async function forgotPwd(email: string) {
	if (!validate.email(email)) {
		return createError('INVALID_EMAIL');
	}
	const { error } = await authApi.forgetPassword(email);
	if (error) return createError('OPERATION_FAILED');
}

// Set a new password for the current auth
async function setPwd(password: string) {
	if (!validate.password(password)) return createError('INVALID_PASSWORD');
	const { error: setPasswordError } = await authApi.setPassword(password);
	if (setPasswordError) return createError('OPERATION_FAILED');

	const { error: sessionError } = await authApi.getSession();
	if (sessionError) return createError('OPERATION_FAILED');
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

	const { error } = await authApi.login(sessionBackup.user.email, oldPassword);

	if (error) {
		// To prevent auto logout, restore the session
		authState.session = sessionBackup;
		return createError('OPERATION_FAILED');
	} else {
		const result = await authApi.setPassword(newPassword);
		if (result?.error) {
			return createError('OPERATION_FAILED');
		}
	}
}

export { setPwd, forgotPwd, changePwd };
