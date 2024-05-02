import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    //Check if token exists
    if (!req.headers.get('Authorization')) {
      throw new Error('Token is missing');
    }

    // Make request to external API
    const response = await fetch('http://localhost:8080/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.get('Authorization') || '',
      },
    });

    // Parse response JSON data
    const { ok, user } = await response
      .json()
      .then(({ ok, user }) => ({ ok, user }));

    if (!ok) {
      throw new Error('Failed to fetch user');
    }

    // Return response indicating success
    return NextResponse.json({ ok: true, user });
  } catch (error: any) {
    console.error('Error:', error);
    // Return response indicating failure
    return NextResponse.json({ ok: false, error: error.message });
  }
}
