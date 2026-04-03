import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import Squad from "@/models/Squad";
import User from "@/models/User";

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

  const squad = await Squad.findById(id)
    .populate("members", "name profileImage rating stats isOnline")
    .populate("creatorId", "name profileImage");

  if (!squad) {
    return Response.json({ error: "Squad not found" }, { status: 404 });
  }

  return Response.json({ squad });
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
  const squad = await Squad.findById(id);

  if (!squad) {
    return Response.json({ error: "Squad not found" }, { status: 404 });
  }

  if (squad.creatorId.toString() !== currentUser?._id.toString()) {
    return Response.json({ error: "Only the creator can update this squad" }, { status: 403 });
  }

  const body = await request.json();
  const allowedFields = ["name", "tagline", "bannerImage", "members", "ratePerHour"];
  const updates: Record<string, unknown> = {};

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  }

  const updatedSquad = await Squad.findByIdAndUpdate(id, updates, { new: true });

  return Response.json({ squad: updatedSquad });
}

export async function DELETE(
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
  const squad = await Squad.findById(id);

  if (!squad) {
    return Response.json({ error: "Squad not found" }, { status: 404 });
  }

  if (squad.creatorId.toString() !== currentUser?._id.toString()) {
    return Response.json({ error: "Only the creator can delete this squad" }, { status: 403 });
  }

  // Remove squadId from all members
  await User.updateMany(
    { squadId: squad._id },
    { $unset: { squadId: "" } }
  );

  await Squad.findByIdAndDelete(id);

  return Response.json({ success: true });
}
