import { cache } from "react";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "./db";
import User from "@/models/User";

export const getCurrentUser = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  await connectToDatabase();

  const user = await User.findOne({ clerkId: userId });
  return user;
});
