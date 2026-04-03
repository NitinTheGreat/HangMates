import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ITransaction extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: "earned" | "spent" | "received" | "purchased" | "gifted" | "refund";
  amount: number;
  description: string;
  relatedBooking?: Types.ObjectId;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["earned", "spent", "received", "purchased", "gifted", "refund"],
      required: true,
    },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    relatedBooking: { type: Schema.Types.ObjectId, ref: "Booking" },
    balanceBefore: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
  },
  { timestamps: true }
);

// Indexes
TransactionSchema.index({ userId: 1, createdAt: -1 });

const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;
