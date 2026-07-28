"use client";

import { signIn } from "next-auth/react";
import { useSignIn } from "@/hooks/useSignIn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Divider } from "./divider";
import { SocialButtons } from "./social-buttons";

const inputClass =
  "rounded-none border-x-0 border-t-0 border-b border-zinc-300 bg-transparent shadow-none focus-visible:ring-0 focus-visible:border-zinc-900 px-0 h-10 placeholder:text-zinc-300";
const labelClass =
  "block text-label-sm font-semibold tracking-widest text-zinc-400 mb-1.5";

export function SignInForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    loading,
    handleSignIn,
  } = useSignIn();

  return (
    <form onSubmit={handleSignIn} className="space-y-5">
      <div className="mb-2">
        <h2 className="font-headline text-[2rem] text-zinc-900 leading-tight mb-1">
          Welcome back.
        </h2>
        <p className="text-sm text-sky-500">
          Please enter your details to access your archive.
        </p>
      </div>

      <div>
        <Label className={labelClass}>EMAIL ADDRESS</Label>
        <Input
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      <div>
        <Label className={labelClass}>PASSWORD</Label>
        <Input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-xs text-zinc-500">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="size-3 accent-zinc-900"
          />
          Remember me
        </Label>
        <button
          type="button"
          className="text-xs text-zinc-400 hover:text-zinc-800 transition-colors"
        >
          Forgot Password?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-zinc-900 text-white text-xs font-semibold tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors disabled:opacity-60"
      >
        {loading ? <Spinner className="size-4 text-white" /> : "SIGN IN"}
      </button>

      <Divider />
      <SocialButtons onOAuth={(provider) => signIn(provider)} />
    </form>
  );
}
