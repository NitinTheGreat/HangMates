import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import Squad from "@/models/Squad";
import User from "@/models/User";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const searchParams = request.nextUrl.searchParams;
  const university = searchParams.get("university");

  const query: Record<string, unknown> = { isActive: true };
  if (university) query.university = university;

  const squads = await Squad.find(query).populate("members", "name profileImage rating").populate("creatorId", "name profileImage");

  return Response.json({ squads });
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
  const { name, tagline, memberIds } = body;

  if (!name) {
    return Response.json({ error: "Squad name is required" }, { status: 400 });
  }

  const squad = await Squad.create({
    name,
    tagline,
    members: [currentUser._id, ...(memberIds || [])],
    creatorId: currentUser._id,
    university: currentUser.university || "Unknown",
  });

  // Update squad reference on all members
  await User.updateMany(
    { _id: { $in: squad.members } },
    { $set: { squadId: squad._id } }
  );

  return Response.json({ squad }, { status: 201 });
}
