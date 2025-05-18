import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const movies = await prisma.movie.findMany();
    return NextResponse.json(movies);
  } catch (error) {
    console.error("GET Hatası:", error);
    return NextResponse.json({ error: "Filmler yüklenemedi." }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, details, image } = body;

    if (!title || !details) {
      return NextResponse.json({ error: "Başlık ve açıklama gerekli" }, { status: 400 });
    }

    const newMovie = await prisma.movie.create({
      data: {
        title,
        details,
        image: image || "",
      },
    });

    return NextResponse.json(newMovie, { status: 201 });
  } catch (error) {
    console.error("POST Hatası:", error);
    return NextResponse.json({ error: "Film eklenemedi" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, title, details, image } = body;

    if (!id || !title || !details) {
      return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
    }

    const updatedMovie = await prisma.movie.update({
      where: { id: parseInt(id) },
      data: {
        title,
        details,
        image: image || "",
      },
    });

    return NextResponse.json(updatedMovie);
  } catch (error) {
    console.error("PATCH Hatası:", error);
    return NextResponse.json({ error: "Film güncellenemedi" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json({ error: "Film ID gerekli" }, { status: 400 });
    }

    await prisma.movie.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Film başarıyla silindi" });
  } catch (error) {
    console.error("DELETE Hatası:", error);
    return NextResponse.json({ error: "Film silinemedi" }, { status: 500 });
  }
}
