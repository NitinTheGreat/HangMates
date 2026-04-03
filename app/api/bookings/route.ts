import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Booking from "@/models/Booking";
import { checkBookingConflict } from "@/lib/booking-lock";
import { transferCoins } from "@/lib/transaction-helper";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const currentUser = await User.findOne({ clerkId: userId });
  if (!currentUser) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const role = searchParams.get("role") || "both";

  const query: Record<string, unknown> = {};

  if (role === "renter") {
    query.renterId = currentUser._id;
  } else if (role === "mate") {
    query.mateId = currentUser._id;
  } else {
    query.$or = [
      { renterId: currentUser._id },
      { mateId: currentUser._id },
    ];
  }

  if (status) query.status = status;

  const bookings = await Booking.find(query)
    .populate("renterId", "name profileImage")
    .populate("mateId", "name profileImage")
    .sort({ scheduledDate: -1 });

  return Response.json({ bookings });
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const renter = await User.findOne({ clerkId: userId });
  if (!renter) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const body = await request.json();
  const {
    mateId,
    squadId,
    mateIds,
    occasion,
    customOccasion,
    scheduledDate,
    startTime,
    endTime,
    message,
  } = body;

  if (!occasion || !scheduledDate || !startTime || !endTime) {
    return Response.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Calculate duration in minutes
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  const duration = (endH * 60 + endM) - (startH * 60 + startM);

  if (duration <= 0) {
    return Response.json({ error: "Invalid time range" }, { status: 400 });
  }

  // Check booking conflict for the mate
  if (mateId) {
    const { hasConflict } = await checkBookingConflict(
      mateId,
      new Date(scheduledDate),
      startTime,
      endTime
    );

    if (hasConflict) {
      return Response.json(
        { error: "This mate has a conflicting booking at the requested time" },
        { status: 409 }
      );
    }
  }

  // Calculate cost
  const mate = mateId ? await User.findById(mateId) : null;
  const hours = duration / 60;
  const friendCoinsCharged = Math.ceil(hours * (mate?.ratePerHour || 30));

  // Check renter balance
  if (renter.friendCoins < friendCoinsCharged) {
    return Response.json(
      { error: "Insufficient FriendCoins" },
      { status: 402 }
    );
  }

  // Create booking
  const booking = await Booking.create({
    renterId: renter._id,
    mateId: mateId || undefined,
    squadId: squadId || undefined,
    mateIds: mateIds || undefined,
    occasion,
    customOccasion,
    scheduledDate: new Date(scheduledDate),
    startTime,
    endTime,
    duration,
    message,
    friendCoinsCharged,
    status: "pending",
  });

  // Transfer coins
  if (mate) {
    await transferCoins(
      renter._id,
      mate._id,
      friendCoinsCharged,
      `Booking with ${mate.name}`,
      booking._id
    );
  }

  return Response.json({ booking }, { status: 201 });
}
