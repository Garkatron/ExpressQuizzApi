import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extend the Express Request interface to include the user object
interface User {
    id: string;
    username: string;
    email?: string;
    permissions?: Record<string, boolean>;
}

interface AuthenticatedRequest extends Request {
    user?: User | JwtPayload;
}

/**
 * Middleware to authenticate the requester using their session token.
 * If valid, attaches the user object to `req.user`.
 */
export function middleware_authenticate_token(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void {
    const header = req.headers["authorization"];
    const token = header?.split(" ")[1];

    if (!token) {
        res.status(401).json({ success: false, message: "Without token" });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
        if (err) {
            res.status(403).json({ success: false, message: "Invalid Token" });
            return;
        }

        req.user = user as User;
        next();
    });
}

/**
 * Middleware to check if the authenticated user has the required permissions.
 * Returns 403 if the user lacks any of the specified permissions.
 * @param requiredPermissions - Array of permission names required for this endpoint
 */
export function authorize_permissions(requiredPermissions: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        const userPermissions = req.user?.permissions || {};
        const hasPermission = requiredPermissions.every(p => userPermissions[p] === true);

        if (!hasPermission) {
            res.status(403).json({
                success: false,
                message: "Forbidden",
                errors: ["You don't have the required permissions"],
            });
            return;
        }

        next();
    };
}
