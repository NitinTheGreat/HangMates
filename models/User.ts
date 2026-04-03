import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  clerkId: string;
  name: string;
  email: string;
  age?: number;
  gender?: "male" | "female" | "non-binary" | "prefer-not-to-say";
  department?: string;
  year?: number;
  university?: string;
  bio?: string;
  profileImage?: string;
  role: "mate" | "renter" | "both";
  stats: {
    humor: number;
    energy: number;
    chillFactor: number;
    foodieScore: number;
    hypeFactor: number;
    empathy: number;
    photography: number;
    conversationDepth: number;
    punctuality: number;
    adventure: number;
  };
  badges: Array<{
    badgeType: string;
    count: number;
    lastAwarded: Date;
  }>;
  friendCoins: number;
  availability: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }>;
  isOnline: boolean;
  rating: number;
  totalBookings: number;
  squadId?: Types.ObjectId;
  occasionTags: string[];
  onboardingComplete: boolean;
  ratePerHour: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number },
    gender: {
      type: String,
      enum: ["male", "female", "non-binary", "prefer-not-to-say"],
    },
    department: { type: String },
    year: { type: Number },
    university: { type: String },
    bio: { type: String },
    profileImage: { type: String },
    role: {
      type: String,
      enum: ["mate", "renter", "both"],
      default: "both",
    },
    stats: {
      humor: { type: Number, default: 50, min: 0, max: 100 },
      energy: { type: Number, default: 50, min: 0, max: 100 },
      chillFactor: { type: Number, default: 50, min: 0, max: 100 },
      foodieScore: { type: Number, default: 50, min: 0, max: 100 },
      hypeFactor: { type: Number, default: 50, min: 0, max: 100 },
      empathy: { type: Number, default: 50, min: 0, max: 100 },
      photography: { type: Number, default: 50, min: 0, max: 100 },
      conversationDepth: { type: Number, default: 50, min: 0, max: 100 },
      punctuality: { type: Number, default: 50, min: 0, max: 100 },
      adventure: { type: Number, default: 50, min: 0, max: 100 },
    },
    badges: [
      {
        badgeType: { type: String },
        count: { type: Number, default: 0 },
        lastAwarded: { type: Date },
      },
    ],
    friendCoins: { type: Number, default: 100 },
    availability: [
      {
        dayOfWeek: { type: Number, min: 0, max: 6 },
        startTime: { type: String },
        endTime: { type: String },
        isAvailable: { type: Boolean, default: true },
      },
    ],
    isOnline: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
    squadId: { type: Schema.Types.ObjectId, ref: "Squad" },
    occasionTags: [{ type: String }],
    onboardingComplete: { type: Boolean, default: false },
    ratePerHour: { type: Number, default: 30 },
  },
  { timestamps: true }
);

// Indexes
UserSchema.index({ clerkId: 1 }, { unique: true });
UserSchema.index({ university: 1, isOnline: -1, rating: -1 });
UserSchema.index({ squadId: 1 });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
