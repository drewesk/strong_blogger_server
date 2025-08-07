import mongoose, { Document, Schema } from "mongoose";

/**
 * Interface for a blog post document.  Each post has a required title, a unique
 * slug used for friendly URLs, the body content, a reference to its author, and
 * optional tags.  Mongoose automatically adds createdAt and updatedAt fields
 * when the timestamps option is enabled.
 */
export interface Post extends Document {
  title: string;
  slug: string;
  content: string;
  author: mongoose.Types.ObjectId;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<Post>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tags: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Post>("Post", postSchema);
