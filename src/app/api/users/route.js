import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const users = await prisma.user.findMany({
      where: {
        id: { not: decoded.id },
        role: { not: 'ADMIN' },
      },
      select: {
        id: true,
        username: true,
        email: true, 
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('API /users error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(req.url);
    const userId = url.searchParams.get('id');
    if (!userId) return NextResponse.json({ error: "Eksik kullanıcı ID" }, { status: 400 });

    if (userId === decoded.id || decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: "Kullanıcı silindi" });
  } catch (error) {
    console.error('API DELETE /users error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
