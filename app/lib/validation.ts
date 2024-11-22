import {
	email,
	object,
	pipe,
	safeParse,
	string,
	regex,
	optional,
	picklist,
	url,
} from 'valibot'

export const validate = safeParse

//→ REGISTER SCHEMA

export const registerSchema = object({
	username: pipe(
		string(),
		regex(
			/^(?!_)(?!.*__)[a-zA-Z0-9_]{5,20}$/,
			'Username must be 5-20 characters long, can only contain letters, numbers, and underscores, and cannot start or end with an underscore.'
		)
	),
	email: pipe(string(), email('You must provide a valid email address.')),
	password: pipe(
		string(),
		regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
			'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).'
		)
	),
})

//→ LOGIN SCHEMA

export const loginSchema = object({
	email: pipe(string(), email('You must provide a valid email address.')),
	password: string(),
})

// → UPDATE USER SCHEMA

export const updateUserSchema = object({
	username: optional(
		pipe(
			string(),
			regex(
				/^(?!_)(?!.*__)[a-zA-Z0-9_]{5,20}$/,
				'Username must be 5-20 characters long, can only contain letters, numbers, and underscores, and cannot start or end with an underscore.'
			)
		)
	),
	email: optional(
		pipe(string(), email('You must provide a valid email address.'))
	),
	status: optional(pipe(string(), picklist(['online', 'offline'], 'online'))),
	avatarUrl: optional(pipe(string(), url())),
})
