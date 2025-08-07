import { Router } from "express";
import Message from "../models/Message";
import { ensureAuth } from "../middleware/ensureAuth";

const router = Router();

/**
 * GET /api/messages
 * Retrieve messages where the authenticated user is the recipient.  Populates
 * sender information for display.
 */
router.get("/", ensureAuth, async (req, res) => {
  try {
    const userId = (req.user as any)._id;
    const messages = await Message.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .populate("sender", "displayName email photo");
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

/**
 * POST /api/messages
 * Send a new message to another user.  Requires a recipient and a body in the
 * request payload.
 */
router.post("/", ensureAuth, async (req, res) => {
  try {
    const { recipient, body } = req.body;
    if (!recipient || !body) {
      return res.status(400).json({ error: "recipient and body are required" });
    }
    const message = new Message({
      sender: (req.user as any)._id,
      recipient,
      body,
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

/**
 * GET /api/messages/:id
 * Retrieve a specific message by ID.  Only the sender or recipient may view the
 * message.
 */
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id).populate(
      "sender",
      "displayName email photo"
    );
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    const userId = (req.user as any)._id.toString();
    if (
      message.recipient.toString() !== userId &&
      message.sender.toString() !== userId
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch message" });
  }
});

/**
 * DELETE /api/messages/:id
 * Delete a specific message.  Only the sender or recipient may delete it.
 */
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    const userId = (req.user as any)._id.toString();
    if (
      message.recipient.toString() !== userId &&
      message.sender.toString() !== userId
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }
    await message.deleteOne();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});

export default router;
