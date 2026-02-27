import jwt from 'jsonwebtoken';
import { UsersCollection } from '../db/models/auth.js';

export const authenticateOptional = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization || '';
        const [bearer, token] = authHeader.split(' ');

        if (bearer === 'Bearer' && token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await UsersCollection.findById(decoded.id);

            if (user) {
                req.user = user;
            }
        }

        next();
    } catch (err) {
        next();
    }
};