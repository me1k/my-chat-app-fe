import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const response = await fetch(`http://localhost:8080/friends/`, {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.get('Authorization') as string,
      },
    });

    const data = await response.json().then((data) => data);
    console.log({ data });
    return Response.json({ ok: true, response: data });
  } catch {
    return Response.json({ ok: false });
  }
}
