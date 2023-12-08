import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
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
    return new Response("Error occured", {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  switch (eventType) {
    case "user.created":
      await prisma.user.create({
        data: {
          id: evt.data.id,
          email: evt.data.email_addresses[0].email_address,
          name: `${evt.data.first_name} ${evt.data.last_name}`,
          profile: {
            create: {
              profileImage: evt.data.image_url,
            },
          },
        },
      });

      break;
    case "user.updated":
      await prisma.user.update({
        where: {
          id: evt.data.id,
        },
        data: {
          email: evt.data.email_addresses[0].email_address,
          name: `${evt.data.first_name} ${evt.data.last_name}`,
          profile: {
            update: {
              profileImage: evt.data.image_url,
            },
          },
        },
      });
      break;
    case "user.deleted":
      await prisma.user.delete({
        where: {
          id: evt.data.id,
        },
      });
      break;
    default:
      break;
  }

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  return new Response("", { status: 200 });
}
