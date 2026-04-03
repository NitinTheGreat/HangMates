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
  const sortBy = searchParams.get("sortBy") || "rating";
  const limit = parseInt(searchParams.get("limit") || "20");
  const cursor = searchParams.get("cursor");

  const query: Record<string, unknown> = {};
  if (university) query.university = university;
  if (online === "true") query.isOnline = true;

  const sortOptions: Record<string, 1 | -1> = {};
  if (sortBy === "rating") sortOptions.rating = -1;
  else if (sortBy === "coins") sortOptions.friendCoins = -1;
  else sortOptions.createdAt = -1;

  let userQuery = User.find(query).sort(sortOptions).limit(limit + 1);

  if (cursor) {
    userQuery = userQuery.where("_id").gt(cursor);
  }

  const users = await userQuery.exec();
  const hasNext = users.length > limit;
  const resultUsers = hasNext ? users.slice(0, limit) : users;
  const nextCursor = hasNext
    ? resultUsers[resultUsers.length - 1]._id.toString()
    : null;

  return Response.json({ users: resultUsers, nextCursor });
}
