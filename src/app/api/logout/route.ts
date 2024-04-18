import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  const { token } = await req.json();
  
  try {
    const result = await fetch('http://localhost:8080/logout', {
      cache: 'no-store',
      next: { revalidate: 0 },
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await result.json().then((data) => data);
    console.log({ data });
    return Response.json({ ok: true, response: { data } });
  } catch {
    return Response.json({ ok: false });
  }
}
