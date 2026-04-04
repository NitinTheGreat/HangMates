import { cache } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "./db";
import User from "@/models/User";
import Transaction from "@/models/Transaction";

export const getCurrentUser = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  await connectToDatabase();

  // Try to find existing user
  let user = await User.findOne({ clerkId: userId });

  // Auto-create user if they don't exist (first login, no webhook needed)
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const name =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
      "User";
    const email = clerkUser.emailAddresses?.[0]?.emailAddress ?? "";

    user = await User.create({
      clerkId: userId,
      name,
      email,
      profileImage: clerkUser.imageUrl || "",
      friendCoins: 100,
      role: "both",
      onboardingComplete: false,
      stats: {
        humor: 50,
        energy: 50,
        chillFactor: 50,
        foodieScore: 50,
        hypeFactor: 50,
        empathy: 50,
        photography: 50,
        conversationDepth: 50,
        punctuality: 50,
        adventure: 50,
      },
    });

    // Welcome bonus transaction
    await Transaction.create({
      userId: user._id,
      type: "received",
      amount: 100,
      description: "Welcome bonus! 🎉",
      balanceBefore: 0,
      balanceAfter: 100,
    });
  }

  return user;
});
