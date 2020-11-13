import Link from "next/link";
import React, { useState, useEffect } from "react";
import useProtectedRoute from "../hooks/protected_route_hook";
import Course from "../components/Course";

export default function JoinCourse(): JSX.Element {
  const [joinCode, setJoinCode] = useState("");
  // Note: we can't directly store a boolean representing whether the join
  // status was 200 because the state won't be immediately updated (won't be
  // updated in time to change window.location.href appropriately)
  const [isFirstJoinAttempt, setIsFirstJoinAttempt] = useState(true);
  const SUCCESSFUL_JOIN_ERR_CODE = 200;

  async function attemptToJoinCourse(): Promise<void> {
    let join_status;
    await fetch("/api/join_course", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ joinCode })
    })
      .then(res => {
        join_status = res.status;
      })
      .catch(reason => console.log(reason));

    if (join_status === SUCCESSFUL_JOIN_ERR_CODE) {
      window.location.href = "/view_courses";
      return;
    }
    setIsFirstJoinAttempt(false);
    setJoinCode("");
  }

  return (
    <div>
      <div>
        <h1>Join a Course</h1>
        <div>
          {!isFirstJoinAttempt && (
            <h2>
              Warning: You entered an invalid course ID. Please try again.
            </h2>
          )}
        </div>
        <div>
          Join code:
          <input value={joinCode} onChange={e => setJoinCode(e.target.value)} />
        </div>
      </div>
      <div
        style={{
          marginTop: 20
        }}
      >
        <button
          disabled={joinCode.length == 0}
          style={{ cursor: "pointer" }}
          onClick={attemptToJoinCourse}
        >
          Join course!
        </button>
      </div>
    </div>
  );
}
