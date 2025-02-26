import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.json({ user: decoded });
  } catch (error) {
    // Log the error to see more details if needed
    console.error('Error verifying token:', error);

    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
