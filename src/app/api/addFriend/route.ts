import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  const { name, userId, friendId } = await req.json();

  try {
    await fetch('http://localhost:8080/addFriend', {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, userId, friendId }),
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false });
  }
}
