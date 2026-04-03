import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
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
  const online = searchParams.get("online");
  const search = searchParams.get("search");
  const excludeSquad = searchParams.get("excludeSquad");
  const sortBy = searchParams.get("sortBy") || "rating";
  const limit = parseInt(searchParams.get("limit") || "20");
  const cursor = searchParams.get("cursor");

  const query: Record<string, unknown> = {};
  if (university) query.university = university;
  if (online === "true") query.isOnline = true;
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  if (excludeSquad === "true") {
    query.squadId = { $exists: false };
  }

  // Exclude the requesting user from results
  const currentUser = await User.findOne({ clerkId: userId });
  if (currentUser) {
    query._id = { $ne: currentUser._id };
  }

  const sortOptions: Record<string, 1 | -1> = {};
  if (sortBy === "rating") sortOptions.rating = -1;
  else if (sortBy === "coins") sortOptions.friendCoins = -1;
  else sortOptions.createdAt = -1;

  if (cursor) {
    query._id = { ...((query._id as object) || {}), $gt: cursor };
  }

  let userQuery = User.find(query).sort(sortOptions).limit(limit + 1);

  const users = await userQuery.exec();
  const hasNext = users.length > limit;
  const resultUsers = hasNext ? users.slice(0, limit) : users;
  const nextCursor = hasNext
    ? resultUsers[resultUsers.length - 1]._id.toString()
    : null;

  return Response.json({ users: resultUsers, nextCursor });
}
