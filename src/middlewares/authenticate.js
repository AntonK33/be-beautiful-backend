import createHttpError from "http-errors";
import { SessionCollection } from "../db/models/session.js";
import { UsersCollection } from "../db/models/auth.js";

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || "";
        const [bearer, token] = authHeader.split(" ");

        if (bearer !== "Bearer" || !token) {
            throw createHttpError(401, "Not authorized");
        }

        const session = await SessionCollection.findOne({ accessToken: token });
        if (!session) throw createHttpError(401, "Invalid token");

        const user = await UsersCollection.findById(session.userId);
        if (!user) throw createHttpError(401, "User not found");

        req.user = user; 
        next();
    } catch (err) {
        next(createHttpError(401, "Not authorized"));
    }
};