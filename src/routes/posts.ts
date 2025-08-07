import { Router } from "express";
import Post from "../models/Post";
import { ensureAuth } from "../middleware/ensureAuth";

const router = Router();

/**
 * GET /api/posts
 * Returns a list of blog posts.  Supports optional query parameters for basic
 * pagination (page and limit) and tag filtering (tag).
 */
router.get("/", async (req, res) => {
  const page = parseInt((req.query.page as string) || "1", 10);
  const limit = parseInt((req.query.limit as string) || "10", 10);
  const tag = req.query.tag as string | undefined;
  const filter: any = {};
  if (tag) {
    filter.tags = tag;
  }
  try {
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "displayName email photo");
    const count = await Post.countDocuments(filter);
    res.json({
      data: posts,
      page,
      limit,
      total: count,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

/**
 * GET /api/posts/:id
 * Fetch a single post by its MongoDB ObjectId or unique slug.  Returns 404 if no
 * match is found.
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findOne({
      $or: [{ _id: id }, { slug: id }],
    }).populate("author", "displayName email photo");
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

/**
 * POST /api/posts
 * Create a new post.  Requires authentication.  Automatically sets the current
 * user as the author.  Ensures the slug is unique.
 */
router.post("/", ensureAuth, async (req, res) => {
  try {
    const { title, slug, content, tags } = req.body;
    if (!title || !slug || !content) {
      return res.status(400).json({ error: "title, slug and content are required" });
    }
    const existing = await Post.findOne({ slug });
    if (existing) {
      return res.status(400).json({ error: "slug already exists" });
    }
    const post = new Post({
      title,
      slug,
      content,
      tags: Array.isArray(tags) ? tags : [],
      author: (req.user as any)._id,
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to create post" });
  }
});

/**
 * PUT /api/posts/:id
 * Update an existing post.  Requires authentication and that the current user be
 * the author.  Replaces the entire post payload.
 */
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.author.toString() !== (req.user as any)._id.toString()) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const { title, slug, content, tags } = req.body;
    if (slug && slug !== post.slug) {
      const conflict = await Post.findOne({ slug });
      if (conflict) {
        return res.status(400).json({ error: "slug already exists" });
      }
    }
    post.title = title ?? post.title;
    post.slug = slug ?? post.slug;
    post.content = content ?? post.content;
    post.tags = Array.isArray(tags) ? tags : post.tags;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to update post" });
  }
});

/**
 * DELETE /api/posts/:id
 * Remove a post permanently.  Requires authentication and that the current user
 * be the author.  Returns 204 No Content on success.
 */
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.author.toString() !== (req.user as any)._id.toString()) {
      return res.status(403).json({ error: "Forbidden" });
    }
    await post.deleteOne();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

export default router;
