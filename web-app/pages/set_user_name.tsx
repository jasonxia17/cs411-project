import { useRouter } from "next/router";
import React, { useState } from "react";
import useProtectedRoute from "../hooks/protected_route_hook";

export default function ViewCourses(): JSX.Element {
  const [session, loading] = useProtectedRoute();
  const [newUserName, setNewUserName] = useState("");
  const router = useRouter();

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

  if (loading) {
    return <div> Loading... </div>;
  } else if (!session) {
    return <div> Redirecting to signin... </div>;
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
