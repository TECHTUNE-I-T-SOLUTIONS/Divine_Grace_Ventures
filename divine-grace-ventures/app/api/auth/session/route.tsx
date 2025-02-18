// app/api/auth/session/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  // Get the auth-token cookie from the request
  const token = request.cookies.get('auth-token')?.value;
  console.log("Session endpoint token:", token);
  if (!token) {
    return NextResponse.json({ user: null });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    console.log("Decoded token:", decoded);
    return NextResponse.json({ user: decoded });
  } catch (err) {
    console.error('Session token verification error:', err);
    return NextResponse.json({ user: null });
  }
}
