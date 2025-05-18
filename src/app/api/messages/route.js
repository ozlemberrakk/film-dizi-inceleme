import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Kullanıcının gönderdiği ve aldığı mesajlar
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: decoded.id },
          { receiverId: decoded.id },
        ]
      },
      include: {
        sender: { select: { id: true, username: true } },
        receiver: { select: { id: true, username: true } }
      },
      orderBy: {
        id: 'asc'
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('API /messages GET error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { receiverId, content } = body;

    if (!receiverId || !content) {
      return NextResponse.json({ error: "Eksik parametre" }, { status: 400 });
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId: decoded.id,
        receiverId,
        content,
      }
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('API /messages POST error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
