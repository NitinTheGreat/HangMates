import { getCurrentUser } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json({ user });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const body = await request.json();

  // Whitelist updateable fields
  const allowedFields = [
    "name",
    "age",
    "gender",
    "department",
    "year",
    "university",
    "bio",
    "profileImage",
    "role",
    "stats",
    "availability",
    "occasionTags",
    "onboardingComplete",
    "ratePerHour",
  ];

  const updates: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  }

  const updatedUser = await User.findByIdAndUpdate(user._id, updates, {
    new: true,
    runValidators: true,
  });

  return Response.json({ user: updatedUser });
}
