import React from "react";
import { useSession, signIn, signOut } from "next-auth/client";
import styles from "./Header.module.css";

export default function Header(): JSX.Element {
  const [session] = useSession();

  return (
    <header className={styles.Header}>
      {session && (
        <div>
          <p>Signed in as {session.user.email}</p>
          <p>Your display name is {session.user.name}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      )}
      {!session && (
        <p>
          <button onClick={() => signIn()}>Sign in</button>
        </p>
      )}
    </header>
  );
}
