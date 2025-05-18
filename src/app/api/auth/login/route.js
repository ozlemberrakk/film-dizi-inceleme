import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";  

export async function POST(req) {
  const body = await req.json();
  const { email, password } = body;

  // Kullanıcıyı veritabanından bul
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return new Response(JSON.stringify({ error: "E-posta veya şifre yanlış" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Şifreyi karşılaştır
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return new Response(JSON.stringify({ error: "E-posta veya şifre yanlış" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // JWT token'ı oluştur
  const token = jwt.sign(
    {
      email: user.email,
      role: user.role, 
      id: user.id,
      username: user.username
    },
    process.env.JWT_SECRET, 
    { expiresIn: "1h" }
  );

  return new Response(JSON.stringify({ token }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
