import { Router } from "express";
import UserModel from "../models/User";
import { ensureAuth } from "../middleware/ensureAuth";

const router = Router();

/**
 * GET /api/users/me
 * Return the authenticated user's information.  Protected route.
 */
router.get("/me", ensureAuth, (req, res) => {
  res.json({ user: req.user });
});

/**
 * GET /api/users/:id
 * Retrieve a specific user's public profile.  Omits sensitive token fields.
 */
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select(
      "-refreshToken -accessToken"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
