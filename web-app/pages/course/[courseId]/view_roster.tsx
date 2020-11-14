import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useProtectedRoute from "../../../hooks/protected_route_hook";

export default function ViewRoster(): JSX.Element {
  const [students, setStudents] = useState([]);
  const { query } = useRouter();

  useEffect(() => {
    const courseId = query.courseId as string;
    if (courseId == undefined) {
      return;
    }

    fetch(`/api/course/${courseId}/view_roster?`, {
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
    await fetch("/api/remove_from_class", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ studentId })
    });
    window.location.href = "/view_courses";
  }

  return (
    <ul>
      {students.map(student => (
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
  );
}
