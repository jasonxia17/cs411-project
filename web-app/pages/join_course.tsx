import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function JoinCourse(): JSX.Element {
  const [joinCode, setJoinCode] = useState("");
  const [errorCode, setErrorCode] = useState(undefined);
  const SUCCESSFUL_JOIN_ERR_CODE = 200;

  const { query } = useRouter();

  async function attemptToJoinCourse(): Promise<void> {
    const joinType = query.join_type as string;
    let shouldJoinAsStudent;
    if (joinType === "student") {
      shouldJoinAsStudent = true;
    } else if (joinType === "instructor") {
      shouldJoinAsStudent = false;
    } else {
      throw "Invalid join type";
    }

    // Note: Need to also store the join status locally because errorCode
    // will be updated asynchronously
    let join_status;
    await fetch("/api/join_course", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ joinCode, shouldJoinAsStudent })
    })
      .then(res => {
        join_status = res.status;
        setErrorCode(res.status);
      })
      .catch(reason => console.log(reason));

    if (join_status === SUCCESSFUL_JOIN_ERR_CODE) {
      window.location.href = "/view_courses";
    }
    setJoinCode("");
  }

  return (
    <div>
      <div>
        <h1>Join a Course</h1>
        <div>
          {errorCode == 404 ? (
            <h2>
              Warning: You entered an invalid course ID. Please try again.
            </h2>
          ) : errorCode == 401 ? (
            <h2>
              Warning: You're already a student/instructor for this course.
            </h2>
          ) : null}
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
