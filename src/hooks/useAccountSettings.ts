"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";
import { profileService } from "@/services/profile.service";
import { sessionsService, type Session } from "@/services/sessions.service";

export const useAccountSettings = () => {
  const [active, setActive] = useState("personal");
  const router = useRouter();
  const { user, refresh } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [seededUserId, setSeededUserId] = useState<string | null>(null);

  if (user && user.id !== seededUserId) {
    setSeededUserId(user.id);
    setName(user.name ?? "");
    setPhone(user.phone ?? "");
    setLocation(user.location ?? "");
    setBio(user.bio ?? "");
    setAvatarUrl(user.avatarUrl ?? "");
  }

  const savePersonalInfo = async () => {
    if (!user) return;
    setSavingProfile(true);
    const result = await profileService.updateProfile(user.id, {
      name,
      phone,
      location,
      bio,
      avatarUrl,
    });
    setSavingProfile(false);
    if (result.error) {
      toast.error(result.error.message || "Unable to save your profile.");
    } else {
      toast.success("Profile updated.");
      await refresh();
    }
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const updatePassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      toast.error("New password and confirmation must match.");
      return;
    }
    setChangingPassword(true);
    const result = await authService.changePassword(currentPassword, newPassword);
    setChangingPassword(false);
    if (result.error) {
      toast.error(result.error.message || "Unable to change password.");
    } else {
      toast.success("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    void sessionsService.list().then((result) => {
      if (result.data) setSessions(result.data);
      setSessionsLoading(false);
    });
  }, [user]);

  const revokeSession = async (id: string) => {
    setRevokingId(id);
    const result = await sessionsService.revoke(id);
    if (result.error) {
      toast.error(result.error.message || "Unable to revoke that session.");
    } else {
      setSessions((current) => current.filter((session) => session.id !== id));
      toast.success("Session revoked.");
    }
    setRevokingId(null);
  };

  const scrollTo = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSignOut = async () => {
    const { error } = await authService.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Signed out successfully.");
      router.push("/login");
    }
  };

  return {
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
  };
};
