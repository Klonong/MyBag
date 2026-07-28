"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { makeStore } from "./index";
import { SessionSync } from "./SessionSync";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(() => makeStore());

  return (
    <Provider store={store}>
      <SessionProvider>
        <SessionSync />
        {children}
      </SessionProvider>
    </Provider>
  );
}
