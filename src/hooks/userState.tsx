import { useState, useContext, createContext, type ReactNode } from "react";

const userProfileContext = createContext({});

export default function UserProfile({ children }: { children: ReactNode }) {
  return (
    <userProfileContext.Provider value={{}}>
      {children}
    </userProfileContext.Provider>
  );
}
