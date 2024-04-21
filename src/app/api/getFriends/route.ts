import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  const { userId, authToken } = await req.json();
  try {
    const response = await fetch(`http://localhost:8080/friends/${userId}`, {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = await response.json().then((data) => data);

    return Response.json({ ok: true, response: data });
  } catch {
    return Response.json({ ok: false });
  }
}
