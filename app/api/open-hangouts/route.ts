import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import OpenHangout from "@/models/OpenHangout";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status") || "upcoming";

  const hangouts = await OpenHangout.find({ status })
    .populate("hostUserId", "name profileImage")
    .sort({ dateTime: 1 });

  return Response.json({ hangouts });
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const currentUser = await User.findOne({ clerkId: userId });
  if (!currentUser) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const body = await request.json();
  const { title, description, location, dateTime, maxSpots, friendCoinsCost } =
    body;

  if (!title || !location || !dateTime || !maxSpots) {
    return Response.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const hangout = await OpenHangout.create({
    hostUserId: currentUser._id,
    hostSquadId: currentUser.squadId || undefined,
    title,
    description,
    location,
    dateTime: new Date(dateTime),
    maxSpots,
    currentParticipants: [currentUser._id],
    friendCoinsCost: friendCoinsCost || 0,
  });

  return Response.json({ hangout }, { status: 201 });
}
