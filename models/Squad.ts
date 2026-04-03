import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ISquad extends Document {
  _id: Types.ObjectId;
  name: string;
  tagline?: string;
  bannerImage?: string;
  members: Types.ObjectId[];
  creatorId: Types.ObjectId;
  squadSynergy: number;
  overallRating: number;
  badges: Array<{
    badgeType: string;
    count: number;
    lastAwarded: Date;
  }>;
  totalBookings: number;
  university: string;
  isActive: boolean;
  ratePerHour: number;
  createdAt: Date;
  updatedAt: Date;
}

const SquadSchema = new Schema<ISquad>(
  {
    name: { type: String, required: true },
    tagline: { type: String },
    bannerImage: { type: String },
    members: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      validate: {
        validator: (v: Types.ObjectId[]) => v.length <= 10,
        message: "A squad can have a maximum of 10 members",
      },
    },
    creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    squadSynergy: { type: Number, default: 0 },
    overallRating: { type: Number, default: 0 },
    badges: [
      {
        badgeType: { type: String },
        count: { type: Number, default: 0 },
        lastAwarded: { type: Date },
      },
    ],
    totalBookings: { type: Number, default: 0 },
    university: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    ratePerHour: { type: Number, default: 50 },
  },
  { timestamps: true }
);

// Indexes
SquadSchema.index({ university: 1, isActive: 1 });
SquadSchema.index({ creatorId: 1 });

const Squad: Model<ISquad> =
  mongoose.models.Squad || mongoose.model<ISquad>("Squad", SquadSchema);

export default Squad;
