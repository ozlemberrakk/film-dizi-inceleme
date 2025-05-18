import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';


// JWT doğrulama fonksiyonu
async function verifyJWT(token) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.error('JWT doğrulama hatası:', err);
    return null;
  }
}

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const user = await verifyJWT(token);

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/admin') && user.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url)); // anasayfaya yönlendir
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*','/movie/:path*'], 
};
