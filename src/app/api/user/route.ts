import { NextRequest, NextResponse } from 'next/server';
import { Server } from 'socket.io';

// export async function POST(req: NextRequest, res: NextResponse) {
//   const { id } = await req.json();

//   try {
//     const res = await fetch('http://localhost:8080/user', {
//       cache: 'no-store',
//       next: { revalidate: 0 },
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ id }),
//     });

//     const user = await res.json().then((data) => data);
//     console.log({ user });
//     return Response.json({ ok: true, data: user });
//   } catch {
//     return Response.json({ ok: false });
//   }
// }

export async function POST(req: Request, res: Response) {
  const { token } = await req.json();

  try {
    const user = await fetch('http://localhost:8080/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());

    return Response.json({ ok: true, user });
  } catch {
    return Response.json({ ok: false });
  }
}
