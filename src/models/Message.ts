import mongoose, { Document, Schema } from "mongoose";

/**
 * Interface for a direct message document.  Messages have a sender and a
 * recipient (both referencing the User model), the body of the message,
 * a read flag, and timestamps.
 */
export interface Message extends Document {
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  body: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<Message>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Message>("Message", messageSchema);
