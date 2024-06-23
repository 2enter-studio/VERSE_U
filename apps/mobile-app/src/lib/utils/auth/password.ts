import validate from '@/utils/validate';
import { db } from '@/db';
import { auth } from '../../states';
import { createError } from '../error';

// Send a password reset email to the given email address
async function forgotPwd(email: string) {
	if (!validate.email(email)) {
		return createError('invalid email');
	}
	const { error } = await db.auth.resetPasswordForEmail(email);
	if (error) return { error };
}

// Set a new password for the current auth
async function setPwd(password: string) {
	if (!validate.password(password)) return createError('invalid password');
	const { error } = await db.auth.updateUser({ password });
	if (error) return { error };

	{
		const { error } = await db.auth.getSession();
		if (error) return { error };
	}
}

// Change the current auth's password after verifying the old password
async function changePwd(oldPassword: string, newPassword: string) {
	if (!validate.password(oldPassword) || !validate.password(newPassword))
		return createError('invalid password');

	const sessionBackup = auth.session;

	// Return an error if there is no session found
	if (!sessionBackup) {
		return createError('you must be logged in to change your password');
	}

	// Return an error if there is no email found
	if (!sessionBackup.user.email) {
		return createError('no email found for the current auth, please log out and log back in');
	}

	const { error } = await db.auth.signInWithPassword({
		email: sessionBackup.user.email,
		password: oldPassword
	});

	if (error) {
		// To prevent auto logout, restore the session
		auth.session = sessionBackup;
		return { error };
	} else {
		const result = await setPwd(newPassword);
		if (result?.error) {
			return { error: result.error };
		}
	}
}

export { setPwd, forgotPwd, changePwd };
