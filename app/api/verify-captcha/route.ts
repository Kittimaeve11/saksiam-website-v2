export async function POST(req: Request) {
  try {
    const { token, action } = await req.json();

    if (!token) {
      return Response.json(
        { success: false, message: "No token" },
        { status: 400 }
      );
    }

    const secret = process.env.RECAPTCHA_SECRET_KEY;

    if (!secret) {
      return Response.json(
        { success: false, message: "Missing reCAPTCHA secret" },
        { status: 500 }
      );
    }

    const res = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret,
          response: token,
        }),
      }
    );

    const data = await res.json();

    if (action && data.action && data.action !== action) {
      return Response.json(
        {
          ...data,
          success: false,
          message: "Invalid reCAPTCHA action",
        },
        { status: 400 }
      );
    }

    return Response.json(data);
  } catch (err) {
    return Response.json(
      { success: false, error: err },
      { status: 500 }
    );
  }
}
