"use client";

import { Suspense } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLoginPage, type LoginTab } from "@/hooks/useLoginPage";
import { SignInForm } from "./_components/sign-in-form";
import { CreateAccountForm } from "./_components/create-account-form";

export default function LoginPage() {
  const {
    activeTab,
    setActiveTab,
    showSuccessDialog,
    setShowSuccessDialog,
    handleSignUpSuccess,
  } = useLoginPage();

  return (
    <div className="flex min-h-screen">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-zinc-900 flex-col justify-between p-12 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/login-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-zinc-900/55" />

        <div className="relative z-10 flex flex-col flex-1 justify-center items-center text-center gap-4">
          <h1 className="font-headline text-5xl font-bold text-white tracking-[0.25em]">
            MyBag
          </h1>
          <p className="text-zinc-300 text-sm max-w-65 leading-relaxed">
            Where traditional Indonesian craftsmanship meets contemporary
            international luxury.
          </p>
        </div>

        <div className="relative z-10 bg-black/40 backdrop-blur-sm rounded-xl p-5 border border-white/10">
          <p className="text-white text-label-sm font-semibold tracking-[0.2em] mb-1.5">
            CURATED ARCHIVE
          </p>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Explore our seasonal arrivals and discover the narrative of
            artisanal excellence.
          </p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col items-center justify-between bg-white px-8 py-10 lg:px-16">
        <div className="w-full max-w-sm flex-1 flex flex-col justify-center">
          <Suspense fallback={<div className="h-64" />}>
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as LoginTab)}
              className="w-full"
            >
              <TabsList
                variant="line"
                className="w-full justify-start rounded-none bg-transparent p-0 h-auto border-b border-zinc-200 mb-8 gap-0"
              >
                <TabsTrigger
                  value="sign-in"
                  className="rounded-none px-0 mr-6 pb-3 h-auto text-label-sm font-semibold tracking-widest data-active:text-zinc-900 text-zinc-400 data-active:border-b-2 data-active:border-zinc-900 after:hidden"
                >
                  SIGN IN
                </TabsTrigger>
                <TabsTrigger
                  value="create-account"
                  className="rounded-none px-0 pb-3 h-auto text-label-sm font-semibold tracking-widest data-active:text-zinc-900 text-zinc-400 data-active:border-b-2 data-active:border-zinc-900 after:hidden"
                >
                  CREATE ACCOUNT
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sign-in">
                <SignInForm />
              </TabsContent>

              <TabsContent value="create-account">
                <CreateAccountForm onSuccess={handleSignUpSuccess} />
              </TabsContent>
            </Tabs>
          </Suspense>
        </div>

        <p className="text-label-sm text-zinc-400 tracking-[0.2em] mt-8">
          HANDCRAFTED IN INDONESIA © 2024
        </p>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-md border-0 bg-white p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.18)]"
        >
          <div className="mx-auto mb-4 flex h-18 w-18 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-9 w-9 animate-[pulse_0.8s_ease-in-out_2]"
              aria-hidden="true"
            >
              <path d="M5 12.5 9.2 16.7 19 6.9" />
            </svg>
          </div>

          <DialogTitle className="font-headline text-3xl text-zinc-900">
            Account created
          </DialogTitle>

          <DialogDescription className="mt-2 text-sm leading-relaxed text-zinc-500">
            Your registration was successful. We&apos;re taking you back to the
            sign-in page.
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}

