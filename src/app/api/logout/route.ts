import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {  
  try {
    const result = await fetch('http://localhost:8080/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.headers.get('Authorization')}`,
      },
    });

    const data = await result.json().then((data) => data);
    console.log({ data });
    return Response.json({ ok: true, response: { data } });
  } catch {
    return Response.json({ ok: false });
  }
}
