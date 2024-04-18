import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  const { username, password } = await req.json();

  try {
    const res = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const { user, session, token } = await res.json().then((data) => data);

    return Response.json({
      ok: true,
      status: 200,
      response: { user, session, token },
    });
  } catch {
    return Response.json({ ok: false, status: 401 });
  }
}
