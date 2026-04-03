import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
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
  const limit = parseInt(searchParams.get("limit") || "20");
  const cursor = searchParams.get("cursor");

  let query = Transaction.find({ userId: currentUser._id })
    .sort({ createdAt: -1 })
    .limit(limit + 1);

  if (cursor) {
    query = query.where("_id").lt(cursor);
  }

  const transactions = await query.exec();
  const hasNext = transactions.length > limit;
  const result = hasNext ? transactions.slice(0, limit) : transactions;
  const nextCursor = hasNext
    ? result[result.length - 1]._id.toString()
    : null;

  return Response.json({ transactions: result, nextCursor });
}
