import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get("movieId");

  if (!movieId) {
    return new Response("Film ID gerekli", { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { movieId: parseInt(movieId) },
    include: { user: true },
    orderBy: { id: "desc" },
  });

  return new Response(JSON.stringify(comments), { status: 200 });
}

export async function POST(req) {
  const body = await req.json();
  const { content, movieId, userId } = body;

  if (!content || !movieId || !userId) {
    return new Response("Eksik bilgi", { status: 400 });
  }

  const newComment = await prisma.comment.create({
    data: {
      content,
      movieId: parseInt(movieId),
      userId: parseInt(userId),
    },
  });

  return new Response(JSON.stringify(newComment), { status: 201 });
}

export async function DELETE(req) {
  const body = await req.json();
  const { id } = body;

  await prisma.comment.delete({ where: { id: parseInt(id) } });

  return new Response("Yorum silindi", { status: 200 });
}
