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

  // Validation
  if (body.age !== undefined) {
    const age = Number(body.age);
    if (age < 16 || age > 35) {
      return Response.json(
        { error: "Age must be between 16 and 35" },
        { status: 400 }
      );
    }
  }

  if (body.bio !== undefined && body.bio.length > 200) {
    return Response.json(
      { error: "Bio must be 200 characters or less" },
      { status: 400 }
    );
  }

  if (body.stats) {
    for (const [key, value] of Object.entries(body.stats)) {
      const num = Number(value);
      if (num < 0 || num > 100) {
        return Response.json(
          { error: `Stat "${key}" must be between 0 and 100` },
          { status: 400 }
        );
      }
    }
  }

  if (
    body.onboardingComplete === true &&
    body.occasionTags &&
    body.occasionTags.length === 0
  ) {
    return Response.json(
      { error: "Select at least 1 occasion tag" },
      { status: 400 }
    );
  }

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
