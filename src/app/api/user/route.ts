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
