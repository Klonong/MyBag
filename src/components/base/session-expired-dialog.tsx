"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SESSION_EXPIRED_EVENT } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function SessionExpiredDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onSessionExpired = () => setOpen(true);
    window.addEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);
  }, []);

  const handleLogin = () => {
    setOpen(false);
    router.push("/login");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Session Expired</DialogTitle>
          <DialogDescription>
            Your session has expired. Please log in again to continue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleLogin}>Go to Login</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
