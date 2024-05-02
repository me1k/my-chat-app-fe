import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  const { username, password } = await req.json();

  try {
    const res = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        mode: 'same-origin',
        redirect: 'follow',
        withCredentials: 'true',
        credentials: 'include',
      },
      body: JSON.stringify({ username, password }),
    });

    const { user, session, accessToken } = await res
      .json()
      .then((data) => data);

    return NextResponse.json({
      ok: true,
      status: 200,
      response: { user, session, accessToken },
    });
  } catch {
    return NextResponse.json({ ok: false, status: 401 });
  }
}
