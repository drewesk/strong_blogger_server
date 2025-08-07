import { Request, Response, NextFunction } from "express";

/**
 * Middleware that ensures a user is authenticated before allowing access to the
 * next route handler.  If the request is not authenticated, a 401 response is
 * returned.  Passport attaches `isAuthenticated()` to the request object.
 */
export function ensureAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Passport augments the request with an isAuthenticated() function when
  // sessions are enabled.  This check prevents unauthenticated users from
  // accessing protected routes.
  if (typeof (req as any).isAuthenticated === "function" && (req as any).isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Not authenticated" });
}
