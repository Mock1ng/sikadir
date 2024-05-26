import React from "react";
import { useSessionStorageState } from "./useStorageState";

const AuthContext = React.createContext<{
  signIn: (role: string) => void;
  signOut: () => void;
  session?: string | null;
}>({
  signIn: () => null,
  signOut: () => null,
  session: ""
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
  const [session, setSession] = useSessionStorageState("session");

  return (
    <AuthContext.Provider
      value={{
        signIn: (role: string | null) => {
          // Perform sign-in logic here
          setSession(role);
        },
        signOut: () => {
          setSession(null);
        },
        session
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
