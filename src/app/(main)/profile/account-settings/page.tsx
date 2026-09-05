"use client";

import Image from "next/image";
import { User, Shield, Bell, LogOut, Monitor } from "lucide-react";
import { BasePageCenter, LeftAsideLayout } from "@/components/base";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAccountSettings } from "@/hooks/useAccountSettings";

const navItems = [
  { id: "personal", label: "Personal Information", icon: User },
  { id: "security", label: "Security & Password", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function AccountSettingsPage() {
  const {
    active,
    scrollTo,
    handleSignOut,
    name,
    setName,
    phone,
    setPhone,
    location,
    setLocation,
    bio,
    setBio,
    avatarUrl,
    setAvatarUrl,
    savingProfile,
    savePersonalInfo,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    changingPassword,
    updatePassword,
    sessions,
    sessionsLoading,
    revokingId,
    revokeSession,
  } = useAccountSettings();

  return (
    <BasePageCenter>
      <LeftAsideLayout
        aside={
          <nav className="flex flex-row sm:flex-col gap-1 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 -mx-2 px-2 sm:mx-0 sm:px-0">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-left w-full transition-colors whitespace-nowrap",
                  active === id
                    ? "font-semibold text-primary"
                    : "text-muted-foreground hover:text-primary",
                )}
              >
                <Icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}

            <div className="hidden sm:block mt-4">
              <Separator className="mb-4" />
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-destructive transition-colors w-full"
              >
                <LogOut className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                Sign Out
              </button>
            </div>
          </nav>
        }
      >
        <section id="personal" className="mb-10 md:mb-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-headline text-xl sm:text-2xl font-semibold text-primary">
                Personal Information
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Update your photo and personal details here.
              </p>
            </div>
            <Button size="sm" className="w-full sm:w-auto" disabled={savingProfile} onClick={() => void savePersonalInfo()}>
              {savingProfile ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          <div className="mb-6 md:mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
            <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-md overflow-hidden border border-secondary shrink-0">
              <Image
                src={avatarUrl || "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=240&fit=crop&crop=face"}
                alt="Profile photo"
                width={96}
                height={112}
                className="object-cover w-full h-full"
                unoptimized
              />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Photo URL
              </Label>
              <Input
                value={avatarUrl}
                onChange={(event) => setAvatarUrl(event.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mb-5">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Full Name
              </Label>
              <Input value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Phone Number
              </Label>
              <Input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Location
              </Label>
              <Input value={location} onChange={(event) => setLocation(event.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Bio / Craft Preference
            </Label>
            <Textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={3}
            />
          </div>
        </section>

        <section id="security" className="mt-10 md:mt-14">
          <div className="mb-4">
            <h2 className="font-headline text-xl sm:text-2xl font-semibold text-primary">
              Security
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your account credentials and security settings.
            </p>
          </div>
          <Separator className="mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div>
              <p className="text-sm font-semibold text-primary mb-3">
                Recent Activity
              </p>
              <div className="flex flex-col gap-3">
                {sessionsLoading ? (
                  <p className="text-sm text-muted-foreground">Loading sessions...</p>
                ) : sessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No active sessions.</p>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg border border-secondary/60 bg-card"
                    >
                      <div className="flex items-center gap-3">
                        <Monitor className="w-5 h-5 text-muted-foreground shrink-0" strokeWidth={1.5} />
                        <div>
                          <p className="text-sm font-medium text-primary">
                            {session.userAgent ?? "Unknown device"}
                            {session.ip ? ` · ${session.ip}` : ""}
                          </p>
                          <p className={cn("text-xs", session.current ? "font-medium text-green-600" : "text-muted-foreground")}>
                            {session.current ? "Active Now" : new Date(session.lastSeenAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {!session.current && (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={revokingId === session.id}
                          onClick={() => void revokeSession(session.id)}
                        >
                          Sign out
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Current Password
                </Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    New Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Confirm New Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                </div>
              </div>
              <Button
                variant="outline"
                className="self-start"
                disabled={changingPassword}
                onClick={() => void updatePassword()}
              >
                {changingPassword ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </div>
        </section>
      </LeftAsideLayout>
    </BasePageCenter>
  );
}
