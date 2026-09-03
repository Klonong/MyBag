import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleDashed } from "lucide-react";

export function AdminModuleLanding({
  eyebrow,
  title,
  description,
  icon: Icon,
  items,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  items: { label: string; detail: string; ready: boolean }[];
  action?: { href: string; label: string };
}) {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="mb-3 flex size-11 items-center justify-center bg-tertiary/10 text-tertiary">
            <Icon className="size-5" strokeWidth={1.7} />
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">
            {eyebrow}
          </p>
          <h1 className="font-headline text-4xl font-bold">{title}</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
            {description}
          </p>
        </div>
        {action && (
          <Link
            href={action.href}
            className="hidden shrink-0 items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white sm:inline-flex"
          >
            {action.label}
            <ArrowRight className="size-4" />
          </Link>
        )}
      </div>
      <div className="border border-zinc-200 bg-white">
        {items.map(({ label, detail, ready }) => (
          <div
            key={label}
            className="flex items-center gap-4 border-b border-zinc-100 px-5 py-5 last:border-0"
          >
            <div
              className={`flex size-9 shrink-0 items-center justify-center ${ready ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-zinc-400"}`}
            >
              {ready ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <CircleDashed className="size-4" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{label}</p>
              <p className="mt-1 text-xs leading-5 text-zinc-500">{detail}</p>
            </div>
            <span
              className={`text-[0.65rem] font-semibold uppercase tracking-[0.15em] ${ready ? "text-emerald-600" : "text-zinc-400"}`}
            >
              {ready ? "Available" : "API needed"}
            </span>
          </div>
        ))}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white sm:hidden"
        >
          {action.label}
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
