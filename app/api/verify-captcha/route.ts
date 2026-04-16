export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return Response.json(
        { success: false, message: "No token" },
        { status: 400 }
      );
    }

    const secret = process.env.RECAPTCHA_SECRET_KEY;

    const res = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${secret}&response=${token}`,
      }
    );

    const data = await res.json();

    return Response.json(data);
  } catch (err) {
    return Response.json(
      { success: false, error: err },
      { status: 500 }
    );
  }
}