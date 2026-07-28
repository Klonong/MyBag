export type OAuthProvider = "google" | "apple";

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 814 1000" fill="currentColor" aria-hidden>
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-42.3-155.5-127.4C46.7 790 0 663 0 541.8c0-207.8 135.4-317.8 268.3-317.8 33.6 0 61.2 25.6 89.2 25.6s51.3-26.3 90.6-26.3c34.3 0 142.8 28.6 177.1 131.9 4.3.6 26.9 7.1 57.1 26.3zM528.5 29.9c-11.6 44.9-41.6 78.5-69.6 94.2-27.9 15.7-73.8 27.4-103.1 27.4-.6-2.5-1.3-8.4-1.3-11.6 0-40.2 25.6-80.2 52.2-105.2 29.3-27.4 86.6-52.6 129.4-54.5 1.3 3.2 2.6 9.7 2.6 14.1 0 2.5-.7 6.4-1.9 11.4h-8.3z" />
    </svg>
  );
}

export function SocialButtons({ onOAuth }: { onOAuth: (provider: OAuthProvider) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => onOAuth("google")}
        className="h-10 border border-zinc-200 flex items-center justify-center gap-2 text-label-sm font-semibold tracking-widest text-zinc-600 hover:bg-zinc-50 transition-colors"
      >
        <GoogleIcon />
        GOOGLE
      </button>
      <button
        type="button"
        onClick={() => onOAuth("apple")}
        className="h-10 border border-zinc-200 flex items-center justify-center gap-2 text-label-sm font-semibold tracking-widest text-zinc-600 hover:bg-zinc-50 transition-colors"
      >
        <AppleIcon />
        APPLE
      </button>
    </div>
  );
}
