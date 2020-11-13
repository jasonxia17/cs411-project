import Link from "next/link";
import React, { useState, useEffect } from "react";
import useProtectedRoute from "../hooks/protected_route_hook";
import Course from "../components/Course";

export default function JoinCourse(): JSX.Element {
  const [joinCode, setJoinCode] = useState("");

  async function attemptToJoinCourse(): Promise<void> {
    await fetch("/api/join_course", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ joinCode })
    }).catch(reason => console.log(reason));
    window.location.href = "/view_courses";
  }

  return (
    <div>
      <div>
        <h1>Join a Course</h1>
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
