const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

export function getRecaptchaSiteKey(): string | null {
  const { RECAPTCHA_SITE_KEY, RECAPTCHA_SECRET_KEY } = process.env;
  return RECAPTCHA_SITE_KEY && RECAPTCHA_SECRET_KEY ? RECAPTCHA_SITE_KEY : null;
}

// reCAPTCHA is only enforced once both keys are configured, so the form keeps working before setup.
export function isRecaptchaEnabled(): boolean {
  return getRecaptchaSiteKey() !== null;
}

export async function verifyRecaptcha(token: string | undefined, remoteIp?: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret || !token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  const response = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) throw new Error(`reCAPTCHA verification request failed with status ${response.status}`);

  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}
