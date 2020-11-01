import { useRouter } from "next/router";
import React, { useState } from "react";
import useProtectedRoute from "../hooks/protected_route_hook";

export default function ViewCourses(): JSX.Element {
  const [newUserName, setNewUserName] = useState("");
  const router = useRouter();

  const [session, loading] = useProtectedRoute();
  if (loading || !session) {
    return <div> Loading... </div>;
  }

  async function submitUserName(): Promise<void> {
    await fetch("/api/auth/set_user_name", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: newUserName })
    });
    session.user.name = newUserName;
    router.back();
  }

  return (
    <div>
      <p>Your user name:</p>
      <input
        value={newUserName}
        onChange={e => setNewUserName(e.target.value)}
      />
      <button style={{ cursor: "pointer" }} onClick={submitUserName}>
        Save!
      </button>
    </div>
  );
}
