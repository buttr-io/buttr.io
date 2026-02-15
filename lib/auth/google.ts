export const googleProvider = {
  name: "google",

  getAuthorizationUrl() {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      response_type: "code",
      scope: "openid email profile",
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  },

  async exchangeCode(code: string) {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    const idToken = tokenData.id_token;

    const profile = JSON.parse(
      Buffer.from(idToken.split(".")[1], "base64").toString()
    );

    return {
      provider: "google",
      providerUserId: profile.sub,
      email: profile.email,
      rawProfile: profile,
    };
  },
};
