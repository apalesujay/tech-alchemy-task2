import { DateTime } from 'luxon';
import { Document, Schema, model } from 'mongoose';

import { compareHash, createHash } from '../utils/hash';

type comparePasswordFunction = (password: string) => boolean;

export interface UserDocument extends Document {
	name: string;
	email: string;
	password: string;
	devices?: [
		{
			refreshToken: string;
			expiresAt: Date;
		}
	];
	comparePassword: comparePasswordFunction;
	createdAt: Date;
	updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true
		},
		password: {
			type: String,
			required: true,
			select: false
		},
		devices: [
			{
				refreshToken: {
					type: String,
					required: true,
					unique: true,
					sparse: true
				},
				expiresAt: {
					type: Date,
					required: true,
					default: DateTime.now().plus({ months: 1 }).toJSDate()
				},
				_id: false
			}
		]
	},
	{ timestamps: true }
);

// Method to convert the plain password string into hashed string
async function save(this: any, next: any) {
	const user = this as UserDocument;

	if (!user.isModified('password')) {
		return next();
	}

	const hashed = await createHash(user.password);
	user.password = hashed;
	return next();
}

UserSchema.pre('save', save);

// Method to compare the plain password with the hashed password from the database
async function comparePassword(this: any, password: string) {
	const isMatch = await compareHash(password, this.password);

	return isMatch;
}

UserSchema.method('comparePassword', comparePassword);

export const User = model<UserDocument>('User', UserSchema);
