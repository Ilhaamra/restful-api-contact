import { logger } from '../application/logging.js';
import userServices from '../services/user-services.js';
import jwt from 'jsonwebtoken';
import config from '../application/environment.js';

const register = async (req, res, next) => {
	try {
		const result = await userServices.register(req.body);
		res.status(200).json({
			data: result
		});
	} catch (error) {
		next(error);
	}
};

const login = async (req, res, next) => {
	try {
		const result = await userServices.login(req.body);
		const payload = {
			username: result.username
		};
		const token = jwt.sign(payload, config.jwt_secret, { expiresIn: '1d' });
		res.cookie('access_token', token, {
			httpOnly: true
			// maxAge: 24 * 60 * 60 * 1000
		});
		res.status(200).json({
			data: result.username,
			token: token
		});
	} catch (error) {
		next(error);
	}
};

const getUser = async (req, res, next) => {
	try {
		const username = req.user.username;
		const result = await userServices.getUser(username);
		res.status(200).json({
			data: result
		});
	} catch (e) {
		next(e);
	}
};

const updateUser = async (req, res, next) => {
	try {
		const username = req.user.username;
		const request = req.body;
		request.username = username;
		const result = await userServices.updateUser(request);
		res.status(200).json({
			data: result
		});
	} catch (e) {
		next(e);
	}
};

const logout = async (req, res, next) => {
	try {
		userServices.logout(req, res);
		res.status(200).json({
			data: 'OK'
		});
	} catch (error) {
		next(error);
	}
};
export default {
	register,
	login,
	getUser,
	updateUser,
	logout
};
