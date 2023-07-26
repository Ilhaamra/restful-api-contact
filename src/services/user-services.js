import { validate } from '../validations/validation.js';
import {
	getUserValidation,
	loginValidation,
	registerValidation,
	updateUserValidation
} from '../validations/user-validaton.js';
import { prismaClient } from '../application/connection.js';
import { ResponseError } from '../errors/response-error.js';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

const register = async (request) => {
	const user = validate(registerValidation, request);
	const countUser = await prismaClient.user.count({
		where: {
			username: user.username
		}
	});
	if (countUser === 1) {
		throw new ResponseError(400, 'Username alrady exists');
	}

	user.password = await bcrypt.hash(user.password, 10);
	return prismaClient.user.create({
		data: user,
		select: {
			username: true,
			name: true
		}
	});
};

const login = async (register) => {
	const loginRequest = validate(loginValidation, register);

	const user = await prismaClient.user.findUnique({
		where: {
			username: loginRequest.username
		},
		select: {
			username: true,
			password: true
		}
	});
	if (!user) {
		throw new ResponseError(401, 'Username or Password wrong');
	}
	const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
	if (!isPasswordValid) {
		throw new ResponseError(401, 'Username or Password wrong');
	}
	return user;
};

const getUser = async (username) => {
	username = validate(getUserValidation, username);

	const user = await prismaClient.user.findUnique({
		where: {
			username: username
		},
		select: {
			username: true,
			name: true
		}
	});

	if (!user) {
		throw new ResponseError(404, 'user is not found');
	}

	return user;
};

const updateUser = async (request) => {
	const user = validate(updateUserValidation, request);
	const countUser = await prismaClient.user.count({
		where: {
			username: user.username
		}
	});
	if (countUser !== 1) {
		throw new ResponseError(404, 'user is not found');
	}
	const data = {};
	if (user.name) {
		data.name = user.name;
	}
	if (user.password) {
		data.password = await bcrypt.hash(user.password, 10);
	}

	return prismaClient.user.update({
		where: {
			username: user.username
		},
		data: data,
		select: {
			username: true,
			name: true
		}
	});
};

const logout = (req, res) => {
	const loggedIn = req.cookies.access_token;
	if (!loggedIn) {
		throw new ResponseError(401, 'Not logged in yet');
	}
	return res.clearCookie('access_token');
};
export default {
	register,
	login,
	getUser,
	updateUser,
	logout
};
