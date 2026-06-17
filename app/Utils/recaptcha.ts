type RecaptchaVerifyResponse = {
  success?: boolean;
  score?: number;
  message?: string;
};

const RECAPTCHA_SCRIPT_ID = "google-recaptcha-v3";
const RECAPTCHA_CHECKING_CLASS = "recaptcha-checking";
const RECAPTCHA_TIMEOUT_MS = 12000;
let recaptchaScriptPromise: Promise<void> | null = null;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}

function loadRecaptchaScript(siteKey: string) {
  if (window.grecaptcha) return Promise.resolve();
  if (recaptchaScriptPromise) return recaptchaScriptPromise;

  recaptchaScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(
      RECAPTCHA_SCRIPT_ID
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if (existingScript.dataset.loaded === "true") {
        resolve();
        return;
      }

      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load reCAPTCHA")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.id = RECAPTCHA_SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error("Failed to load reCAPTCHA"));
    document.head.appendChild(script);
  });

  return recaptchaScriptPromise;
}

function withTimeout<T>(promise: PromiseLike<T>) {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error("reCAPTCHA verification timed out"));
    }, RECAPTCHA_TIMEOUT_MS);

    Promise.resolve(promise).then(
      (value) => {
        window.clearTimeout(timeoutId);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timeoutId);
        reject(error);
      }
    );
  });
}

export async function verifyRecaptcha(action: string) {
  const siteKey = process.env.NEXT_PUBLIC_ReCAPTCHA_SITE_KEY;

  if (!siteKey) {
    throw new Error("Missing reCAPTCHA site key");
  }

  if (typeof window === "undefined") return;

  document.documentElement.classList.add(RECAPTCHA_CHECKING_CLASS);

  try {
    await withTimeout(loadRecaptchaScript(siteKey));

    if (!window.grecaptcha) {
      throw new Error("reCAPTCHA is not ready");
    }

    await withTimeout(
      new Promise<void>((resolve) => {
        window.grecaptcha?.ready(resolve);
      })
    );

    const token = await withTimeout(
      window.grecaptcha.execute(siteKey, { action })
    );

    if (!token) {
      throw new Error("Missing reCAPTCHA token");
    }

    const response = await withTimeout(
      fetch("/api/verify-captcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          action,
        }),
      })
    );

    const data = (await response.json()) as RecaptchaVerifyResponse;

    if (!response.ok || !data.success || (data.score ?? 0) < 0.5) {
      throw new Error(data.message || "reCAPTCHA verification failed");
    }
  } finally {
    document.documentElement.classList.remove(RECAPTCHA_CHECKING_CLASS);
  }
}
