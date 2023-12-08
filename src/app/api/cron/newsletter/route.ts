// import { Resend } from "resend";
// import { EmailTemplate } from "@/components/email-template";
// import { headers } from "next/headers";
// import prisma from "@/lib/prisma";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function GET() {
//   try {
//     const headerPayload = headers();
//     const authToken = headerPayload.get("Authorization");
//     const CRON_SECRET = process.env.CRON_SECRET;

//     if (!authToken || authToken != `Bearer ${CRON_SECRET}`) {
//       return Response.json(
//         { error: "Unauthorized" },
//         {
//           status: 401,
//         }
//       );
//     }

//     const recentProducts = await prisma.product.findMany({
//       orderBy: {
//         createdAt: "desc",
//       },
//       take: 10,
//       include: {},
//     });

//     const data = await resend.emails.send({
//       from: "bu@resend.dev",
//       to: "leandro.dragani@gmail.com",
//       subject: "Receipt for Your Payment",
//       react: EmailTemplate({ firstName: "Test" }),
//     });

//     return Response.json(data);
//   } catch (error) {
//     return Response.json({ error });
//   }
// }
