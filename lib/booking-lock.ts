import connectToDatabase from "./db";
import Booking, { IBooking } from "@/models/Booking";
import { Types } from "mongoose";

export async function checkBookingConflict(
  mateId: string,
  scheduledDate: Date,
  startTime: string,
  endTime: string,
  excludeBookingId?: string
): Promise<{ hasConflict: boolean; conflictingBooking?: IBooking }> {
  await connectToDatabase();

  const startOfDay = new Date(scheduledDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(scheduledDate);
  endOfDay.setHours(23, 59, 59, 999);

  const query: Record<string, unknown> = {
    mateId: new Types.ObjectId(mateId),
    scheduledDate: { $gte: startOfDay, $lte: endOfDay },
    status: { $in: ["pending", "confirmed", "active"] },
  };

  if (excludeBookingId) {
    query._id = { $ne: new Types.ObjectId(excludeBookingId) };
  }

  const existingBookings = await Booking.find(query);

  for (const booking of existingBookings) {
    // Check time overlap: existing.startTime < requestedEndTime AND existing.endTime > requestedStartTime
    if (booking.startTime < endTime && booking.endTime > startTime) {
      return { hasConflict: true, conflictingBooking: booking };
    }
  }

  return { hasConflict: false };
}

export async function checkSquadAvailability(
  memberIds: string[],
  scheduledDate: Date,
  startTime: string,
  endTime: string
): Promise<{ available: boolean; unavailableMembers: string[] }> {
  const unavailableMembers: string[] = [];

  for (const memberId of memberIds) {
    const { hasConflict } = await checkBookingConflict(
      memberId,
      scheduledDate,
      startTime,
      endTime
    );
    if (hasConflict) {
      unavailableMembers.push(memberId);
    }
  }

  return {
    available: unavailableMembers.length === 0,
    unavailableMembers,
  };
}
