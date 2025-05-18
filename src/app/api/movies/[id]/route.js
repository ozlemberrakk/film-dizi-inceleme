import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const movie = await prisma.movie.findUnique({
      where: { id: Number(id) },
    });

    if (!movie) {
      return new Response(JSON.stringify({ error: "Film bulunamadı" }), { status: 404 });
    }

    return new Response(JSON.stringify(movie), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Sunucu hatası" }), { status: 500 });
  }
}
