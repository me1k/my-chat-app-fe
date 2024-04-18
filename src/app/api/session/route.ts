import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  const { username } = await req.json();

  try {
    const session = await fetch('http://localhost:8080/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    console.log({ session });
    return Response.json({ ok: true, session });
  } catch {
    return Response.json({ ok: false });
  }
}
