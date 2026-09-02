"use client";

import { useSignUp } from "@/hooks/useSignUp";
import { authService } from "@/services/auth.service";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Divider } from "./divider";
import { SocialButtons } from "./social-buttons";

type CreateAccountFormProps = {
  onSuccess?: () => void;
};

const inputClass =
  "rounded-none border-x-0 border-t-0 border-b border-zinc-300 bg-transparent shadow-none focus-visible:ring-0 focus-visible:border-zinc-900 px-0 h-10 placeholder:text-zinc-300";
const labelClass =
  "block text-label-sm font-semibold tracking-widest text-zinc-400 mb-1.5";

export function CreateAccountForm({ onSuccess }: CreateAccountFormProps) {
  const {
    email,
    setEmail,
    phone,
    setPhone,
    password,
    setPassword,
    confirm,
    setConfirm,
    loading,
    handleSignUp,
  } = useSignUp(onSuccess);

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="mb-2">
        <h2 className="font-headline text-[2rem] text-zinc-900 leading-tight mb-1">
          Create account.
        </h2>
        <p className="text-sm text-sky-500">
          Join us and start your curated journey.
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
        <Label className={labelClass}>PHONE NUMBER</Label>
        <Input
          type="tel"
          placeholder="+62 812 3456 7890"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClass}
          required
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

      <div>
        <Label className={labelClass}>CONFIRM PASSWORD</Label>
        <Input
          type="password"
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-zinc-900 text-white text-xs font-semibold tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors disabled:opacity-60"
      >
        {loading ? <Spinner className="size-4 text-white" /> : "CREATE ACCOUNT"}
      </button>

      <Divider />
      <SocialButtons
        onOAuth={(p: "google" | "apple") => authService.signInWithOAuth(p)}
      />
    </form>
  );
}
