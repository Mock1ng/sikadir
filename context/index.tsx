import React from "react";
import { useSessionStorageState } from "./useStorageState";

const AuthContext = React.createContext<{
  signIn: (id: string) => void;
  signOut: () => void;
  authId?: string | null;
}>({
  signIn: () => null,
  signOut: () => null,
  authId: ""
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [authId, setAuthId] = useSessionStorageState("authId");

  return (
    <AuthContext.Provider
      value={{
        signIn: (id: string) => {
          setAuthId(id);
        },
        signOut: () => {
          setAuthId(null);
        },
        authId
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
