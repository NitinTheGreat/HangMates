import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Transaction from "@/models/Transaction";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return Response.json(
      { message: "Webhook not configured. Users are created on first login." },
      { status: 200 }
    );
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return Response.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return Response.json({ error: "Error verifying webhook" }, { status: 400 });
  }

  await connectToDatabase();

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, first_name, last_name, email_addresses, image_url } = evt.data;
    const email = email_addresses?.[0]?.email_address ?? "";
    const name = [first_name, last_name].filter(Boolean).join(" ") || "User";

    const user = await User.create({
      clerkId: id,
      name,
      email,
      profileImage: image_url,
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

    await Transaction.create({
      userId: user._id,
      type: "received",
      amount: 100,
      description: "Welcome bonus! 🎉",
      balanceBefore: 0,
      balanceAfter: 100,
    });
  }

  if (eventType === "user.updated") {
    const { id, first_name, last_name, email_addresses, image_url } = evt.data;
    const email = email_addresses?.[0]?.email_address;
    const name = [first_name, last_name].filter(Boolean).join(" ");

    await User.findOneAndUpdate(
      { clerkId: id },
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(image_url && { profileImage: image_url }),
      }
    );
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;
    await User.findOneAndDelete({ clerkId: id });
  }

  return Response.json({ success: true }, { status: 200 });
}
