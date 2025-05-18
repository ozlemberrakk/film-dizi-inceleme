import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Tüm alanlar doldurulmalıdır." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { username, email, password: hashedPassword, role: "USER" },
    });

    return NextResponse.json(
      { success: true, user: { id: newUser.id, username, email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("🔥 REGISTER ERROR:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const field = error.meta?.target?.[0] || "Alan";
      return NextResponse.json(
        { success: false, message: `${field} zaten kullanılıyor.` },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, message: `Sunucu hatası: ${error.message}` },
      { status: 500 }
    );
  }
}
