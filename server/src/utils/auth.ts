import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';
dotenv.config();

export const authenticateToken = ({ req }: any) => {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
        token = token.split(' ').pop().trim();
    }

    if (!token) {
        return req;
    }

    try {
        const { data }: any = jwt.verify(token, process.env.JWT_SECRET_KEY || '', { maxAge: '3h' });
        req.user = data;
    } catch (err) {
        console.log(err);
        throw new GraphQLError('Invalid token!');
    }

    return req;
};

export const signToken = (username: string, email: string, _id: unknown) => {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, process.env.JWT_SECRET_KEY || '', { expiresIn: '3h' });
};

export class AuthenticationError extends GraphQLError {
    constructor(message: string) {
        super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
        Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
    }
};