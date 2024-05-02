import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const result = await fetch('http://localhost:8080/refreshToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        mode: 'same-origin',
        redirect: 'follow',
        credentials: 'include',
      },
    });

    const data = await result.json().then((data) => data);
    console.log({ data });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false });
  }
}
