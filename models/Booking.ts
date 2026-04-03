import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IBooking extends Document {
  _id: Types.ObjectId;
  renterId: Types.ObjectId;
  mateId?: Types.ObjectId;
  squadId?: Types.ObjectId;
  mateIds?: Types.ObjectId[];
  occasion:
    | "birthday"
    | "movieBuddy"
    | "studyPartner"
    | "festivalSquad"
    | "chillHangout"
    | "wingman"
    | "justTalk"
    | "gymCompanion"
    | "explore"
    | "custom";
  customOccasion?: string;
  scheduledDate: Date;
  startTime: string;
  endTime: string;
  duration: number;
  status:
    | "pending"
    | "confirmed"
    | "active"
    | "completed"
    | "cancelled"
    | "declined";
  message?: string;
  friendCoinsCharged: number;
  iceBreaker?: {
    conversationStarters: string[];
    sharedPlaylist?: string;
    suggestedActivity?: string;
    suggestedLocation?: string;
  };
  review?: {
    vibeRating: number;
    badges: string[];
    comment?: string;
    reviewedAt: Date;
  };
  version: number;
  lockedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    renterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mateId: { type: Schema.Types.ObjectId, ref: "User" },
    squadId: { type: Schema.Types.ObjectId, ref: "Squad" },
    mateIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    occasion: {
      type: String,
      enum: [
        "birthday",
        "movieBuddy",
        "studyPartner",
        "festivalSquad",
        "chillHangout",
        "wingman",
        "justTalk",
        "gymCompanion",
        "explore",
        "custom",
      ],
      required: true,
    },
    customOccasion: { type: String },
    scheduledDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "active",
        "completed",
        "cancelled",
        "declined",
      ],
      default: "pending",
    },
    message: { type: String, maxlength: 500 },
    friendCoinsCharged: { type: Number, required: true },
    iceBreaker: {
      conversationStarters: [{ type: String }],
      sharedPlaylist: { type: String },
      suggestedActivity: { type: String },
      suggestedLocation: { type: String },
    },
    review: {
      vibeRating: { type: Number, min: 1, max: 5 },
      badges: [{ type: String }],
      comment: { type: String },
      reviewedAt: { type: Date },
    },
    version: { type: Number, default: 0 },
    lockedUntil: { type: Date },
  },
  { timestamps: true }
);

// Indexes
BookingSchema.index({ mateId: 1, scheduledDate: 1, status: 1 });
BookingSchema.index({ renterId: 1, status: 1 });
BookingSchema.index({ squadId: 1, scheduledDate: 1 });
BookingSchema.index({ status: 1, scheduledDate: 1 });

const Booking: Model<IBooking> =
  mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
