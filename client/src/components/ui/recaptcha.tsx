import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'expired-callback': () => void;
          'error-callback': () => void;
        },
      ) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

const SCRIPT_ID = 'google-recaptcha-script';
let scriptPromise: Promise<void> | null = null;

function loadRecaptchaScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error('Failed to load reCAPTCHA'));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export interface RecaptchaHandle {
  reset: () => void;
}

interface RecaptchaProps {
  siteKey: string;
  onChange: (token: string | null) => void;
}

const Recaptcha = forwardRef<RecaptchaHandle, RecaptchaProps>(({ siteKey, onChange }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (widgetId.current !== null) window.grecaptcha?.reset(widgetId.current);
      onChangeRef.current(null);
    },
  }));

  useEffect(() => {
    let cancelled = false;

    loadRecaptchaScript()
      .then(() => {
        window.grecaptcha?.ready(() => {
          if (cancelled || !containerRef.current || widgetId.current !== null) return;
          widgetId.current = window.grecaptcha!.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token) => onChangeRef.current(token),
            'expired-callback': () => onChangeRef.current(null),
            'error-callback': () => onChangeRef.current(null),
          });
        });
      })
      .catch((error) => console.error(error));

    return () => {
      cancelled = true;
      widgetId.current = null;
      onChangeRef.current(null);
    };
  }, [siteKey]);

  return <div ref={containerRef} />;
});

Recaptcha.displayName = 'Recaptcha';

export default Recaptcha;
