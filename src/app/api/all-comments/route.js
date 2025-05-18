import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const comments = await prisma.comment.findMany({
    include: {
      user: true,
      movie: true,
    },
    orderBy: { id: "desc" },
  });

  return new Response(JSON.stringify(comments), { status: 200 });
}
