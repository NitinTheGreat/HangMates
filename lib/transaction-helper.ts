import mongoose, { Types, ClientSession } from "mongoose";
import connectToDatabase from "./db";
import User from "@/models/User";
import Transaction from "@/models/Transaction";

export class InsufficientFundsError extends Error {
  constructor(message = "Insufficient FriendCoins balance") {
    super(message);
    this.name = "InsufficientFundsError";
  }
}

export async function transferCoins(
  fromUserId: Types.ObjectId,
  toUserId: Types.ObjectId,
  amount: number,
  description: string,
  bookingId?: Types.ObjectId,
  session?: ClientSession
): Promise<{ senderTx: InstanceType<typeof Transaction>; receiverTx: InstanceType<typeof Transaction> }> {
  await connectToDatabase();

  const useSession = session ?? (await mongoose.startSession());
  const isOwnSession = !session;

  try {
    if (isOwnSession) useSession.startTransaction();

    // Get sender's current balance
    const sender = await User.findById(fromUserId).session(useSession);
    if (!sender || sender.friendCoins < amount) {
      throw new InsufficientFundsError();
    }

    const senderBalanceBefore = sender.friendCoins;

    // Deduct from sender with atomic check
    const deductResult = await User.findOneAndUpdate(
      { _id: fromUserId, friendCoins: { $gte: amount } },
      { $inc: { friendCoins: -amount } },
      { session: useSession, new: true }
    );

    if (!deductResult) {
      throw new InsufficientFundsError();
    }

    // Credit to receiver
    const receiver = await User.findById(toUserId).session(useSession);
    const receiverBalanceBefore = receiver?.friendCoins ?? 0;

    await User.findByIdAndUpdate(
      toUserId,
      { $inc: { friendCoins: amount } },
      { session: useSession }
    );

    // Create transaction records
    const senderTx = await Transaction.create(
      [
        {
          userId: fromUserId,
          type: "spent",
          amount,
          description,
          relatedBooking: bookingId,
          balanceBefore: senderBalanceBefore,
          balanceAfter: senderBalanceBefore - amount,
        },
      ],
      { session: useSession }
    );

    const receiverTx = await Transaction.create(
      [
        {
          userId: toUserId,
          type: "earned",
          amount,
          description,
          relatedBooking: bookingId,
          balanceBefore: receiverBalanceBefore,
          balanceAfter: receiverBalanceBefore + amount,
        },
      ],
      { session: useSession }
    );

    if (isOwnSession) await useSession.commitTransaction();

    return { senderTx: senderTx[0], receiverTx: receiverTx[0] };
  } catch (error) {
    if (isOwnSession) await useSession.abortTransaction();
    throw error;
  } finally {
    if (isOwnSession) useSession.endSession();
  }
}

export async function splitPayment(
  fromUserId: Types.ObjectId,
  toMemberIds: Types.ObjectId[],
  totalAmount: number,
  description: string,
  bookingId?: Types.ObjectId
) {
  await connectToDatabase();

  const session = await mongoose.startSession();
  const perMemberAmount = Math.floor(totalAmount / toMemberIds.length);
  const results = [];

  try {
    session.startTransaction();

    for (const memberId of toMemberIds) {
      const result = await transferCoins(
        fromUserId,
        memberId,
        perMemberAmount,
        description,
        bookingId,
        session
      );
      results.push(result);
    }

    await session.commitTransaction();
    return results;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
