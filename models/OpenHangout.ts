import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IOpenHangout extends Document {
  _id: Types.ObjectId;
  hostSquadId?: Types.ObjectId;
  hostUserId: Types.ObjectId;
  title: string;
  description?: string;
  location: string;
  dateTime: Date;
  maxSpots: number;
  currentParticipants: Types.ObjectId[];
  status: "upcoming" | "live" | "completed" | "cancelled";
  friendCoinsCost: number;
  createdAt: Date;
  updatedAt: Date;
}

const OpenHangoutSchema = new Schema<IOpenHangout>(
  {
    hostSquadId: { type: Schema.Types.ObjectId, ref: "Squad" },
    hostUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String, required: true },
    dateTime: { type: Date, required: true },
    maxSpots: { type: Number, required: true },
    currentParticipants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["upcoming", "live", "completed", "cancelled"],
      default: "upcoming",
    },
    friendCoinsCost: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes
OpenHangoutSchema.index({ status: 1, dateTime: 1 });
OpenHangoutSchema.index({ hostUserId: 1 });

const OpenHangout: Model<IOpenHangout> =
  mongoose.models.OpenHangout ||
  mongoose.model<IOpenHangout>("OpenHangout", OpenHangoutSchema);

export default OpenHangout;
