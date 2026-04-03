import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Booking from "@/models/Booking";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectToDatabase();

  const booking = await Booking.findById(id)
    .populate("renterId", "name profileImage email")
    .populate("mateId", "name profileImage email stats");

  if (!booking) {
    return Response.json({ error: "Booking not found" }, { status: 404 });
  }

  return Response.json({ booking });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectToDatabase();

  const currentUser = await User.findOne({ clerkId: userId });
  if (!currentUser) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const booking = await Booking.findById(id);
  if (!booking) {
    return Response.json({ error: "Booking not found" }, { status: 404 });
  }

  const body = await request.json();
  const { status, review } = body;

  // Validate who can update
  const isRenter = booking.renterId.toString() === currentUser._id.toString();
  const isMate = booking.mateId?.toString() === currentUser._id.toString();

  if (!isRenter && !isMate) {
    return Response.json(
      { error: "You are not authorized to update this booking" },
      { status: 403 }
    );
  }

  // Status transition rules
  const allowedTransitions: Record<string, { next: string[]; by: string }> = {
    pending: { next: ["confirmed", "declined", "cancelled"], by: "both" },
    confirmed: { next: ["active", "cancelled"], by: "both" },
    active: { next: ["completed"], by: "both" },
  };

  if (status) {
    const transition = allowedTransitions[booking.status];
    if (!transition || !transition.next.includes(status)) {
      return Response.json(
        { error: `Cannot transition from ${booking.status} to ${status}` },
        { status: 400 }
      );
    }

    booking.status = status;

    // Increment total bookings if completed
    if (status === "completed") {
      if (booking.mateId) {
        await User.findByIdAndUpdate(booking.mateId, {
          $inc: { totalBookings: 1 },
        });
      }
      await User.findByIdAndUpdate(booking.renterId, {
        $inc: { totalBookings: 1 },
      });
    }
  }

  if (review) {
    booking.review = { ...review, reviewedAt: new Date() };
  }

  booking.version += 1;
  await booking.save();

  return Response.json({ booking });
}
