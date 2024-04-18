import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  const { username, password } = await req.json();

  try {
    const result = await fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await result.json().then((data) => data);

    return Response.json({ ok: true, response: data });
  } catch {
    return Response.json({ ok: false });
  }
}
