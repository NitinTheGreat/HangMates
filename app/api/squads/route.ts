import mongoose from "mongoose";
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

  const squads = await Squad.find(query)
    .populate("members", "name profileImage rating")
    .populate("creatorId", "name profileImage");

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

  if (currentUser.squadId) {
    return Response.json(
      { error: "You are already in a squad" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { name, tagline, bannerImage, ratePerHour, memberIds } = body;

  if (!name || !name.trim()) {
    return Response.json(
      { error: "Squad name is required" },
      { status: 400 }
    );
  }

  const allMemberIds = [
    currentUser._id,
    ...(memberIds || []).map((id: string) => new mongoose.Types.ObjectId(id)),
  ];

  if (allMemberIds.length < 2) {
    return Response.json(
      { error: "A squad needs at least 2 members" },
      { status: 400 }
    );
  }

  if (allMemberIds.length > 10) {
    return Response.json(
      { error: "A squad can have at most 10 members" },
      { status: 400 }
    );
  }

  // Validate all members exist and are available
  const members = await User.find({
    _id: { $in: allMemberIds },
  });

  if (members.length !== allMemberIds.length) {
    return Response.json(
      { error: "One or more members not found" },
      { status: 404 }
    );
  }

  // Check no member is already in a squad (except creator already checked)
  for (const member of members) {
    if (
      member._id.toString() !== currentUser._id.toString() &&
      member.squadId
    ) {
      return Response.json(
        { error: `${member.name} is already in a squad` },
        { status: 400 }
      );
    }
  }

  // Check same university
  const universities = new Set(
    members.map((m) => m.university).filter(Boolean)
  );
  if (universities.size > 1) {
    return Response.json(
      { error: "All members must be from the same university" },
      { status: 400 }
    );
  }

  // Calculate synergy
  const avgStats = members.map((m) => {
    const s = m.stats;
    const vals = [
      s.humor,
      s.energy,
      s.chillFactor,
      s.foodieScore,
      s.hypeFactor,
      s.empathy,
      s.photography,
      s.conversationDepth,
      s.punctuality,
      s.adventure,
    ];
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  });
  const teamAvg = avgStats.reduce((a, b) => a + b, 0) / avgStats.length;
  const squadSynergy = Math.min(Math.round(teamAvg * 1.1), 100);

  const avgRating =
    members.reduce((a, m) => a + m.rating, 0) / members.length;

  // Use a session for atomicity
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const [squad] = await Squad.create(
      [
        {
          name: name.trim(),
          tagline: tagline?.trim() || undefined,
          bannerImage: bannerImage || undefined,
          members: allMemberIds,
          creatorId: currentUser._id,
          squadSynergy,
          overallRating: Math.round(avgRating * 10) / 10,
          university: currentUser.university || "Unknown",
          ratePerHour: ratePerHour || 50,
        },
      ],
      { session }
    );

    await User.updateMany(
      { _id: { $in: allMemberIds } },
      { $set: { squadId: squad._id } },
      { session }
    );

    await session.commitTransaction();

    return Response.json({ squad }, { status: 201 });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
