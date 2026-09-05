"use client";

import { useState } from "react";

export type LoginTab = "sign-in" | "create-account";

export const useLoginPage = () => {
  const [activeTab, setActiveTab] = useState<LoginTab>("sign-in");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleSignUpSuccess = () => {
    setShowSuccessDialog(true);
    window.setTimeout(() => {
      setShowSuccessDialog(false);
      setActiveTab("sign-in");
    }, 2000);
  };

  return {
    activeTab,
    setActiveTab,
    showSuccessDialog,
    setShowSuccessDialog,
    handleSignUpSuccess,
  };
};
