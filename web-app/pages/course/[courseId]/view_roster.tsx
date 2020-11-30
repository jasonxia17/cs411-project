import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useProtectedRoute from "../../../hooks/protected_route_hook";

export default function ViewRoster(): JSX.Element {
  const [students, setStudents] = useState([]);
  const [courseId, setCourseId] = useState("");
  const { query } = useRouter();

  useEffect(() => {
    let courseIdLocal = query.courseId as string;
    if (courseIdLocal != undefined) {
      setCourseId(courseIdLocal);
    } else {
      courseIdLocal = courseId;
    }

    console.log("here");
    // Use local version of course ID because useState doesn't
    // guarantee synchronous updates
    fetch(`/api/course/${courseIdLocal}/view_roster?`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        setStudents(data.students);
      })
      .catch(reason => console.log(reason));
  }, [query]);

  const [session, loading] = useProtectedRoute();
  if (loading || !session) {
    return <div> Loading... </div>;
  }

  async function removeStudentFromRoster(studentId: string): Promise<void> {
    await fetch(`/api/course/${courseId}/remove_from_course`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ studentId })
    });
    location.reload();
  }

  async function matchStudents(): Promise<void> {
    await fetch(`/api/course/${courseId}/find_student_pairings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    location.reload();
  }
  return (
    <div>
      <div style={{ marginTop: 10 }}>
        <button style={{ cursor: "pointer" }} onClick={matchStudents}>
          Match students with partners!
        </button>
      </div>
      <ul>
        {students.map(student => (
          // TODO REFACTOR INTO STUDENT COMPONENT!
          <li key={student.id}>
            <div>
              <h2>Name: {student.name}</h2>
            </div>
            <div
              style={{
                marginTop: 10
              }}
            >
              <button
                style={{ cursor: "pointer" }}
                onClick={() => {
                  removeStudentFromRoster(student.id);
                }}
              >
                Remove student from course
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div
        style={{
          marginTop: 10
        }}
      >
        <button
          style={{ cursor: "pointer" }}
          onClick={() => {
            window.location.href = `/course/${courseId}`;
          }}
        >
          Go back to course forum
        </button>
      </div>
    </div>
  );
}
