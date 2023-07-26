import jwt from 'jsonwebtoken';
import config from '../application/environment.js';

export const authMiddleware = async (req, res, next) => {
	const token = req.cookies.access_token;
	if (!token) {
		return res.status(401).json({
			success: false,
			message: 'No Token'
		});
	}
	jwt.verify(token, config.jwt_secret, async (error, payload) => {
		if (error) {
			return res.status(403).json({
				success: false,
				message: 'Invalid token'
			});
		}
		req.user = {
			username: payload.username
		};
		next();
	});
};
