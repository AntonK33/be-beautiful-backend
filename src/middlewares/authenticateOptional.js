import jwt from 'jsonwebtoken';
import { UsersCollection } from '../db/models/auth.js';

export const authenticateOptional = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.split(' ')[1];

        if (!token) {
            req.user = null;
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id || decoded._id;
        const user = await UsersCollection.findById(userId);

        req.user = user || null;
        next();
    } catch (err) {
        req.user = null;
        next();
    }
};