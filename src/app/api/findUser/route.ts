export async function POST(req: Request, res: Response) {
  const { token, name } = await req.json();

  try {
    await fetch('http://localhost:8080/findUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false });
  }
}
