import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
    sub: string;
}

export function authenticated(req: Request, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization;

    if (!authToken) {
        return res.status(401).json({
            error: "token.invalid"
        });
    }

    const [, token] = authToken.split(" ");

    try {
        const { sub } = verify(token, process.env.JWT_TOKEN_NLW) as IPayload;

        req.user_id = sub;

        return next();
    } catch (err) {
        return res.status(401).json({
            error: "token.expired"
        });
    }
};